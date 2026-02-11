#!/usr/bin/env python3
"""Batch checker/fixer that invokes OpenCode command per skill.

Usage (single command for human):
  python3 .opencode/skills/skill-maintainer/scripts/skills_batch_review_fix.py --workers 5

Behavior:
- Processes skills one-by-one.
- Uses `opencode run --command skills-review-fix-one ...` for each skill.
- Runs up to N jobs in parallel (default: 5).
"""

from __future__ import annotations

import argparse
import concurrent.futures as cf
import datetime as dt
import difflib
import hashlib
import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import List, Sequence, Tuple

ROOT = Path(__file__).resolve().parents[4]
SKILLS_ROOT = ROOT / ".opencode" / "skills"
REPORTS_ROOT = ROOT / "reports"
ANSI_RE = re.compile(r"\x1b\[[0-9;]*[A-Za-z]")


@dataclass
class SkillTarget:
    name: str
    path: Path


@dataclass
class SkillResult:
    name: str
    path: str
    changed: bool
    returncode: int
    command: List[str]
    output: str
    error: str
    changed_lines: int


def now_stamp() -> str:
    return dt.datetime.now().strftime("%Y%m%d_%H%M%S")


def sha256_of(path: Path) -> str:
    data = path.read_bytes()
    return hashlib.sha256(data).hexdigest()


def normalize_stream(value: object) -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    return ""


def strip_ansi(text: str) -> str:
    return ANSI_RE.sub("", text)


def trim_output(text: str, max_chars: int = 4000) -> str:
    cleaned = strip_ansi(text).strip()
    if len(cleaned) <= max_chars:
        return cleaned
    return cleaned[:max_chars] + "\n...<truncated>..."


def count_changed_lines(before_text: str, after_text: str) -> int:
    diff = difflib.unified_diff(before_text.splitlines(), after_text.splitlines(), lineterm="")
    changed = 0
    for line in diff:
        if line.startswith("+++") or line.startswith("---") or line.startswith("@@"):
            continue
        if line.startswith("+") or line.startswith("-"):
            changed += 1
    return changed


def discover_targets(prefix: str, only: Sequence[str]) -> List[SkillTarget]:
    targets: List[SkillTarget] = []
    only_set = set(only)
    for md in sorted(SKILLS_ROOT.glob("*/SKILL.md")):
        name = md.parent.name
        if only_set and name not in only_set:
            continue
        if prefix and not name.startswith(prefix):
            continue
        targets.append(SkillTarget(name=name, path=md))
    return targets


def run_one(target: SkillTarget, dry_run: bool, timeout_sec: int, max_changed_lines: int) -> SkillResult:
    before_text = target.path.read_text(encoding="utf-8")
    before = sha256_of(target.path)
    cmd = [
        "opencode",
        "run",
        "--command",
        "skills-review-fix-one",
        "--",
        "--name",
        target.name,
    ]
    if dry_run:
        cmd.append("--dry-run")

    try:
        proc = subprocess.run(
            cmd,
            cwd=ROOT,
            text=True,
            capture_output=True,
            timeout=timeout_sec,
            check=False,
        )
        after = sha256_of(target.path)
        after_text = target.path.read_text(encoding="utf-8")
        changed_lines = count_changed_lines(before_text, after_text) if before != after else 0
        output = trim_output((proc.stdout or "") + (proc.stderr or ""))
        error = "" if proc.returncode == 0 else f"opencode exit code {proc.returncode}"
        if before != after and changed_lines > max_changed_lines:
            if not dry_run:
                target.path.write_text(before_text, encoding="utf-8")
            error = (
                f"changed lines {changed_lines} exceeds limit {max_changed_lines}; "
                "reverted for safety"
            )
        return SkillResult(
            name=target.name,
            path=str(target.path.relative_to(ROOT)),
            changed=(before != after and not error.startswith("changed lines")),
            returncode=proc.returncode,
            command=cmd,
            output=output,
            error=error,
            changed_lines=changed_lines,
        )
    except subprocess.TimeoutExpired as exc:
        stdout = normalize_stream(exc.stdout)
        stderr = normalize_stream(exc.stderr)
        return SkillResult(
            name=target.name,
            path=str(target.path.relative_to(ROOT)),
            changed=False,
            returncode=124,
            command=cmd,
            output=trim_output(stdout + stderr),
            error=f"timeout after {timeout_sec}s",
            changed_lines=0,
        )


def write_reports(results: List[SkillResult], dry_run: bool) -> Tuple[Path, Path]:
    REPORTS_ROOT.mkdir(parents=True, exist_ok=True)
    stamp = now_stamp()
    json_path = REPORTS_ROOT / f"skills_batch_fix_{stamp}.json"
    md_path = REPORTS_ROOT / f"skills_batch_fix_{stamp}.md"

    payload = {
        "generated_at": dt.datetime.now().isoformat(),
        "dry_run": dry_run,
        "total": len(results),
        "changed": sum(1 for r in results if r.changed),
        "errors": sum(1 for r in results if r.error),
        "results": [
            {
                "name": r.name,
                "path": r.path,
                "changed": r.changed,
                "returncode": r.returncode,
                "changed_lines": r.changed_lines,
                "command": r.command,
                "error": r.error,
                "output": r.output,
            }
            for r in sorted(results, key=lambda x: x.name)
        ],
    }
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        f"# Skills Batch Review/Fix Report ({stamp})",
        "",
        f"- dry_run: {dry_run}",
        f"- total: {payload['total']}",
        f"- changed: {payload['changed']}",
        f"- errors: {payload['errors']}",
        "",
        "## Results",
    ]
    for r in sorted(results, key=lambda x: x.name):
        status = "changed" if r.changed else "no-change"
        if r.error:
            status = "error"
        lines.append(f"- `{r.name}` ({status})")
        lines.append(f"  - returncode: {r.returncode}")
        lines.append(f"  - changed_lines: {r.changed_lines}")
        if r.error:
            lines.append(f"  - error: {r.error}")
    lines.append("")
    md_path.write_text("\n".join(lines), encoding="utf-8")
    return json_path, md_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Batch-check and fix SKILL.md files via OpenCode command")
    parser.add_argument("--workers", type=int, default=5, help="parallel workers (default: 5)")
    parser.add_argument("--dry-run", action="store_true", help="run checks without file writes")
    parser.add_argument("--prefix", default="", help="only process skill names with prefix")
    parser.add_argument("--only", nargs="*", default=[], help="process only these skill names")
    parser.add_argument("--timeout-sec", type=int, default=300, help="timeout per skill process")
    parser.add_argument("--max-changed-lines", type=int, default=80, help="per-file changed line safety limit")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    targets = discover_targets(prefix=args.prefix, only=args.only)
    if not targets:
        print("No skill targets found.")
        return 0

    results: List[SkillResult] = []
    workers = max(1, args.workers)

    with cf.ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [
            executor.submit(run_one, target, args.dry_run, args.timeout_sec, args.max_changed_lines)
            for target in targets
        ]
        for future in cf.as_completed(futures):
            result = future.result()
            results.append(result)
            status = "ERROR" if result.error else ("CHANGED" if result.changed else "OK")
            print(f"[{status}] {result.name}")

    json_path, md_path = write_reports(results, args.dry_run)
    changed = sum(1 for r in results if r.changed)
    errors = sum(1 for r in results if r.error)

    print("\nDone")
    print(f"- total: {len(results)}")
    print(f"- changed: {changed}")
    print(f"- errors: {errors}")
    print(f"- report(json): {json_path.relative_to(ROOT)}")
    print(f"- report(md): {md_path.relative_to(ROOT)}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

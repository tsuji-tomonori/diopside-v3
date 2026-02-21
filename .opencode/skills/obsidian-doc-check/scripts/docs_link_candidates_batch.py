#!/usr/bin/env python3
"""Run docs-link-candidates command for many docs in parallel.

Default parallelism is 10 workers.
"""

from __future__ import annotations

import argparse
import concurrent.futures as cf
import datetime as dt
import json
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import List


@dataclass
class RunResult:
    doc: str
    out: str
    returncode: int
    error: str
    output: str


def discover_targets(docs_root: Path, explicit: List[str]) -> List[Path]:
    if explicit:
        targets: List[Path] = []
        for value in explicit:
            path = Path(value).resolve()
            if path.exists() and path.suffix.lower() == ".md":
                targets.append(path)
        return sorted(set(targets))

    return sorted(
        p
        for p in docs_root.rglob("*.md")
        if p.is_file() and p.name not in {"README.md", "TEMPLATE.md"}
    )


def safe_out_name(path: Path, docs_root: Path) -> str:
    try:
        rel = path.relative_to(docs_root)
        stem = rel.as_posix().replace("/", "__")
    except ValueError:
        stem = path.name
    return stem[:-3] + ".jsonl" if stem.endswith(".md") else stem + ".jsonl"


def run_one(doc: Path, docs_root: Path, out_dir: Path, timeout_sec: int) -> RunResult:
    out_file = out_dir / safe_out_name(doc, docs_root)
    cmd = [
        "opencode",
        "run",
        "--command",
        "docs-link-candidates",
        "--",
        "--doc",
        str(doc),
        "--docs-root",
        str(docs_root),
        "--out",
        str(out_file),
    ]

    try:
        proc = subprocess.run(
            cmd,
            text=True,
            capture_output=True,
            check=False,
            timeout=timeout_sec,
        )
        combined = ((proc.stdout or "") + (proc.stderr or "")).strip()
        return RunResult(
            doc=str(doc),
            out=str(out_file),
            returncode=proc.returncode,
            error="" if proc.returncode == 0 else f"opencode exit code {proc.returncode}",
            output=combined[:2000],
        )
    except subprocess.TimeoutExpired:
        return RunResult(
            doc=str(doc),
            out=str(out_file),
            returncode=124,
            error=f"timeout after {timeout_sec}s",
            output="",
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run docs-link-candidates in parallel")
    parser.add_argument("--docs-root", default="docs", help="docs root")
    parser.add_argument("--workers", type=int, default=10, help="parallel workers")
    parser.add_argument("--timeout-sec", type=int, default=180, help="timeout per doc")
    parser.add_argument("--out-dir", default="reports/link_candidates", help="output directory")
    parser.add_argument(
        "--targets",
        nargs="*",
        default=[],
        help="explicit markdown targets (default: all docs/*.md)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    docs_root = Path(args.docs_root).resolve()
    out_dir = Path(args.out_dir).resolve()

    if not docs_root.exists():
        print(f"ERROR: docs root not found: {docs_root}")
        return 2

    targets = discover_targets(docs_root, args.targets)
    if not targets:
        print("No markdown targets found.")
        return 0

    out_dir.mkdir(parents=True, exist_ok=True)

    results: List[RunResult] = []
    workers = max(1, args.workers)
    with cf.ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [
            executor.submit(run_one, doc, docs_root, out_dir, args.timeout_sec)
            for doc in targets
        ]
        for future in cf.as_completed(futures):
            r = future.result()
            results.append(r)
            status = "OK" if r.returncode == 0 else "ERROR"
            print(f"[{status}] {r.doc}")

    stamp = dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    summary_path = out_dir / f"batch_summary_{stamp}.json"
    payload = {
        "generated_at": dt.datetime.now().isoformat(),
        "docs_root": str(docs_root),
        "workers": workers,
        "total": len(results),
        "success": sum(1 for r in results if r.returncode == 0),
        "errors": sum(1 for r in results if r.returncode != 0),
        "results": [
            {
                "doc": r.doc,
                "out": r.out,
                "returncode": r.returncode,
                "error": r.error,
                "output": r.output,
            }
            for r in sorted(results, key=lambda x: x.doc)
        ],
    }
    summary_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("\nDone")
    print(f"- total: {payload['total']}")
    print(f"- success: {payload['success']}")
    print(f"- errors: {payload['errors']}")
    print(f"- summary: {summary_path}")
    return 1 if payload["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())

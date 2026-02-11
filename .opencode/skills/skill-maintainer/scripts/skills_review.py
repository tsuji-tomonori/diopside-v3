#!/usr/bin/env python3
"""Advisory review helper for .opencode/skills SKILL.md files.

This script does not edit skill files.
It helps reviewers inspect and track one-by-one reviews.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Tuple

import yaml

ROOT = Path(__file__).resolve().parents[4]
SKILLS_ROOT = ROOT / ".opencode" / "skills"
DEFAULT_STATE = ROOT / "reports" / "skills_review_state.json"
DEFAULT_NOTES = ROOT / "reports" / "skills_review_notes.md"

NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
GENERIC_DOC_DESC_RE = re.compile(r"^doc-[a-z0-9-]+ に対応するdiopside文書を規約準拠で作成・更新する$")


@dataclass
class SkillInfo:
    name: str
    path: Path
    line_count: int
    frontmatter: Dict[str, Any]
    body: str
    extra_files: List[Path]


def now_iso() -> str:
    return dt.datetime.now().replace(microsecond=0).isoformat()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_frontmatter(text: str) -> Tuple[Dict[str, Any], str]:
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text
    raw = text[4:end]
    body = text[end + len("\n---\n") :]
    try:
        data = yaml.safe_load(raw) or {}
        if not isinstance(data, dict):
            data = {}
    except Exception:
        data = {}
    return data, body


def load_skills(skills_root: Path) -> List[SkillInfo]:
    skills: List[SkillInfo] = []
    for directory in sorted(p for p in skills_root.iterdir() if p.is_dir()):
        skill_md = directory / "SKILL.md"
        if not skill_md.exists():
            continue
        text = read_text(skill_md)
        fm, body = parse_frontmatter(text)
        extras = sorted(
            p
            for p in directory.rglob("*")
            if p.is_file() and p.name != "SKILL.md"
        )
        skills.append(
            SkillInfo(
                name=directory.name,
                path=skill_md,
                line_count=len(text.splitlines()),
                frontmatter=fm,
                body=body,
                extra_files=extras,
            )
        )
    return skills


def has_any(text: str, words: List[str]) -> bool:
    lower = text.lower()
    return any(word.lower() in lower for word in words)


def body_checks(body: str) -> Dict[str, bool]:
    return {
        "has_when_to_use": has_any(body, ["when to use", "使う条件", "いつ使う", "利用する場合"]),
        "has_when_not": has_any(body, ["when not", "使わない条件", "対象外", "使わない"]),
        "has_output_contract": has_any(body, ["output contract", "出力", "返却", "成果物"]),
        "has_workflow": has_any(body, ["workflow", "手順", "実行フロー", "実施手順"]),
    }


def frontmatter_issues(skill: SkillInfo) -> List[str]:
    fm = skill.frontmatter
    issues: List[str] = []
    name = fm.get("name")
    desc = fm.get("description")

    if name != skill.name:
        issues.append(f"frontmatter.name mismatch (dir={skill.name}, name={name})")
    if not isinstance(name, str) or not NAME_RE.fullmatch(name):
        issues.append("frontmatter.name invalid format")
    if not isinstance(desc, str) or not desc.strip():
        issues.append("frontmatter.description missing")
    elif len(desc) > 1024:
        issues.append("frontmatter.description too long (>1024)")

    allowed = {"name", "description", "license", "compatibility", "metadata"}
    extra = sorted(key for key in fm.keys() if key not in allowed)
    if extra:
        issues.append("unrecognized frontmatter keys: " + ", ".join(extra))
    return issues


def description_hints(desc: str) -> List[str]:
    hints: List[str] = []
    if GENERIC_DOC_DESC_RE.match(desc):
        hints.append("description is generic; add explicit What + When trigger")
    if not has_any(desc, ["時", "場合", "when", "レビュー", "変更", "追加", "作成", "監査"]):
        hints.append("description may be missing trigger words")
    if len(desc) < 25:
        hints.append("description may be too short for discovery")
    return hints


def classify_assets(extra_files: List[Path]) -> Dict[str, int]:
    counts = {"scripts": 0, "references": 0, "assets": 0, "template": 0, "other": 0}
    for path in extra_files:
        parts = path.parts
        if "scripts" in parts:
            counts["scripts"] += 1
        elif "references" in parts:
            counts["references"] += 1
        elif "assets" in parts:
            counts["assets"] += 1
        elif path.name == "TEMPLATE.md":
            counts["template"] += 1
        else:
            counts["other"] += 1
    return counts


def desc_duplicates(skills: List[SkillInfo]) -> Dict[str, List[str]]:
    buckets: Dict[str, List[str]] = {}
    for skill in skills:
        desc = skill.frontmatter.get("description", "")
        if not isinstance(desc, str):
            continue
        buckets.setdefault(desc, []).append(skill.name)
    return {desc: names for desc, names in buckets.items() if len(names) > 1}


def inspect_skill(skill: SkillInfo, duplicates: Dict[str, List[str]]) -> Dict[str, Any]:
    fm = skill.frontmatter
    desc = fm.get("description", "") if isinstance(fm.get("description", ""), str) else ""
    checks = body_checks(skill.body)
    assets = classify_assets(skill.extra_files)

    issues = frontmatter_issues(skill)
    hints = description_hints(desc)
    if not checks["has_when_to_use"]:
        hints.append("body is missing clear 'when to use' section")
    if not checks["has_when_not"]:
        hints.append("body is missing clear 'when NOT to use' section")
    if not checks["has_output_contract"]:
        hints.append("body is missing output contract")
    if skill.line_count > 500:
        hints.append("SKILL.md is long; move details to references/")

    dup = duplicates.get(desc, []) if desc else []
    if len(dup) > 1:
        others = [name for name in dup if name != skill.name]
        hints.append("description is duplicated with: " + ", ".join(others))

    return {
        "name": skill.name,
        "path": str(skill.path.relative_to(ROOT)),
        "line_count": skill.line_count,
        "description": desc,
        "issues": issues,
        "hints": hints,
        "body_checks": checks,
        "assets": assets,
    }


def priority_score(result: Dict[str, Any]) -> int:
    score = 0
    if result["issues"]:
        score += 100
    for hint in result["hints"]:
        if "duplicated" in hint:
            score += 40
        elif "generic" in hint:
            score += 30
        elif "when NOT" in hint:
            score += 20
        elif "when to use" in hint:
            score += 20
        elif "output contract" in hint:
            score += 15
        else:
            score += 5
    score += max(0, min(result["line_count"] // 100, 5))
    return score


def fmt_bool(flag: bool) -> str:
    return "yes" if flag else "no"


def load_state(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {"version": 1, "updated_at": None, "reviews": {}}
    try:
        data = json.loads(read_text(path))
    except Exception:
        return {"version": 1, "updated_at": None, "reviews": {}}
    if not isinstance(data, dict):
        return {"version": 1, "updated_at": None, "reviews": {}}
    if "reviews" not in data or not isinstance(data["reviews"], dict):
        data["reviews"] = {}
    data.setdefault("version", 1)
    data.setdefault("updated_at", None)
    return data


def save_state(path: Path, state: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    state["updated_at"] = now_iso()
    path.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def append_note(path: Path, name: str, result: str, note: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text("# Skills Review Notes\n\n", encoding="utf-8")
    section = [
        f"## {now_iso()} {name}",
        f"- result: {result}",
        f"- note: {note if note else '(no note)'}",
        "",
    ]
    with path.open("a", encoding="utf-8") as handle:
        handle.write("\n".join(section))


def cmd_list(args: argparse.Namespace) -> int:
    skills = load_skills(SKILLS_ROOT)
    state = load_state(Path(args.state))
    duplicates = desc_duplicates(skills)

    rows: List[Tuple[str, str, int, str, str, str]] = []
    for skill in skills:
        detail = inspect_skill(skill, duplicates)
        review = state["reviews"].get(skill.name, {})
        status = review.get("result", "pending")
        checks = detail["body_checks"]
        rows.append(
            (
                skill.name,
                status,
                priority_score(detail),
                fmt_bool(checks["has_when_to_use"]),
                fmt_bool(checks["has_when_not"]),
                fmt_bool(checks["has_output_contract"]),
            )
        )

    rows.sort(key=lambda row: (-row[2], row[0]))
    print("name,status,priority,when,use_not,output")
    for row in rows:
        print(",".join([row[0], row[1], str(row[2]), row[3], row[4], row[5]]))
    return 0


def cmd_next(args: argparse.Namespace) -> int:
    skills = load_skills(SKILLS_ROOT)
    state = load_state(Path(args.state))
    duplicates = desc_duplicates(skills)

    candidates: List[Tuple[int, SkillInfo, Dict[str, Any]]] = []
    for skill in skills:
        if skill.name in state["reviews"]:
            continue
        if args.prefix and not skill.name.startswith(args.prefix):
            continue
        detail = inspect_skill(skill, duplicates)
        candidates.append((priority_score(detail), skill, detail))

    if not candidates:
        print("No pending skills to review.")
        return 0

    candidates.sort(key=lambda row: (-row[0], row[1].name))
    _, skill, detail = candidates[0]
    checks = detail["body_checks"]

    print(f"skill: {skill.name}")
    print(f"path: {detail['path']}")
    print(f"description: {detail['description']}")
    print(f"priority: {priority_score(detail)}")
    print("checks:")
    print(f"  - has_when_to_use: {fmt_bool(checks['has_when_to_use'])}")
    print(f"  - has_when_not: {fmt_bool(checks['has_when_not'])}")
    print(f"  - has_output_contract: {fmt_bool(checks['has_output_contract'])}")
    print("issues:")
    if detail["issues"]:
        for issue in detail["issues"]:
            print(f"  - {issue}")
    else:
        print("  - none")
    print("review_hints:")
    if detail["hints"]:
        for hint in detail["hints"]:
            print(f"  - {hint}")
    else:
        print("  - none")
    print("next:")
    print(f"  - /skills-review-one {skill.name}")
    return 0


def cmd_inspect(args: argparse.Namespace) -> int:
    skills = load_skills(SKILLS_ROOT)
    duplicates = desc_duplicates(skills)
    target = next((skill for skill in skills if skill.name == args.name), None)
    if not target:
        print(f"Skill not found: {args.name}")
        return 1

    detail = inspect_skill(target, duplicates)
    print(f"skill: {detail['name']}")
    print(f"path: {detail['path']}")
    print(f"line_count: {detail['line_count']}")
    print(f"description: {detail['description']}")
    print("frontmatter_issues:")
    if detail["issues"]:
        for issue in detail["issues"]:
            print(f"  - {issue}")
    else:
        print("  - none")
    print("body_checks:")
    for key, flag in detail["body_checks"].items():
        print(f"  - {key}: {fmt_bool(flag)}")
    print("assets:")
    for key, count in detail["assets"].items():
        print(f"  - {key}: {count}")
    print("review_hints:")
    if detail["hints"]:
        for hint in detail["hints"]:
            print(f"  - {hint}")
    else:
        print("  - none")
    return 0


def cmd_log(args: argparse.Namespace) -> int:
    skills = load_skills(SKILLS_ROOT)
    if args.name not in {skill.name for skill in skills}:
        print(f"Skill not found: {args.name}")
        return 1
    state_path = Path(args.state)
    notes_path = Path(args.notes)

    state = load_state(state_path)
    state["reviews"][args.name] = {
        "result": args.result,
        "note": args.note,
        "reviewed_at": now_iso(),
    }
    save_state(state_path, state)
    append_note(notes_path, args.name, args.result, args.note)

    print(f"Logged: {args.name} -> {args.result}")
    print(f"state: {state_path.relative_to(ROOT)}")
    print(f"notes: {notes_path.relative_to(ROOT)}")
    return 0


def cmd_report(args: argparse.Namespace) -> int:
    skills = load_skills(SKILLS_ROOT)
    state = load_state(Path(args.state))
    duplicates = desc_duplicates(skills)

    total = len(skills)
    reviewed = len(state["reviews"])
    passed = sum(1 for review in state["reviews"].values() if review.get("result") == "pass")
    revise = sum(1 for review in state["reviews"].values() if review.get("result") == "revise")

    pending: List[Tuple[int, str]] = []
    for skill in skills:
        if skill.name in state["reviews"]:
            continue
        detail = inspect_skill(skill, duplicates)
        pending.append((priority_score(detail), skill.name))
    pending.sort(key=lambda row: (-row[0], row[1]))

    print(f"total: {total}")
    print(f"reviewed: {reviewed}")
    print(f"pass: {passed}")
    print(f"revise: {revise}")
    print(f"pending: {total - reviewed}")
    if total > 0:
        print(f"progress: {reviewed / total:.1%}")
    print("next_candidates:")
    for score, name in pending[:10]:
        print(f"  - {name} (priority={score})")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="One-by-one skill review helper")
    parser.add_argument("--state", default=str(DEFAULT_STATE), help="review state JSON path")
    parser.add_argument("--notes", default=str(DEFAULT_NOTES), help="review notes markdown path")

    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("list", help="List all skills with quick review signals")

    p_next = sub.add_parser("next", help="Pick next skill to review")
    p_next.add_argument("--prefix", default="", help="Only skills with this name prefix")

    p_inspect = sub.add_parser("inspect", help="Inspect one skill in detail")
    p_inspect.add_argument("--name", required=True, help="skill directory/name")

    p_log = sub.add_parser("log", help="Record review result for one skill")
    p_log.add_argument("--name", required=True, help="skill directory/name")
    p_log.add_argument("--result", required=True, choices=["pass", "revise"])
    p_log.add_argument("--note", default="", help="short rationale")

    sub.add_parser("report", help="Show review progress summary")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    if args.command == "list":
        return cmd_list(args)
    if args.command == "next":
        return cmd_next(args)
    if args.command == "inspect":
        return cmd_inspect(args)
    if args.command == "log":
        return cmd_log(args)
    if args.command == "report":
        return cmd_report(args)
    raise RuntimeError(f"Unknown command: {args.command}")


if __name__ == "__main__":
    raise SystemExit(main())

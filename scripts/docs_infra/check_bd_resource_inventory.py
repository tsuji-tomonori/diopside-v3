#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import shlex
import subprocess
import sys
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
DEFAULT_DOC_PATH = REPO_ROOT / "docs/2.基本設計(BD)/04.インフラ(INF)/31.コンピュートと配備(CMP_DEP)/BD-INF-DEP-005.md"
DEFAULT_REPORT_PATH = REPO_ROOT / "reports/infra_resource_check.md"
DEFAULT_FIXTURE_SITE_PATH = REPO_ROOT / "infra/test/fixtures/site"
DEFAULT_FIXTURE_WEB_PATH = REPO_ROOT / "infra/test/fixtures/web"
DEFAULT_SYNTH_OUTPUT_BASE_DIR = REPO_ROOT / "infra/.build/docs-infra-check"
DEFAULT_INFRA_DIR = REPO_ROOT / "infra"
DEFAULT_STACK_NAME = "DiopsideDeliveryStack"
RESOURCE_TABLE_HEADING = "## AWSリソース一覧（管理対象）"
RESOURCE_CHECK_HEADING = "## AWSリソース比較定義"

RELEVANT_EXACT_PATHS = {
    "Taskfile.yaml",
    "docs/2.基本設計(BD)/04.インフラ(INF)/31.コンピュートと配備(CMP_DEP)/BD-INF-DEP-005.md",
}
RELEVANT_PREFIXES = (
    "infra/",
    "scripts/docs_infra/",
)


@dataclass(frozen=True)
class Resource:
    logical_id: str
    resource_type: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compare BD managed AWS resource inventory against prod cdk synth output.",
    )
    parser.add_argument("--doc-path", type=Path, default=DEFAULT_DOC_PATH)
    parser.add_argument("--report-path", type=Path, default=DEFAULT_REPORT_PATH)
    parser.add_argument("--infra-dir", type=Path, default=DEFAULT_INFRA_DIR)
    parser.add_argument("--stack-name", default=DEFAULT_STACK_NAME)
    parser.add_argument("--fixture-site-path", type=Path, default=DEFAULT_FIXTURE_SITE_PATH)
    parser.add_argument("--fixture-web-path", type=Path, default=DEFAULT_FIXTURE_WEB_PATH)
    parser.add_argument("--synth-output-dir", type=Path)
    parser.add_argument("--template-path", type=Path)
    parser.add_argument("--changed-only", action="store_true")
    return parser.parse_args()


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def write_report(report_path: Path, lines: list[str]) -> None:
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def run_checked(cmd: list[str], cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=cwd,
        check=False,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )


def collect_changed_paths() -> list[str]:
    changed = run_checked(
        ["git", "-c", "core.quotepath=false", "diff", "--name-only", "HEAD"],
        cwd=REPO_ROOT,
    )
    if changed.returncode != 0:
        raise RuntimeError(changed.stderr.strip() or "git diff failed")
    untracked = run_checked(
        ["git", "-c", "core.quotepath=false", "ls-files", "--others", "--exclude-standard"],
        cwd=REPO_ROOT,
    )
    if untracked.returncode != 0:
        raise RuntimeError(untracked.stderr.strip() or "git ls-files failed")

    paths = set()
    for output in (changed.stdout, untracked.stdout):
        for raw_line in output.splitlines():
            path = raw_line.strip()
            if path:
                paths.add(path)
    return sorted(paths)


def is_relevant_change(path: str) -> bool:
    if path in RELEVANT_EXACT_PATHS:
        return True
    return any(path.startswith(prefix) for prefix in RELEVANT_PREFIXES)


def extract_section(content: str, heading: str) -> str:
    pattern = rf"^{re.escape(heading)}\n(?P<body>.*?)(?=^## |\Z)"
    match = re.search(pattern, content, flags=re.MULTILINE | re.DOTALL)
    if not match:
        raise ValueError(f"section not found: {heading}")
    return match.group("body").strip()


def parse_markdown_table(section: str) -> list[dict[str, str]]:
    lines = [line.strip() for line in section.splitlines() if line.strip().startswith("|")]
    if len(lines) < 3:
        raise ValueError("resource table is missing or incomplete")

    headers = [cell.strip() for cell in lines[0].strip("|").split("|")]
    rows: list[dict[str, str]] = []
    for line in lines[2:]:
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) != len(headers):
            continue
        rows.append(dict(zip(headers, cells)))
    if not rows:
        raise ValueError("resource table has no data rows")
    return rows


def parse_yaml_block(section: str) -> dict[str, Any]:
    match = re.search(r"```yaml\s*(?P<body>.*?)```", section, flags=re.DOTALL)
    if not match:
        raise ValueError("resource comparison yaml block not found")
    data = yaml.safe_load(match.group("body"))
    if not isinstance(data, dict):
        raise ValueError("resource comparison yaml must be a mapping")
    return data


def load_inventory(doc_path: Path) -> tuple[list[dict[str, str]], dict[str, Any]]:
    content = doc_path.read_text(encoding="utf-8")
    table = parse_markdown_table(extract_section(content, RESOURCE_TABLE_HEADING))
    config = parse_yaml_block(extract_section(content, RESOURCE_CHECK_HEADING))
    return table, config


def ensure_inventory_alignment(table_rows: list[dict[str, str]], config: dict[str, Any]) -> None:
    table_services = [row["AWSサービス"] for row in table_rows]
    items = config.get("items")
    if not isinstance(items, list):
        raise ValueError("resource comparison config must define items")
    config_services = [item.get("service") for item in items if isinstance(item, dict)]
    if table_services != config_services:
        raise ValueError(
            "resource table services and comparison items do not match:\n"
            f"table={table_services}\nconfig={config_services}"
        )


def ensure_prerequisites(args: argparse.Namespace) -> None:
    if not args.doc_path.is_file():
        raise FileNotFoundError(f"inventory doc not found: {args.doc_path}")
    if not args.fixture_site_path.is_dir():
        raise FileNotFoundError(f"fixture site path not found: {args.fixture_site_path}")
    if not args.fixture_web_path.is_dir():
        raise FileNotFoundError(f"fixture web path not found: {args.fixture_web_path}")
    if not (args.infra_dir / "node_modules").is_dir():
        raise FileNotFoundError(
            "infra/node_modules not found. Run `npm --prefix infra ci` before this check."
        )


def resolve_output_paths(args: argparse.Namespace) -> None:
    if args.synth_output_dir is None:
        args.synth_output_dir = (
            DEFAULT_SYNTH_OUTPUT_BASE_DIR / f"run-{os.getpid()}" / "cdk.out"
        )
    if args.template_path is None:
        args.template_path = args.synth_output_dir / f"{args.stack_name}.template.json"


def synth_template(args: argparse.Namespace, config: dict[str, Any]) -> tuple[Path, list[str], str]:
    deployment_stage = config.get("deployment_stage", "prod")
    tag_environment = config.get("tag_environment", "Production")

    relative_output_dir = args.synth_output_dir.relative_to(args.infra_dir)
    cmd = [
        "npm",
        "run",
        "synth",
        "--",
        "--output",
        str(relative_output_dir),
        "--context",
        f"siteAssetPath={args.fixture_site_path}",
        "--context",
        f"webAssetPath={args.fixture_web_path}",
        "--context",
        f"deploymentStage={deployment_stage}",
        "--context",
        f"tagEnvironment={tag_environment}",
        args.stack_name,
    ]

    args.synth_output_dir.mkdir(parents=True, exist_ok=True)
    completed = subprocess.run(
        cmd,
        cwd=args.infra_dir,
        check=False,
        text=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or "cdk synth failed")

    template_path = args.template_path
    if not template_path.is_file():
        raise FileNotFoundError(f"synthesized template not found: {template_path}")
    return template_path, cmd, completed.stderr.strip()


def load_resources(template_path: Path) -> dict[str, Resource]:
    data = json.loads(template_path.read_text(encoding="utf-8"))
    resources = data.get("Resources")
    if not isinstance(resources, dict):
        raise ValueError("template missing Resources")

    parsed: dict[str, Resource] = {}
    for logical_id, payload in resources.items():
        if not isinstance(payload, dict):
            continue
        resource_type = payload.get("Type")
        if isinstance(resource_type, str):
            parsed[logical_id] = Resource(logical_id=logical_id, resource_type=resource_type)
    return parsed


def matches_any_pattern(value: str, patterns: Iterable[str]) -> bool:
    return any(re.search(pattern, value) for pattern in patterns)


def is_excluded(resource: Resource, exclude: dict[str, Any]) -> bool:
    resource_types = exclude.get("resource_types", [])
    if resource.resource_type in resource_types:
        return True

    type_prefixes = exclude.get("resource_type_prefixes", [])
    if any(resource.resource_type.startswith(prefix) for prefix in type_prefixes):
        return True

    logical_id_patterns = exclude.get("logical_id_patterns", [])
    if matches_any_pattern(resource.logical_id, logical_id_patterns):
        return True

    return False


def selector_matches(resource: Resource, selector: dict[str, Any]) -> bool:
    selector_type = selector.get("type")
    selector_prefix = selector.get("type_prefix")
    if selector_type and resource.resource_type != selector_type:
        return False
    if selector_prefix and not resource.resource_type.startswith(selector_prefix):
        return False

    patterns = selector.get("logical_id_patterns", [])
    if patterns and not matches_any_pattern(resource.logical_id, patterns):
        return False
    return True


def selector_label(selector: dict[str, Any]) -> str:
    if "label" in selector:
        return str(selector["label"])
    if "type" in selector:
        return str(selector["type"])
    return f'{selector.get("type_prefix", "selector")}*'


def compare_inventory(
    resources: dict[str, Resource],
    config: dict[str, Any],
) -> tuple[list[dict[str, Any]], list[Resource]]:
    exclude = config.get("exclude", {})
    remaining = {
        logical_id: resource
        for logical_id, resource in resources.items()
        if not is_excluded(resource, exclude)
    }

    results: list[dict[str, Any]] = []
    for item in config["items"]:
        service = item["service"]
        selectors = item.get("selectors", [])
        for selector in selectors:
            matched = [
                resource
                for resource in remaining.values()
                if selector_matches(resource, selector)
            ]
            expected = int(selector["count"])
            actual = len(matched)
            for resource in matched:
                remaining.pop(resource.logical_id, None)
            results.append(
                {
                    "service": service,
                    "selector": selector_label(selector),
                    "expected": expected,
                    "actual": actual,
                    "matched_ids": [resource.logical_id for resource in matched],
                    "ok": expected == actual,
                }
            )

    unmatched = sorted(
        remaining.values(),
        key=lambda resource: (resource.resource_type, resource.logical_id),
    )
    return results, unmatched


def render_report(
    *,
    generated_at: str,
    doc_path: Path,
    template_path: Path | None,
    synth_cmd: list[str] | None,
    synth_stderr: str,
    table_rows: list[dict[str, str]] | None,
    comparison_rows: list[dict[str, Any]] | None,
    unmatched_resources: list[Resource] | None,
    error_message: str | None,
    skipped_reason: str | None,
) -> list[str]:
    lines = [
        "# Infra Resource Inventory Check",
        "",
        f"- generated_at: {generated_at}",
        f"- inventory_doc: {doc_path.relative_to(REPO_ROOT)}",
    ]
    if template_path is not None:
        lines.append(f"- synthesized_template: {template_path.relative_to(REPO_ROOT)}")
    if synth_cmd is not None:
        lines.append(f"- synth_command: {' '.join(shlex.quote(part) for part in synth_cmd)}")
    if skipped_reason:
        lines.extend(["", "## Result", f"- SKIP: {skipped_reason}", ""])
        return lines
    if synth_stderr:
        lines.extend(["", "## Synth Notes", "```text", synth_stderr, "```"])
    if error_message:
        lines.extend(["", "## Result", "- FAIL", "", "## Error", f"- {error_message}", ""])
        return lines

    assert table_rows is not None
    assert comparison_rows is not None
    assert unmatched_resources is not None

    lines.extend(
        [
            f"- inventory_service_count: {len(table_rows)}",
            f"- compared_selector_count: {len(comparison_rows)}",
            "",
            "## Comparison",
            "| service | selector | expected | actual | status |",
            "|---|---|---:|---:|---|",
        ]
    )
    for row in comparison_rows:
        status = "PASS" if row["ok"] else "FAIL"
        lines.append(
            f'| {row["service"]} | `{row["selector"]}` | {row["expected"]} | {row["actual"]} | {status} |'
        )

    mismatches = [row for row in comparison_rows if not row["ok"]]
    lines.extend(["", "## Mismatches"])
    if not mismatches:
        lines.append("- none")
    else:
        for row in mismatches:
            matched = ", ".join(row["matched_ids"]) if row["matched_ids"] else "none"
            lines.append(
                f'- {row["service"]} / `{row["selector"]}` expected {row["expected"]}, actual {row["actual"]} '
                f"(matched: {matched})"
            )

    lines.extend(["", "## Unmatched Synth Resources"])
    if not unmatched_resources:
        lines.append("- none")
    else:
        for resource in unmatched_resources:
            lines.append(f"- {resource.resource_type} {resource.logical_id}")

    passed = not mismatches and not unmatched_resources
    lines.extend(["", "## Result", f"- {'PASS' if passed else 'FAIL'}", ""])
    return lines


def main() -> int:
    args = parse_args()
    generated_at = now_iso()

    try:
        if args.changed_only:
            changed_paths = collect_changed_paths()
            relevant_paths = [path for path in changed_paths if is_relevant_change(path)]
            if not relevant_paths:
                print("No relevant infra-doc or infra-code changes. Skipping resource inventory check.")
                return 0

        ensure_prerequisites(args)
        resolve_output_paths(args)
        table_rows, config = load_inventory(args.doc_path)
        ensure_inventory_alignment(table_rows, config)
        template_path, synth_cmd, synth_stderr = synth_template(args, config)
        resources = load_resources(template_path)
        comparison_rows, unmatched_resources = compare_inventory(resources, config)
    except Exception as exc:  # noqa: BLE001
        report = render_report(
            generated_at=generated_at,
            doc_path=args.doc_path,
            template_path=args.template_path if args.template_path.exists() else None,
            synth_cmd=None,
            synth_stderr="",
            table_rows=None,
            comparison_rows=None,
            unmatched_resources=None,
            error_message=str(exc),
            skipped_reason=None,
        )
        write_report(args.report_path, report)
        print(str(exc), file=sys.stderr)
        return 1

    report = render_report(
        generated_at=generated_at,
        doc_path=args.doc_path,
        template_path=template_path,
        synth_cmd=synth_cmd,
        synth_stderr=synth_stderr,
        table_rows=table_rows,
        comparison_rows=comparison_rows,
        unmatched_resources=unmatched_resources,
        error_message=None,
        skipped_reason=None,
    )
    write_report(args.report_path, report)

    mismatches = [row for row in comparison_rows if not row["ok"]]
    if mismatches or unmatched_resources:
        print(f"resource inventory mismatch detected. see: {args.report_path}", file=sys.stderr)
        return 1

    print(f"resource inventory check passed. report: {args.report_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

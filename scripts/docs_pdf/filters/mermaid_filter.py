#!/usr/bin/env python3
"""Pandoc JSON filter: render ```mermaid code blocks to images.

- Detects CodeBlock with class 'mermaid' (i.e., fenced block ```mermaid)
- Renders to PNG via Mermaid CLI (mmdc)
- Replaces the CodeBlock with an Image block referencing the rendered file

Env vars:
  MMDC: command to execute Mermaid CLI (default: 'mmdc')
        You can set e.g. MMDC='npx -y @mermaid-js/mermaid-cli@10.9.1'
  MERMAID_OUTPUT_DIR: directory for rendered images (default: .build/docs-pdf/mermaid)
  MERMAID_SCALE: rendering scale (default: 2)
"""

from __future__ import annotations

import hashlib
import json
import os
import shlex
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List


def _run(cmd: List[str]) -> None:
    try:
        subprocess.run(cmd, check=True)
    except FileNotFoundError:
        raise RuntimeError(
            f"Mermaid CLI not found: {cmd[0]!r}. "
            "Install it (e.g. `npm i -g @mermaid-js/mermaid-cli`) "
            "or set MMDC to a runnable command."
        )


def render_mermaid(code: str, out_dir: Path, scale: int, mmdc_cmd: List[str]) -> Path:
    h = hashlib.sha1(code.encode("utf-8")).hexdigest()[:12]
    out_dir.mkdir(parents=True, exist_ok=True)

    mmd_path = out_dir / f"{h}.mmd"
    png_path = out_dir / f"{h}.png"

    if not png_path.exists():
        mmd_path.write_text(code, encoding="utf-8")
        cmd = [
            *mmdc_cmd,
            "-i",
            str(mmd_path),
            "-o",
            str(png_path),
            "-b",
            "transparent",
            "-s",
            str(scale),
        ]
        _run(cmd)

    return png_path


def walk(x: Any, fn) -> Any:
    if isinstance(x, list):
        return [walk(i, fn) for i in x]
    if isinstance(x, dict):
        x2 = fn(x)
        if x2 is not None:
            return x2
        return {k: walk(v, fn) for k, v in x.items()}
    return x


def is_mermaid_codeblock(node: Dict[str, Any]) -> bool:
    if node.get("t") != "CodeBlock":
        return False
    try:
        [[_ident, classes, _kvs], _code] = node.get("c")
        return "mermaid" in classes
    except Exception:
        return False


def replace_mermaid(node: Dict[str, Any], out_dir: Path, scale: int, mmdc_cmd: List[str]) -> Dict[str, Any] | None:
    if not is_mermaid_codeblock(node):
        return None

    [[_ident, _classes, _kvs], code] = node["c"]
    img_path = render_mermaid(code, out_dir=out_dir, scale=scale, mmdc_cmd=mmdc_cmd)

    # Pandoc Image inline: {"t":"Image","c":[[ident, classes, kvs], alt_inlines, [src, title]]}
    image_inline = {
        "t": "Image",
        "c": [
            ["", [], []],
            [{"t": "Str", "c": ""}],
            [str(img_path.as_posix()), ""],
        ],
    }

    # Wrap in Para
    return {"t": "Para", "c": [image_inline]}


def main() -> None:
    doc = json.load(sys.stdin)

    out_dir = Path(os.environ.get("MERMAID_OUTPUT_DIR", ".build/docs-pdf/mermaid"))
    scale_str = os.environ.get("MERMAID_SCALE", "2")
    try:
        scale = int(scale_str)
        if scale < 1 or scale > 10:
            scale = 2
    except ValueError:
        scale = 2

    mmdc_raw = os.environ.get("MMDC", "mmdc")
    mmdc_cmd = shlex.split(mmdc_raw)
    if not mmdc_cmd:
        mmdc_cmd = ["mmdc"]

    def fn(node: Dict[str, Any]) -> Dict[str, Any] | None:
        try:
            return replace_mermaid(node, out_dir=out_dir, scale=scale, mmdc_cmd=mmdc_cmd)
        except RuntimeError as e:
            # Fail fast with a clear message
            print(f"[mermaid_filter] ERROR: {e}", file=sys.stderr)
            raise

    doc = walk(doc, fn)
    json.dump(doc, sys.stdout)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Attach a marking memo to paper items, by id.

A memo is a promise about where marks come from, and check:memos fails the
build if the steps do not add up to the question's marks. So this script
refuses to write a memo that does not balance, rather than letting the guard
catch it afterwards -- the same value, found one step earlier.

It also refuses to overwrite an existing memo. Memos are hand-written and
there is no way to tell a better one from a worse one automatically.

Input is a JSON list on stdin:

  [{"id": "ml-p1-a-1-1",
    "memo": [{"code": "RT", "marks": 1, "text": "Reading the value off"},
             {"code": "A",  "marks": 1, "text": "R180,00"}]}]

Usage:  python3 scratchpad/addmemo.py src/data/papers/mat-lit.ts < batch.json
"""
import json
import re
import sys

CODES = {"M", "A", "CA", "S", "SF", "R", "RT", "C", "J"}


def ts_string(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    return f"'{escaped}'"


def main() -> int:
    path = sys.argv[1]
    batch = json.load(sys.stdin)
    with open(path, encoding="utf-8") as fh:
        src = fh.read()

    applied = 0
    for spec in batch:
        m = re.search(r"^(\s*)id: '" + re.escape(spec["id"]) + r"',$", src, re.M)
        if not m:
            print(f"NOT FOUND: {spec['id']}", file=sys.stderr)
            return 1
        indent = m.group(1)
        end_m = re.compile(r"^" + indent[:-2] + r"\},$", re.M).search(src, m.end())
        if not end_m:
            print(f"{spec['id']}: could not find the end of the item", file=sys.stderr)
            return 1
        start, end = m.start(), end_m.start()
        body = src[start:end]

        if re.search(r"^\s*memo: \[", body, re.M):
            print(f"{spec['id']}: already has a memo -- refusing to overwrite", file=sys.stderr)
            return 1

        marks_m = re.search(r"^\s*marks: (\d+),$", body, re.M)
        if not marks_m:
            print(f"{spec['id']}: no marks property", file=sys.stderr)
            return 1
        marks = int(marks_m.group(1))

        allocated = sum(s["marks"] for s in spec["memo"])
        if allocated != marks:
            print(
                f"{spec['id']}: memo allocates {allocated} but the question is worth {marks}",
                file=sys.stderr,
            )
            return 1
        for step in spec["memo"]:
            if step["code"] not in CODES:
                print(f"{spec['id']}: unknown mark code {step['code']!r}", file=sys.stderr)
                return 1
            if step["marks"] < 1 or not step["text"].strip():
                print(f"{spec['id']}: a step has no marks or no text", file=sys.stderr)
                return 1

        lines = [f"{indent}memo: ["]
        for step in spec["memo"]:
            lines.append(
                f"{indent}  {{ code: '{step['code']}', marks: {step['marks']}, "
                f"text: {ts_string(step['text'])} }},"
            )
        lines.append(f"{indent}],")
        src = src[:end] + "\n".join(lines) + "\n" + src[end:]
        applied += 1

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(src)
    print(f"added {applied} memo(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

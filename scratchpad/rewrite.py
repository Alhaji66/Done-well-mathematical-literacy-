#!/usr/bin/env python3
"""
Rewrite paper items IN PLACE, by id.

The contract, and the reason this is a script rather than a series of edits:
an item's `id` is the key `paperProgress` uses in localStorage, and its
`marks` is what `check:totals` measures a section against. So a rewrite may
change prompt / answer / explanation / context / difficulty / cognitiveLevel
and must NOT change id, label, topicId, grade or marks. The script reads
those four back out of the file it is editing rather than taking them on
trust from the caller, and refuses if the caller passed a different value.

Input is a JSON list on stdin:

  [{"id": "psci-p1-b-1-4",
    "prompt": "...",
    "answer": "...",
    "explanation": "...",
    "context": "...",            # optional; null deletes an existing one
    "difficulty": "Challenge",
    "cognitiveLevel": 4}]

Usage:  python3 scratchpad/rewrite.py src/data/papers/physical-sciences.ts < batch.json
"""
import json
import re
import sys


def ts_string(value: str) -> str:
    """A TypeScript single-quoted literal. Prettier's quote style in this repo."""
    escaped = value.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    return f"'{escaped}'"


# An object literal inside an `items: [...]` array, captured from its `id:`
# line to the closing brace of that object. The items in this corpus are
# written one property per line by Prettier and contain no nested braces, so
# the terminator is the first line that is exactly the closing brace at the
# object's own indentation.
def find_item(src: str, item_id: str):
    m = re.search(r"^(\s*)id: '" + re.escape(item_id) + r"',$", src, re.M)
    if not m:
        return None
    indent = m.group(1)
    start = m.start()
    end_re = re.compile(r"^" + indent[:-2] + r"\},$", re.M)
    m2 = end_re.search(src, m.end())
    if not m2:
        return None
    return start, m2.start(), indent


def prop(src: str, name: str):
    """The value of a single-line string property, or None."""
    m = re.search(r"^\s*" + name + r": (.*?),?$", src, re.M)
    return m.group(1) if m else None


def main() -> int:
    path = sys.argv[1]
    batch = json.load(sys.stdin)
    with open(path, encoding="utf-8") as fh:
        src = fh.read()

    applied = 0
    for spec in batch:
        found = find_item(src, spec["id"])
        if not found:
            print(f"NOT FOUND: {spec['id']}", file=sys.stderr)
            return 1
        start, end, indent = found
        body = src[start:end]

        # Read the invariants out of the file, not out of the caller.
        keep = {}
        for name in ("label", "topicId", "grade", "marks"):
            value = prop(body, name)
            if value is None:
                print(f"{spec['id']}: no {name} property", file=sys.stderr)
                return 1
            keep[name] = value
        # The rebuild below writes a fixed set of properties, so anything else
        # the item carried -- a marking memo, a figure -- would be dropped
        # silently. Refuse rather than lose it.
        for unmanaged in ("memo", "figure", "answerFigure", "options", "correctOptionId"):
            if re.search(r"^\s*" + unmanaged + r":", body, re.M):
                print(
                    f"{spec['id']}: carries a {unmanaged}, which this script does not "
                    "preserve -- edit it by hand instead",
                    file=sys.stderr,
                )
                return 1

        if "marks" in spec and str(spec["marks"]) != keep["marks"]:
            print(
                f"{spec['id']}: marks are {keep['marks']} in the file, "
                f"caller said {spec['marks']} -- a rewrite may not change marks",
                file=sys.stderr,
            )
            return 1

        lines = [
            f"{indent}id: {ts_string(spec['id'])},",
            f"{indent}label: {keep['label']},",
            f"{indent}topicId: {keep['topicId']},",
            f"{indent}grade: {keep['grade']},",
            f"{indent}difficulty: {ts_string(spec['difficulty'])},",
            f"{indent}cognitiveLevel: {spec['cognitiveLevel']},",
            f"{indent}marks: {keep['marks']},",
        ]
        if spec.get("context"):
            lines.append(f"{indent}context: {ts_string(spec['context'])},")
        lines.append(f"{indent}prompt: {ts_string(spec['prompt'])},")
        lines.append(f"{indent}answer: {ts_string(spec['answer'])},")
        lines.append(f"{indent}explanation: {ts_string(spec['explanation'])},")

        src = src[:start] + "\n".join(lines) + "\n" + src[end:]
        applied += 1

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(src)
    print(f"rewrote {applied} item(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

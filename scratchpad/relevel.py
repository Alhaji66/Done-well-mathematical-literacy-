#!/usr/bin/env python3
"""
Change ONLY the cognitiveLevel of paper items, by id.

Separate from rewrite.py on purpose. rewrite.py replaces an item's wording and
needs the new prompt, answer and explanation; this one touches a single number
and must not be able to alter anything else, because it is used to correct
levels on content that is already correct. It refuses if the item is not
currently at the level the caller says it is, so a stale list cannot silently
move an item twice or move the wrong one.

Input is a JSON list on stdin:

  [{"id": "ml-g11-p1-20-1-5", "from": 3, "to": 4}]

Usage:  python3 scratchpad/relevel.py src/data/papers/mat-lit.ts < batch.json
"""
import json
import re
import sys


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
        # The item's own closing brace, two spaces shallower than its fields.
        end_m = re.compile(r"^" + indent[:-2] + r"\},$", re.M).search(src, m.end())
        if not end_m:
            print(f"{spec['id']}: could not find the end of the item", file=sys.stderr)
            return 1
        start, end = m.start(), end_m.start()
        body = src[start:end]

        lvl_m = re.search(r"^(\s*)cognitiveLevel: (\d),$", body, re.M)
        if not lvl_m:
            print(f"{spec['id']}: no cognitiveLevel property", file=sys.stderr)
            return 1
        current = int(lvl_m.group(2))
        if current != spec["from"]:
            print(
                f"{spec['id']}: is at level {current}, caller said {spec['from']} -- "
                "the list is stale, refusing rather than guessing",
                file=sys.stderr,
            )
            return 1

        new_body = (
            body[: lvl_m.start()]
            + f"{lvl_m.group(1)}cognitiveLevel: {spec['to']},"
            + body[lvl_m.end():]
        )
        src = src[:start] + new_body + src[end:]
        applied += 1

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(src)
    print(f"re-levelled {applied} item(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

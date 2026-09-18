#!/usr/bin/env python3
"""
Split one paper item into a short Level 1 recall part plus the original.

WHY SPLITTING RATHER THAN RE-LEVELLING. Every Life Sciences grade is short of
the CAPS 40% Level 1 weighting, and the shortfall cannot be closed by
correcting labels: measured against the CAPS Level 1 verbs, the genuinely
mis-tagged Level 2 marks come to a small fraction of the gap, and most of
even those are compound items ("Define egestion AND explain how it differs
from excretion") that are correctly Level 2. What is missing is not labels
but ITEMS. These papers contain no 1-mark items at all and average over four
marks each, where a real NSC paper opens each question with short
name/state parts. In a fixed 150-mark paper those marks can only come from
the long items themselves.

THE CONTRACT. The new recall item takes `n` marks; the original KEEPS ITS ID
and drops to N - n. Section totals are therefore unchanged, which
check:totals verifies, and no learner's saved progress is orphaned, because
paperProgress keys localStorage by item id. Labels become X.1 (new) and X.2
(original).

THE BRACE. The span this script matches starts at the original item's `id:`
line, not at its opening brace, and ends at the line before its closing
brace. So emitting two objects means closing the new one and reopening
exactly ONE brace for the original -- one too few produces TS1136, one too
many produces a double `{`. Both were caught by tsc the first time round;
this comment is why they should not need to be caught again.

Input is a JSON list on stdin:

  [{"id": "lsci-p1-2020-3-4",     # the item to split
    "marks": 2,                   # marks the NEW recall item takes
    "prompt": "Name the FIVE components of a reflex arc, in order.",
    "answer": "...",
    "explanation": "..."}]

Usage:  python3 scratchpad/split.py src/data/papers/life-sciences.ts < batch.json
"""
import json
import re
import sys


def ts_string(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    return f"'{escaped}'"


def find_item(src: str, item_id: str):
    m = re.search(r"^(\s*)id: '" + re.escape(item_id) + r"',$", src, re.M)
    if not m:
        return None
    indent = m.group(1)
    start = m.start()
    m2 = re.compile(r"^" + indent[:-2] + r"\},$", re.M).search(src, m.end())
    if not m2:
        return None
    return start, m2.start(), indent


def prop(body: str, name: str):
    m = re.search(r"^\s*" + name + r": (.*?),?$", body, re.M)
    return m.group(1) if m else None


def main() -> int:
    path = sys.argv[1]
    batch = json.load(sys.stdin)
    with open(path, encoding="utf-8") as fh:
        src = fh.read()

    done = 0
    for spec in batch:
        found = find_item(src, spec["id"])
        if not found:
            print(f"NOT FOUND: {spec['id']}", file=sys.stderr)
            return 1
        start, end, indent = found
        body = src[start:end]
        outer = indent[:-2]

        label = prop(body, "label")
        topic = prop(body, "topicId")
        grade = prop(body, "grade")
        marks = prop(body, "marks")
        if None in (label, topic, grade, marks):
            print(f"{spec['id']}: a required property is missing", file=sys.stderr)
            return 1

        total = int(marks)
        take = int(spec["marks"])
        if not 1 <= take < total:
            print(
                f"{spec['id']}: cannot take {take} of {total} marks -- the new item "
                f"must be smaller than the original and at least 1 mark",
                file=sys.stderr,
            )
            return 1

        base = label.strip("'")
        new_id = f"{spec['id']}-r"

        new_item = [
            f"{indent}id: {ts_string(new_id)},",
            f"{indent}label: {ts_string(base + '.1')},",
            f"{indent}topicId: {topic},",
            f"{indent}grade: {grade},",
            f"{indent}difficulty: 'Easy',",
            f"{indent}cognitiveLevel: 1,",
            f"{indent}marks: {take},",
            f"{indent}prompt: {ts_string(spec['prompt'])},",
            f"{indent}answer: {ts_string(spec['answer'])},",
            f"{indent}explanation: {ts_string(spec['explanation'])},",
        ]

        # The original, with its id untouched, a .2 label and the balance of
        # the marks. Everything else in it is carried across verbatim.
        kept = []
        for line in body.split("\n"):
            if re.match(r"^\s*label: ", line):
                kept.append(f"{indent}label: {ts_string(base + '.2')},")
            elif re.match(r"^\s*marks: ", line):
                kept.append(f"{indent}marks: {total - take},")
            else:
                kept.append(line)

        src = (
            src[:start]
            + "\n".join(new_item)
            + f"\n{outer}}},\n{outer}{{\n"   # close the new item, reopen ONE brace
            + "\n".join(kept)
            + src[end:]
        )
        done += 1

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(src)
    print(f"split {done} item(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

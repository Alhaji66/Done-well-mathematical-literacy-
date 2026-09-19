#!/usr/bin/env python3
"""
Add sub-topics, with their note content, to a topic in topicNotes.ts.

WHY A SCRIPT. A sub-topic is not just a heading: it is a name the classifier
files questions under AND a block of explanation a learner reads in Learn. Both
have to arrive together or the breakdown shows a heading with nothing under it.
So this takes the name and the points in one go, and refuses a sub-topic with no
points -- an empty one would pass every check and teach nothing.

It also refuses a duplicate name, because two sub-topics with the same name in
one topic make the rule that targets it ambiguous.

Input is a JSON list on stdin:

  [{"topicId": "life-sci-photosynthesis",
    "after": "Limiting factors",          # insert after this one; omit for the end
    "name": "What photosynthesis is",
    "points": ["...", "..."]}]

Usage:  python3 scratchpad/add-subtopic.py < batch.json
"""
import io
import json
import re
import sys

PATH = 'src/data/topicNotes.ts'


def ts(value: str) -> str:
    return "'" + value.replace('\\', '\\\\').replace("'", "\\'") + "'"


def main() -> int:
    batch = json.load(sys.stdin)
    src = io.open(PATH, encoding='utf-8').read()
    added = 0

    for spec in batch:
        if not spec.get('points'):
            print(f"{spec['topicId']} / {spec['name']}: no points -- refusing", file=sys.stderr)
            return 1

        m = re.search(r"topicId: '" + re.escape(spec['topicId']) + r"',", src)
        if not m:
            print(f"topic not found: {spec['topicId']}", file=sys.stderr)
            return 1
        subs_at = src.find('subtopics: [', m.end())
        if subs_at < 0:
            print(f"{spec['topicId']}: no subtopics array", file=sys.stderr)
            return 1
        close = re.compile(r"^    \],$", re.M).search(src, subs_at)
        if not close:
            print(f"{spec['topicId']}: could not find the end of subtopics", file=sys.stderr)
            return 1
        block = src[subs_at:close.start()]

        if re.search(r"name: '" + re.escape(spec['name']) + r"',", block):
            print(f"{spec['topicId']}: '{spec['name']}' already exists -- refusing", file=sys.stderr)
            return 1

        entry = ['      {', f"        name: {ts(spec['name'])},", '        points: [']
        for p in spec['points']:
            entry.append(f'          {ts(p)},')
        entry += ['        ],', '      },', '']
        text = '\n'.join(entry)

        if spec.get('after'):
            anchor = re.search(r"name: '" + re.escape(spec['after']) + r"',", block)
            if not anchor:
                print(f"{spec['topicId']}: no sub-topic named {spec['after']!r}", file=sys.stderr)
                return 1
            end = re.compile(r"^      \},$", re.M).search(src, subs_at + anchor.end())
            at = end.end() + 1
        else:
            at = close.start()
        src = src[:at] + text + src[at:]
        added += 1

    io.open(PATH, 'w', encoding='utf-8').write(src)
    print(f'added {added} sub-topic(s)')
    return 0


if __name__ == '__main__':
    sys.exit(main())

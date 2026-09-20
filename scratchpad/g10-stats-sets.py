#!/usr/bin/env python3
"""
Give each Grade 10 Paper 2 its own statistics data set.

THE PROBLEM. All nine Grade 10 Paper 2 papers built Question 1 on the same
SHAPE of data set: b, b+3, b−3, b+6, b+3, b+9, b+3, with b stepping 12, 14,
16 ... 28. Shifting every value by the same amount changes the mode, the mean
and the median, but it cannot change the interquartile range, the range or the
outlier verdict -- those depend on the gaps, not the position. So 1.5 ("the
IQR") answered 6 in all nine papers, 1.7.2 ("the range") answered 12 in all
nine, and 1.6.2 answered "No outliers" in all nine. A learner working through
the Grade 10 papers met the identical question nine times.

THE FIX. Nine data sets with different SHAPES, so every one of those answers
differs. Each set keeps the properties the questions need: seven values, a
single clear mode, and a whole-number mean. One set carries a genuine outlier,
so that 1.6.2 is a question with something to find rather than a formality.

Q1 and Q3 follow the convention the existing answers use, which is the CAPS
one: with seven values the median is the fourth, and Q1 and Q3 are the medians
of the three values below and the three above.
"""
import json
from statistics import mean

# Paper A keeps the set it has; the other eight are new shapes.
SETS = {
    "math-g10-p2-pred-a": [12, 15, 9, 18, 15, 21, 15],
    "math-g10-p2-pred-b": [55, 68, 66, 54, 53, 57, 53],
    "math-g10-p2-pred-c": [56, 60, 47, 63, 65, 60, 69],
    "math-g10-p2-2025": [20, 40, 23, 40, 41, 12, 34],
    "math-g10-p2-2024": [34, 8, 24, 16, 23, 23, 33],
    "math-g10-p2-2023": [12, 16, 31, 28, 31, 8, 14],
    "math-g10-p2-2022": [32, 20, 27, 47, 27, 42, 29],
    "math-g10-p2-2021": [20, 15, 17, 34, 19, 16, 19],
    "math-g10-p2-2020": [25, 26, 32, 13, 34, 32, 27],
}

# The item ids each paper uses for the seven questions on its data set.
STEM = {
    "math-g10-p2-pred-a": "math-g10-p2-a",
    "math-g10-p2-pred-b": "math-g10-p2-b",
    "math-g10-p2-pred-c": "math-g10-p2-c",
    "math-g10-p2-2025": "math-g10-p2-25",
    "math-g10-p2-2024": "math-g10-p2-24",
    "math-g10-p2-2023": "math-g10-p2-23",
    "math-g10-p2-2022": "math-g10-p2-22",
    "math-g10-p2-2021": "math-g10-p2-21",
    "math-g10-p2-2020": "math-g10-p2-20",
}


def summary(values):
    s = sorted(values)
    lo, med, hi = s[1], s[3], s[5]
    iqr = hi - lo
    low_fence = lo - 1.5 * iqr
    high_fence = hi + 1.5 * iqr
    outliers = [v for v in s if v < low_fence or v > high_fence]
    modes = {v: s.count(v) for v in set(s)}
    top = max(modes.values())
    mode = [v for v, c in modes.items() if c == top]
    return {
        "sorted": s,
        "mode": mode,
        "mean": mean(s),
        "median": med,
        "q1": lo,
        "q3": hi,
        "iqr": iqr,
        "min": s[0],
        "max": s[-1],
        "range": s[-1] - s[0],
        "low_fence": low_fence,
        "high_fence": high_fence,
        "outliers": outliers,
    }


def num(v):
    return str(int(v)) if float(v).is_integer() else f"{v:g}"


def batch_for(paper):
    values = SETS[paper]
    st = STEM[paper]
    d = summary(values)
    assert len(d["mode"]) == 1, (paper, "needs exactly one mode", d["mode"])
    assert float(d["mean"]).is_integer(), (paper, "mean is not whole", d["mean"])
    mode = d["mode"][0]
    listing = ", ".join(str(v) for v in values)
    ascending = ", ".join(str(v) for v in d["sorted"])
    ctx = f"Data set: {listing}"

    out = [
        {
            "id": f"{st}-1-1",
            "context": ctx,
            "prompt": "Determine the mode of the data set.",
            "answer": str(mode),
            "explanation": (
                f"The mode is the value that appears most often. {mode} appears "
                f"{values.count(mode)} times and every other value appears once, so the mode is "
                f"{mode}. A data set can have more than one mode, or none at all if every value "
                "appears the same number of times — but it is never an average of anything, "
                "which is the usual confusion with the mean."
            ),
            "difficulty": "Easy",
            "cognitiveLevel": 1,
        },
        {
            "id": f"{st}-1-2",
            "context": ctx,
            "prompt": "Determine the mean of the data set.",
            "answer": num(d["mean"]),
            "explanation": (
                f"Mean = sum ÷ number of values = {sum(values)} ÷ {len(values)} = {num(d['mean'])}. "
                "Every value is added, including repeats: a value that appears three times is "
                "added three times and counted three times in the divisor."
            ),
            "difficulty": "Easy",
            "cognitiveLevel": 1,
        },
        {
            "id": f"{st}-1-3",
            "context": ctx,
            "prompt": "Arrange the data in ascending order, and determine the median.",
            "answer": f"{ascending}; Median = {d['median']}",
            "explanation": (
                f"Sorting first is not optional — the median is the middle value of the SORTED "
                f"list. With {len(values)} values the middle one is the 4th, which is "
                f"{d['median']}. Reading the middle of the unsorted list gives "
                f"{values[3]}, and the two agree only by accident."
                if values[3] != d["median"]
                else (
                    f"Sorting first is not optional — the median is the middle value of the "
                    f"SORTED list. With {len(values)} values the middle one is the 4th, which is "
                    f"{d['median']}. Here the unsorted list happens to have the same value in "
                    "the middle, which is luck rather than method."
                )
            ),
            "difficulty": "Easy",
            "cognitiveLevel": 2,
        },
        {
            "id": f"{st}-1-4",
            "context": ctx,
            "prompt": "Determine the five-number summary (minimum, Q1, median, Q3, maximum) of the data set.",
            "answer": f"Min = {d['min']}, Q1 = {d['q1']}, Median = {d['median']}, Q3 = {d['q3']}, Max = {d['max']}",
            "explanation": (
                f"Work from the sorted list {ascending}. The median is the 4th value, "
                f"{d['median']}. Q1 is the median of the three values below it — "
                f"{', '.join(str(v) for v in d['sorted'][:3])} — so Q1 = {d['q1']}. Q3 is the "
                f"median of the three above — {', '.join(str(v) for v in d['sorted'][4:])} — so "
                f"Q3 = {d['q3']}. The median itself belongs to neither half."
            ),
            "difficulty": "Moderate",
            "cognitiveLevel": 2,
        },
        {
            "id": f"{st}-1-5",
            "prompt": (
                f"The five-number summary of a data set is Min = {d['min']}, Q1 = {d['q1']}, "
                f"Median = {d['median']}, Q3 = {d['q3']}, Max = {d['max']}. Determine the "
                "interquartile range (IQR), and explain what it measures that the range does not."
            ),
            "answer": (
                f"IQR = Q3 − Q1 = {d['q3']} − {d['q1']} = {d['iqr']}. The range is "
                f"{d['max']} − {d['min']} = {d['range']}, which is decided entirely by the two "
                "most extreme values. The IQR measures the spread of the middle half of the "
                "data, so a single unusually large or small value cannot change it."
            ),
            "explanation": (
                "IQR = Q3 − Q1, and it is the more trustworthy of the two measures of spread. "
                "The range uses only the largest and smallest values, so one unusual reading "
                "moves it a long way; the IQR ignores the bottom quarter and the top quarter "
                "altogether and describes where the middle half of the data sits. That is why a "
                "box-and-whisker plot draws the box from Q1 to Q3: the box IS the IQR."
            ),
            "difficulty": "Moderate",
            "cognitiveLevel": 3,
        },
        {
            "id": f"{st}-1-6",
            "context": ctx,
            "prompt": (
                "Using the rule that a value is an outlier if it is below Q1 − 1.5 × IQR or "
                "above Q3 + 1.5 × IQR, determine whether the data set has any outliers."
            ),
            "answer": (
                (
                    f"Q1 − 1.5 × IQR = {d['q1']} − 1.5 × {d['iqr']} = {num(d['low_fence'])} and "
                    f"Q3 + 1.5 × IQR = {d['q3']} + 1.5 × {d['iqr']} = {num(d['high_fence'])}. "
                    + (
                        f"{', '.join(str(v) for v in d['outliers'])} lies outside that interval, "
                        f"so the data set has {'an outlier' if len(d['outliers']) == 1 else 'outliers'}: "
                        f"{', '.join(str(v) for v in d['outliers'])}."
                        if d["outliers"]
                        else f"Every value lies between {num(d['low_fence'])} and {num(d['high_fence'])}, so there are no outliers."
                    )
                )
            ),
            "explanation": (
                "Both fences have to be worked out and both have to be tested, even when the "
                "answer looks obvious from the list. The 1.5 × IQR rule is a convention, not a "
                "law of nature: it marks values far enough from the middle half to be worth a "
                "second look. Finding an outlier is not a reason to delete it — it is a reason "
                "to ask whether it is a mistake in the recording or a real and interesting value."
            ),
            "difficulty": "Moderate",
            "cognitiveLevel": 3,
        },
        {
            "id": f"{st}-1-7",
            "context": ctx,
            "prompt": "Determine the range of the data set.",
            "answer": str(d["range"]),
            "explanation": (
                f"Range = largest − smallest = {d['max']} − {d['min']} = {d['range']}. The range "
                "is a single number describing how far the data spreads, not an interval: "
                f'writing "{d["min"]} to {d["max"]}" describes the data but does not answer the '
                "question asked."
            ),
            "difficulty": "Easy",
            "cognitiveLevel": 1,
        },
    ]
    return out


if __name__ == "__main__":
    import sys

    rows = []
    for paper in SETS:
        items = batch_for(paper)
        if paper == "math-g10-p2-pred-a":
            # The baseline keeps its data set, so only 1.5 is rewritten -- it
            # asked "using your answer to 1.4", which makes it unanswerable on
            # its own and so unusable in Practise. It now carries the summary.
            items = [i for i in items if i["id"].endswith("-1-5")]
        rows += items
    json.dump(rows, sys.stdout, ensure_ascii=False, indent=1)

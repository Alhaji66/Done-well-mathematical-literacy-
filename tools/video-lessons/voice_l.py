import json, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
import os
HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = os.environ.get("KOKORO_DIR", os.path.join(HERE, "model"))
k = Kokoro(os.path.join(MODEL, "kokoro.onnx"), os.path.join(MODEL, "voices.bin"))
L = json.load(open(sys.argv[1])); voice = sys.argv[2] if len(sys.argv) > 2 else "bf_emma"
B = os.path.join(HERE, "build"); os.makedirs(B, exist_ok=True); GAP = 0.38
timing = []
for sc in L["scenes"]:
    parts, lines, t = [], [], 0.0
    for line in sc["say"]:
        a, sr = k.create(line, voice=voice, speed=0.98, lang="en-gb" if voice.startswith("b") else "en-us")
        nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(nz[0]-600,0):nz[-1]+1200]
        lines.append({"text": line, "start": round(t,3), "end": round(t+len(a)/sr,3)})
        parts += [a, np.zeros(int(GAP*sr), dtype=a.dtype)]; t += len(a)/sr + GAP
    audio = np.concatenate(parts[:-1])
    sf.write(f"{B}/{L['id']}_{sc['id']}.wav", audio, sr)
    timing.append({"id": sc["id"], "dur": round(len(audio)/sr,3), "lines": lines})
json.dump(timing, open(f"{B}/{L['id']}_timing.json","w"), indent=1)
print(L["id"], "speech", round(sum(x["dur"] for x in timing),1), "s")

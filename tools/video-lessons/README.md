# Video lessons

Short narrated lessons, one per topic, built from the same notes the app teaches from. Each lesson is a script in `l_*.js`: a list of scenes, each with the slide's HTML and the sentences spoken over it. An element with `data-at="2"` appears when sentence 2 of its scene starts, so the slide builds up in step with the narration, and every sentence is shown as a caption.

## Making or changing a lesson

You need Node with Playwright and Chromium, Python 3 with `kokoro-onnx` and `soundfile`, and `ffmpeg`.

1. Put the Kokoro voice model (`kokoro.onnx` and `voices.bin`) in `model/`, or point `KOKORO_DIR` at it.
2. Put the two fonts in `fonts/`: `fontsource-variable-inter` and `fontsource-variable-jetbrains-mono` (unpacked from npm).
3. For a lesson file `l_name.js` with id `lesson-id`:

   ```sh
   node dump.mjs l_name.js > build/l_name.json      # the narration
   python3 voice_l.py build/l_name.json bf_emma     # speech, and when each sentence starts
   node render_l.mjs l_name.js lesson-id stills 20 60   # check a few frames
   node render_l.mjs l_name.js lesson-id video      # the MP4, 1280x720, about 4 MB
   ```

4. Add the lesson to `META` in `gen_data.mjs` and run `node gen_data.mjs`. It writes `src/data/topicVideos.ts` and copies the MP4 into `public/videos/`. Save a poster frame as `public/videos/<lesson-id>.jpg` (for example `ffmpeg -ss 0.75 -i build/<lesson-id>.mp4 -frames:v 1 -q:v 4 public/videos/<lesson-id>.jpg`).

Check every number in a script before voicing it. The narration is read exactly as written, so write numbers the way they should be said ("zero comma one five").

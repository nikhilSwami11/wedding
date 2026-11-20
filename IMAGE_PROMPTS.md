# Image prompts

**Style line (end every prompt with it):**
> hand-painted gouache and impasto illustration, visible brush strokes, warm Rajasthani palette (marigold, maroon, teal, blush pink, antique gold), soft painterly shading, no photo-realism, no text, no watermark

**Transparent PNGs:** every cut-out below asks for a real transparent background (PNG with alpha). Check by opening the result on a dark background: no white halo around the edges. If an image comes back with white or a checkerboard, ask again with "real transparent PNG, alpha channel, no background".

---

## 1. Charu & Vaibhav → `public/art/couple.png`

**Attach 4 photos:** 2 of Charu, 2 of Vaibhav. For each person, one clear front-facing face photo in good light, and one showing their body and how they usually stand. No sunglasses, no heavy filters.
**Also attach** `wedding-v2/public/art/varmala.jpeg` as the style reference.

> Paint Charu and Vaibhav as a full-body illustrated couple. Use the attached photos ONLY for their faces, hair, skin tone, build and height difference, and make them clearly recognisable. Use the attached painting ONLY for the art style. Charu is the woman in the first two photos; Vaibhav is the man in the last two. They stand facing each other, mid-varmala, exchanging marigold garlands, both smiling softly. Charu wears a deep maroon and gold bridal lehenga, a cream net veil and gold jewellery. Vaibhav wears an ivory sherwani, a mustard turban and a trailing mustard stole. Full figures from turban to feet, both feet visible, centred, about 8% empty margin on every side. Portrait 3:4. Transparent background (real PNG alpha), nothing else in frame: no floor, no arch, no ground shadow. hand-painted gouache and impasto illustration, visible brush strokes, warm Rajasthani palette, soft painterly shading, no photo-realism, no text, no watermark

Tip: if the faces drift, reply "keep Charu's face closer to photo 1 and Vaibhav's closer to photo 3".

---

## 2. Shared decor set → `public/decor/` (these appear in every section)

One set, reused everywhere. Each: **square, transparent background, centred, empty margin**. If you only make three, make **garland, marigold-corner, petals**.

Prefix every line: *"hand-painted gouache illustration of … on a transparent background (real PNG alpha), no ground shadow, … (style line)"*

| File | Prompt line |
|---|---|
| `garland.png` (**1:3 tall**) | a vertical hanging marigold garland strand, orange and yellow marigold blooms threaded closely on a thin string with a few green leaves, hanging straight down |
| `marigold-corner.png` | a lush cluster of orange and yellow marigolds with green leaves and two pink roses, arranged to sit in a corner, fuller at one corner and trailing off |
| `petals.png` | a loose scatter of 10 separate marigold and rose petals, well spaced apart, mid-fall |
| `diyas.png` | three lit brass-and-clay diyas of different sizes with a few marigold petals around them, warm glow |
| `mogra.png` | a small cluster of white mogra (jasmine) buds with two green leaves |
| `strand.png` (**1:3 tall**) | a hanging jasmine and rose flower string (lari), white jasmine buds with a few pink roses, hanging straight down |

---

## 3. Mehendi scene → `public/mehendi/`

Same method (transparent background), 1:1 unless stated. Top 3 first: **hands, cone, paisley**.

| File | Prompt line |
|---|---|
| `hands.png` (3:4) | a pair of a bride's open hands, palms up, covered in intricate dark-brown mehendi with a lotus in each palm, gold bangles on the wrists |
| `cone.png` | a single mehendi (henna) cone with a nipped tip tied with gold thread, a little dark paste at the tip |
| `paisley.png` | one large ornamental paisley (kairi) in henna-brown linework with dotted detailing, no fill |
| `bowl.png` | a small brass katori of dark henna paste with a thin wooden stick |
| `leaves.png` | a sprig of fresh green henna leaves, 5 to 6 leaves on a thin stem |
| `vine.png` (1:3 tall) | a vertical henna-style vine border with small leaves, flowers and dots, brown linework, symmetrical |
| `bangles.png` | a stack of green and gold glass bangles slightly fanned |
| `mogra.png` | white mogra buds with two green leaves |

---

## 4. Optional: a painted bridge between the fort and the castle → `public/art/bridge.jpeg`

**Attach:** `public/art/hero-far.webp` and `public/art/castle-full.jpeg`
> A single painting that sits between the two attached images: the dusk sky and layered teal and mauve hills of the first image, with the camera much closer to the fort, so crenellated sandstone walls and domed chhatris fill the bottom 60% and the fort's arched gateway is at the exact horizontal centre; the bottom edge should match the sandstone haveli facade of the second image. Portrait 9:16. (style line)

---

## 5. The gate (optional but it would make it much richer)

The doors currently open by squeezing the painted door flat. Real separate door leaves will swing properly.

**Attach:** `public/art/castle-full.jpeg`

**`public/art/door-left.png` and `public/art/door-right.png`** (generate one image with both, then cut it in half, or ask for each separately):
> The two leaves of the arched wooden double door from the attached castle painting, drawn flat and front-on, exactly matching its colour, brass studs, ring handles and carved panels. Each leaf is a tall rectangle with the top of the pair forming a pointed arch when put side by side. Transparent background (real PNG alpha), nothing else in frame. Each leaf portrait, about 1:3.7. (style line)

**`public/art/bridge.jpeg`** is item 4 above, and it is the one that makes the fort-to-gate transition seamless.

---

## 6. Castle interior behind the couple (best fix for the "standing on water" look)

Two empty rooms, no people. Both attach `public/art/varmala.jpeg` and `public/art/courtyard.jpeg` as style references.
Save as `public/art/interior-tall.jpeg` (9:16) and `public/art/interior-wide.jpeg` (16:9), then tell me.

> The inside of the Rajasthani palace the gate opens onto: a grand marble courtyard hall with carved sandstone pillars and scalloped arches, a mandap canopy hung with white jasmine strings and marigold garlands in the middle distance, warm peach-gold evening light, a few lit diyas, a **solid dry marble floor that reaches the bottom edge of the frame** (no water, no pool, no steps), a clear empty space in the centre where two people will stand. No people. The camera is at standing eye height. (style line)

---

## 7. A better fire transition → `public/fire/` (ask Gemini for a solid pure green #00FF00 background, I remove it)

Right now the fire is one painted picture rising. These let me build real layered flames.

- **`flames.png`** (square): *"four separate tall sacred-fire flame tongues of different heights and shapes, each a different orange, gold and crimson brush-stroke flame with a bright yellow-white core, well spaced apart, on a solid pure green background. (style line)"*
- **`havan.png`** (square): *"a brass havan kund (ritual fire pit) seen from the front, with a bright lit fire and a few marigold petals and mango leaves around it, on a solid pure green background. (style line)"*
- **`sparks.png`** (square): *"a loose scatter of 25 glowing golden embers and sparks of different sizes rising, soft glow, on a solid pure green background. (style line)"*

## 8. Night sky for the Save-the-Date (optional; I drew a code version)

`public/art/night-tall.jpeg` (9:16) and `night-wide.jpeg` (16:9): *"a deep plum-to-indigo painted night sky with soft brush clouds, scattered gold stars, a few glowing paper lanterns floating, and a faint silhouette of palace domes and battlements along the bottom edge, large empty space in the centre. No people, no text. (style line)"*

---

## 9. The uniform background set (5 images) → `public/bg/`

One continuous painting, cut into five tall panels, descending **from the night sky down the palace to the water**. No flat colour bands: each panel's bottom edge shows the same scene as the next panel's top edge, so they join naturally, and I crossfade the overlap.

Generate in ONE Gemini chat, in order. First prompt: attach `public/art/castle.jpeg` (palette). Every later prompt: attach the previous panel and say *"continue this painting downward; the top edge of the new image must continue exactly what the bottom edge of the attached image shows"*. All 9:16, no people, no text, calm dim centre.

Palette line: *"hand-painted gouache and impasto, visible brush strokes, night palette of indigo, teal, antique gold, warm sandstone and soft marigold glow, no photo-realism, no text, no people, no watermark."*

1. `01-sky.jpeg` (Save the Date): *"A deep plum-to-indigo night sky with soft brush clouds, gold stars, a few glowing paper lanterns, a warm ember-orange glow at the very top. The bottom edge: the silhouettes of palace rooftops, domed chhatris and battlements against a faint warm horizon glow. [palette line]"*
2. `02-palace.jpeg` (Feast): *"Continuing down: the top edge is those same rooftops and chhatris; below them a dark sandstone palace facade at night with rows of softly glowing jharokha windows and arches, warm golden light, rich and dim. The bottom edge: the palace's base wall with a carved stone terrace parapet. [palette line]"*
3. `03-garden.jpeg` (Mehendi): *"Continuing down: the top edge is that same terrace parapet; below it a moonlit terraced garden with dark teal cypress trees, carved jali screens, small glowing lanterns, mint-teal and gold. The bottom edge: the garden steps meeting a still lake shore. [palette line]"*
4. `04-lake.jpeg` (Venue): *"Continuing down: the top edge is that same garden-and-lake-shore; below it still dark-teal lake water reflecting the lit palace and a thin line of light, soft and low contrast so text stays readable. The bottom edge: calm dark water with the first few tiny floating lights. [palette line]"*
5. `05-diyas.jpeg` (RSVP and footer): *"Continuing down: the top edge is that calm dark water with tiny floating lights; below it many lit diyas and marigold petals floating on the water, glowing brighter and warmer towards the bottom, golden light rising. [palette line]"*

If a seam does not match well, tell me which two and I will blend them harder, or regenerate just that one with the neighbour attached.

"""
Allège les images du PDF.

Chromium fait deux choses coûteuses : il embarque les bitmaps décodés, et il
rééchantillonne à très haute définition toute image posée dans un conteneur
recadré — une photo de 2 200 px ressort à 14 000 px. On ramène donc chaque
image à une définition utile (≈ 300 dpi en pleine page A4) et on la réencode
en JPEG. Le poids tombe d'un facteur vingt sans différence visible.
"""
import sys, io
import pikepdf
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
quality = int(sys.argv[3]) if len(sys.argv) > 3 else 82
cap = int(sys.argv[4]) if len(sys.argv) > 4 else 2400   # px sur le grand côté

pdf = pikepdf.open(src)
seen, done, saved = set(), 0, 0

for page in pdf.pages:
    for name, obj in list(page.get_images().items()):
        key = obj.objgen
        if key in seen:
            continue
        seen.add(key)
        try:
            before = len(obj.read_raw_bytes())
            pim = pikepdf.PdfImage(obj)
            w, h = pim.width, pim.height
            filters = [str(f) for f in (pim.filters or [])]
            # déjà en JPEG et déjà raisonnable : on n'y touche pas
            if "/DCTDecode" in filters and max(w, h) <= cap:
                continue
            im = pim.as_pil_image()
        except Exception:
            continue

        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        if max(im.size) > cap:
            r = cap / max(im.size)
            im = im.resize((max(1, round(im.width * r)), max(1, round(im.height * r))), Image.LANCZOS)

        buf = io.BytesIO()
        im.save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
        data = buf.getvalue()
        if len(data) >= before:
            continue

        obj.write(data, filter=pikepdf.Name("/DCTDecode"))
        obj.ColorSpace = pikepdf.Name("/DeviceRGB" if im.mode == "RGB" else "/DeviceGray")
        obj.BitsPerComponent = 8
        obj.Width, obj.Height = im.size
        for k in ("/DecodeParms", "/Decode", "/SMask"):
            if k in obj:
                del obj[k]
        done += 1
        saved += before - len(data)

pdf.save(dst, linearize=True, compress_streams=True,
         object_stream_mode=pikepdf.ObjectStreamMode.generate)
print(f"{done} images allégées · {saved/1e6:.0f} Mo économisés")

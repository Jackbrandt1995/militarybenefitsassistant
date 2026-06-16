import sys, pypdfium2 as pdfium
pdf = pdfium.PdfDocument(sys.argv[1])
try:
    pdf.init_forms()   # so AcroForm field values (text/checkbox) render
except Exception as e:
    print("init_forms skipped:", e)
pages = [int(x) for x in sys.argv[2].split(',')]
outbase = sys.argv[3]
for pi in pages:
    page = pdf[pi]
    bmp = page.render(scale=2.0)
    img = bmp.to_pil()
    fn = f"{outbase}-p{pi}.png"
    img.save(fn)
    print(fn)

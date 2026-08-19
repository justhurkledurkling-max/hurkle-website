#!/usr/bin/env python3
"""Convert a folder of SVG artwork into print-ready US Letter PDFs.

Usage:
    python3 scripts/svg_to_pdf.py products/<product-slug>/svg products/<product-slug>/pdf

Each SVG is expected to use viewBox="0 0 850 1100" (8.5x11in @ 100dpi).
Requires: pip3 install svglib reportlab
"""
import sys
from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF


def convert_folder(svg_dir: Path, pdf_dir: Path) -> list[Path]:
    pdf_dir.mkdir(parents=True, exist_ok=True)
    out_paths = []
    for svg_path in sorted(svg_dir.glob("*.svg")):
        drawing = svg2rlg(str(svg_path))
        out_path = pdf_dir / (svg_path.stem + ".pdf")
        renderPDF.drawToFile(drawing, str(out_path), autoSize=0)
        out_paths.append(out_path)
        print(f"  {svg_path.name} -> {out_path.name}")
    return out_paths


def merge_pdfs(pdf_paths: list[Path], out_path: Path) -> None:
    from pypdf import PdfWriter

    writer = PdfWriter()
    for p in pdf_paths:
        writer.append(str(p))
    with open(out_path, "wb") as f:
        writer.write(f)
    print(f"  merged -> {out_path.name}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    svg_dir, pdf_dir = Path(sys.argv[1]), Path(sys.argv[2])
    if not svg_dir.is_dir():
        print(f"No such directory: {svg_dir}")
        sys.exit(1)
    print(f"Converting {svg_dir} -> {pdf_dir}")
    convert_folder(svg_dir, pdf_dir)

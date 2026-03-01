"""
Felhasználói dokumentáció validálása.

Használat:
    pip install python-docx
    python scripts/office/validate.py
"""

import sys
import os

try:
    from docx import Document
except ImportError:
    print("HIBA: A 'python-docx' csomag nincs telepítve.")
    print("Telepítés: pip install python-docx")
    sys.exit(1)

PATH = os.path.join("docs", "felhasznaloi-dokumentacio.docx")


def main():
    if not os.path.exists(PATH):
        print(f"HIBA: A fájl nem található: {PATH}")
        sys.exit(1)

    try:
        doc = Document(PATH)
    except Exception as e:
        print(f"HIBA: Nem sikerült megnyitni a fájlt: {e}")
        sys.exit(1)

    paragraphs = doc.paragraphs
    total = len(paragraphs)

    if total == 0:
        print("HIBA: A dokumentum üres (nincsenek bekezdések).")
        sys.exit(1)

    h1_count = sum(1 for p in paragraphs if p.style and p.style.name == "Heading 1")
    h2_count = sum(1 for p in paragraphs if p.style and p.style.name == "Heading 2")
    h3_count = sum(1 for p in paragraphs if p.style and p.style.name == "Heading 3")

    errors = []

    if h1_count < 3:
        errors.append(
            f"Legalább 3 Heading 1 szükséges (3 fejezet), de csak {h1_count} van."
        )

    if total < 50:
        errors.append(
            f"A dokumentum túl rövid: csak {total} bekezdés van (minimum 50 ajánlott)."
        )

    if errors:
        print("VALIDÁCIÓS HIBÁK:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)

    print(f"OK: {PATH}")
    print(f"  Bekezdések:  {total}")
    print(f"  Heading 1:   {h1_count}")
    print(f"  Heading 2:   {h2_count}")
    print(f"  Heading 3:   {h3_count}")
    sys.exit(0)


if __name__ == "__main__":
    main()

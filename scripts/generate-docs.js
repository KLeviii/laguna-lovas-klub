import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  PageBreak,
  TableOfContents,
} from 'docx'
import { writeFile, mkdir } from 'node:fs/promises'
import { chapter1, chapter2, chapter3 } from './docs-content.js'

// --- Helper builders ---

function makeH1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, bold: true, size: 32 })] })
}

function makeH2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, bold: true, size: 26 })] })
}

function makeH3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, bold: true, size: 22 })] })
}

function makeBody(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22 })],
  })
}

function makeBold(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, bold: true, size: 22 })],
  })
}

function makeWarning(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, bold: true, italics: true, size: 22 })],
  })
}

function makeSteps(items) {
  return items.map(
    (item, i) =>
      new Paragraph({
        spacing: { after: 80 },
        numbering: { reference: 'steps-list', level: 0 },
        children: [new TextRun({ text: item, size: 22 })],
      }),
  )
}

function makeQA(q, a) {
  return [
    new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [new TextRun({ text: `K: ${q}`, bold: true, size: 22 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: `V: ${a}`, size: 22 })],
    }),
  ]
}

function makePageBreak() {
  return new Paragraph({ children: [new PageBreak()] })
}

// --- Chapter builder ---

function buildChapter(chapter) {
  const elements = [makeH1(chapter.title)]

  for (const section of chapter.sections) {
    if (section.level === 2) elements.push(makeH2(section.heading))
    else if (section.level === 3) elements.push(makeH3(section.heading))

    for (const node of section.content) {
      switch (node.type) {
        case 'body':
          elements.push(makeBody(node.text))
          break
        case 'bold':
          elements.push(makeBold(node.text))
          break
        case 'warning':
          elements.push(makeWarning(node.text))
          break
        case 'steps':
          elements.push(...makeSteps(node.items))
          break
        case 'qa':
          elements.push(...makeQA(node.q, node.a))
          break
      }
    }
  }

  return elements
}

// --- Main ---

async function main() {
  const doc = new Document({
    title: 'Laguna Lovasklub — Felhasználói dokumentáció',
    creator: 'Laguna Lovasklub',
    numbering: {
      config: [
        {
          reference: 'steps-list',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.START,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
              },
            },
          ],
        },
      ],
    },
    features: {
      updateFields: true,
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1800, right: 1800 },
          },
        },
        children: [
          // Címoldal
          new Paragraph({ spacing: { before: 4000 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Laguna Lovasklub', bold: true, size: 48 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({ text: 'Felhasználói dokumentáció', size: 36 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: new Date().toLocaleDateString('hu-HU'), size: 22 })],
          }),

          makePageBreak(),

          // Tartalomjegyzék
          makeH1('Tartalomjegyzék'),
          new TableOfContents('Tartalomjegyzék', {
            hyperlink: true,
            headingStyleRange: '1-3',
          }),

          makePageBreak(),

          // 1. fejezet
          ...buildChapter(chapter1),

          makePageBreak(),

          // 2. fejezet
          ...buildChapter(chapter2),

          makePageBreak(),

          // 3. fejezet
          ...buildChapter(chapter3),
        ],
      },
    ],
  })

  await mkdir('docs', { recursive: true })
  const buffer = await Packer.toBuffer(doc)
  await writeFile('docs/felhasznaloi-dokumentacio.docx', buffer)
  console.log('Dokumentum sikeresen legenerálva: docs/felhasznaloi-dokumentacio.docx')
}

main().catch((err) => {
  console.error('Hiba a dokumentum generálásakor:', err)
  process.exit(1)
})

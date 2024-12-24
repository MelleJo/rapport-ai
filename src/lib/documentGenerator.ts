import { Document, Paragraph, HeadingLevel, TextRun, Packer, BorderStyle, AlignmentType } from 'docx';

export interface Section {
  title: string;
  content: string;
  graphs?: string[];
}

export interface ReportData {
  title: string;
  samenvatting: string;
  sections: Section[];
  actiepuntenClient?: string[];
  actiepuntenAdviseur?: string[];
}

export const generateWordDocument = async (reportData: ReportData) => {
  const children = [];

  // Add title page
  children.push(
    new Paragraph({
      text: reportData.title,
      heading: HeadingLevel.HEADING_1,
      spacing: {
        after: 400,
      },
      alignment: AlignmentType.CENTER,
    })
  );

  // Add date
  children.push(
    new Paragraph({
      text: new Date().toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 800,
      },
    })
  );

  // Add summary
  children.push(
    new Paragraph({
      text: "Samenvatting van het advies",
      heading: HeadingLevel.HEADING_2,
    })
  );

  // Split summary into paragraphs
  reportData.samenvatting.split('\n').forEach(para => {
    if (para.trim()) {
      children.push(
        new Paragraph({
          text: para.trim(),
          spacing: {
            after: 200,
          },
        })
      );
    }
  });

  // Add sections
  reportData.sections.forEach(section => {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 400,
        },
      })
    );

    // Content paragraphs
    section.content.split('\n').forEach(para => {
      if (para.trim()) {
        children.push(
          new Paragraph({
            text: para.trim(),
            spacing: {
              after: 200,
            },
          })
        );
      }
    });

    // Graph placeholders
    if (section.graphs?.length) {
      section.graphs.forEach(graph => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[GRAFIEK: ${graph}]`,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 200,
              after: 200,
            },
            border: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
            },
          })
        );
      });
    }
  });

  // Add action points
  if (reportData.actiepuntenClient?.length || reportData.actiepuntenAdviseur?.length) {
    children.push(
      new Paragraph({
        text: "Actiepunten",
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 400,
        },
      })
    );

    if (reportData.actiepuntenClient?.length) {
      children.push(
        new Paragraph({
          text: "Actiepunten cliënt",
          heading: HeadingLevel.HEADING_3,
        })
      );

      reportData.actiepuntenClient.forEach(point => {
        children.push(
          new Paragraph({
            text: `• ${point}`,
            spacing: {
              after: 120,
            },
            bullet: {
              level: 0,
            },
          })
        );
      });
    }

    if (reportData.actiepuntenAdviseur?.length) {
      children.push(
        new Paragraph({
          text: "Actiepunten adviseur",
          heading: HeadingLevel.HEADING_3,
          spacing: {
            before: 200,
          },
        })
      );

      reportData.actiepuntenAdviseur.forEach(point => {
        children.push(
          new Paragraph({
            text: `• ${point}`,
            spacing: {
              after: 120,
            },
            bullet: {
              level: 0,
            },
          })
        );
      });
    }
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440, // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children: children,
    }],
    styles: {
      default: {
        heading1: {
          run: {
            size: 32,
            bold: true,
            color: "000000",
            font: "Arial",
          },
          paragraph: {
            spacing: {
              after: 200,
            },
          },
        },
        heading2: {
          run: {
            size: 26,
            bold: true,
            color: "000000",
            font: "Arial",
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        heading3: {
          run: {
            size: 24,
            bold: true,
            color: "000000",
            font: "Arial",
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        document: {
          run: {
            size: 24,
            font: "Arial",
          },
        },
      },
    },
  });

  return await Packer.toBlob(doc);
};

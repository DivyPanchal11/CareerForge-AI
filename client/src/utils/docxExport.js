import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import toast from "react-hot-toast";

/**
 * Exports the resume as an editable, beautifully formatted Microsoft Word (.docx) document.
 * Generates an OpenXML document in memory for recruiters and application portals requiring .docx.
 *
 * @param {object} resume - Resume data object
 */
export async function downloadResumeDocx(resume = {}) {
  try {
    const p = resume.personalInfo || {};
    const primaryColor = (resume.theme?.primaryColor || "#000000").replace("#", "");

    const children = [];

    // Helper: Section Heading with bottom border
    const createSectionHeading = (title) => {
      return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: primaryColor,
            space: 4,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            color: primaryColor,
            font: "Arial",
          }),
        ],
      });
    };

    // 1. Candidate Full Name
    if (p.fullName) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: p.fullName.toUpperCase(),
              bold: true,
              size: 40, // 20pt
              color: primaryColor,
              font: "Arial",
            }),
          ],
        })
      );
    }

    // 2. Job Title
    if (p.jobTitle) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: p.jobTitle,
              italics: true,
              size: 24, // 12pt
              color: "4B5563",
              font: "Arial",
            }),
          ],
        })
      );
    }

    // 3. Contact Line
    const contacts = [
      p.email,
      p.phone,
      p.location,
      p.linkedin,
      p.github,
      p.portfolio,
    ].filter(Boolean);

    if (contacts.length > 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: contacts.join("   |   "),
              size: 18, // 9pt
              color: "6B7280",
              font: "Arial",
            }),
          ],
        })
      );
    }

    // 4. Professional Summary
    if (resume.summary && resume.summary.trim()) {
      children.push(createSectionHeading("Professional Summary"));
      children.push(
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({
              text: resume.summary.trim(),
              size: 21, // 10.5pt
              font: "Calibri",
              color: "1F2937",
            }),
          ],
        })
      );
    }

    // 5. Work Experience
    const activeExp = (resume.experience || []).filter((e) => !e.hidden);
    if (activeExp.length > 0) {
      children.push(createSectionHeading("Work Experience"));

      activeExp.forEach((item) => {
        // Job Title & Company
        const titleLineChildren = [];
        if (item.jobTitle) {
          titleLineChildren.push(
            new TextRun({
              text: item.jobTitle,
              bold: true,
              size: 22,
              font: "Arial",
              color: "111827",
            })
          );
        }
        if (item.company) {
          titleLineChildren.push(
            new TextRun({
              text: ` — ${item.company}`,
              italics: true,
              size: 22,
              font: "Arial",
              color: "374151",
            })
          );
        }

        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: titleLineChildren,
          })
        );

        // Dates & Location
        const dateRange = [item.startDate, item.currentlyWorking ? "Present" : item.endDate]
          .filter(Boolean)
          .join(" – ");
        const metaLine = [dateRange, item.location].filter(Boolean).join("  |  ");

        if (metaLine) {
          children.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({
                  text: metaLine,
                  size: 18,
                  color: "6B7280",
                  font: "Calibri",
                }),
              ],
            })
          );
        }

        // Bullets
        if (item.description) {
          const lines = item.description
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          lines.forEach((line) => {
            const clean = line.replace(/^[•\-\*]\s*/, "");
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: clean,
                    size: 21,
                    font: "Calibri",
                    color: "374151",
                  }),
                ],
              })
            );
          });
        }
      });
    }

    // 6. Education
    const activeEdu = (resume.education || []).filter((e) => !e.hidden);
    if (activeEdu.length > 0) {
      children.push(createSectionHeading("Education"));

      activeEdu.forEach((item) => {
        const degree = [item.degree, item.fieldOfStudy].filter(Boolean).join(" in ");
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text: degree || "Degree",
                bold: true,
                size: 22,
                font: "Arial",
              }),
              new TextRun({
                text: item.institution ? ` — ${item.institution}` : "",
                italics: true,
                size: 22,
                font: "Arial",
              }),
            ],
          })
        );

        const dateRange = [item.startDate, item.endDate].filter(Boolean).join(" – ");
        const eduMeta = [dateRange, item.grade ? `Grade: ${item.grade}` : null]
          .filter(Boolean)
          .join("  |  ");

        if (eduMeta) {
          children.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({
                  text: eduMeta,
                  size: 18,
                  color: "6B7280",
                  font: "Calibri",
                }),
              ],
            })
          );
        }

        if (item.description) {
          children.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({
                  text: item.description.trim(),
                  size: 20,
                  font: "Calibri",
                  color: "4B5563",
                }),
              ],
            })
          );
        }
      });
    }

    // 7. Skills
    const activeSkills = (resume.skills || []).filter((s) => !s.hidden);
    if (activeSkills.length > 0) {
      children.push(createSectionHeading("Skills"));

      const categories = {};
      activeSkills.forEach((s) => {
        const cat = s.category || "Technical Skills";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(s.name);
      });

      Object.keys(categories).forEach((cat) => {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${cat}: `,
                bold: true,
                size: 21,
                font: "Arial",
                color: "111827",
              }),
              new TextRun({
                text: categories[cat].join(", "),
                size: 21,
                font: "Calibri",
                color: "374151",
              }),
            ],
          })
        );
      });
    }

    // 8. Projects
    const activeProj = (resume.projects || []).filter((p) => !p.hidden);
    if (activeProj.length > 0) {
      children.push(createSectionHeading("Key Projects"));

      activeProj.forEach((item) => {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({
                text: item.title,
                bold: true,
                size: 22,
                font: "Arial",
              }),
              new TextRun({
                text: item.technologies ? ` (${item.technologies})` : "",
                italics: true,
                size: 19,
                color: "4B5563",
                font: "Calibri",
              }),
            ],
          })
        );

        if (item.description) {
          const lines = item.description
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          lines.forEach((line) => {
            const clean = line.replace(/^[•\-\*]\s*/, "");
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: clean,
                    size: 21,
                    font: "Calibri",
                    color: "374151",
                  }),
                ],
              })
            );
          });
        }
      });
    }

    // 9. Certifications
    const activeCerts = (resume.certifications || []).filter((c) => !c.hidden);
    if (activeCerts.length > 0) {
      children.push(createSectionHeading("Certifications"));
      activeCerts.forEach((item) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: item.name,
                bold: true,
                size: 21,
                font: "Arial",
              }),
              new TextRun({
                text: [item.issuer, item.issueDate || item.date].filter(Boolean).length
                  ? ` — ${[item.issuer, item.issueDate || item.date].filter(Boolean).join(", ")}`
                  : "",
                size: 21,
                font: "Calibri",
                color: "4B5563",
              }),
            ],
          })
        );
      });
    }

    // 10. Languages
    const activeLangs = (resume.languages || []).filter((l) => !l.hidden);
    if (activeLangs.length > 0) {
      children.push(createSectionHeading("Languages"));
      const langStr = activeLangs
        .map((l) => (l.proficiency ? `${l.language} (${l.proficiency})` : l.language))
        .join(", ");
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: langStr,
              size: 21,
              font: "Calibri",
            }),
          ],
        })
      );
    }

    // Build the Document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720, // 0.5 inch
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fullName = resume?.personalInfo?.fullName?.trim() || "Resume";
    const cleanFilename = `${fullName.replace(/\s+/g, "_")}_Resume.docx`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${cleanFilename}!`, { icon: "📝" });
    return true;
  } catch (err) {
    console.error("DOCX generation error:", err);
    toast.error("Failed to export Word (.docx) document");
    return false;
  }
}

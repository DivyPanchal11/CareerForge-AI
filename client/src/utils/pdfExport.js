import toast from "react-hot-toast";

/**
 * Exports the resume preview as a crisp vector PDF using browser native print-to-PDF.
 * Uses an isolated, full-bleed A4 print iframe to guarantee:
 *  1. 100% true A4 scale (never scaled down by screen zoom or split-pane widths)
 *  2. No duplicate margins or floating borders
 *  3. Searchable, ATS-parseable vector text & exact typography
 *  4. Clean auto-naming based on candidate or resume title
 *
 * @param {string} elementId - ID of preview container (defaults to 'resume-preview-content')
 * @param {object} resume - Resume state object containing personalInfo and title
 */
export async function downloadResumePDF(elementId = "resume-preview-content", resume = {}) {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error("Could not find resume preview to download");
    return false;
  }

  // 1. Determine a clean, professional file name (NEVER defaults to 'client' or 'untitled')
  const fullName = resume?.personalInfo?.fullName?.trim();
  const resumeTitle = resume?.title?.trim();

  let baseName = "Resume";
  if (fullName && fullName.toLowerCase() !== "your name") {
    baseName = `${fullName}_Resume`;
  } else if (
    resumeTitle &&
    resumeTitle.toLowerCase() !== "resume 1" &&
    resumeTitle.toLowerCase() !== "my resume" &&
    resumeTitle.toLowerCase() !== "untitled"
  ) {
    baseName = `${resumeTitle}_Resume`;
  } else if (fullName) {
    baseName = `${fullName}_Resume`;
  } else {
    baseName = "CareerForge_Resume";
  }

  // Sanitize: replace spaces with underscores, strip illegal filesystem characters
  const cleanFilename = baseName
    .replace(/[<>:"/\\|?*]+/g, "")
    .trim()
    .replace(/\s+/g, "_");

  // 2. Clone the element to isolate from screen zoom, split panes, and modals
  const clone = element.cloneNode(true);

  // Remove visual guides not meant for print (page break lines, warning badges)
  clone.querySelectorAll(".no-print").forEach((el) => el.remove());

  // Clean print styling on clone root
  clone.style.transform = "none";
  clone.style.margin = "0";
  clone.style.padding = "0";
  clone.style.boxShadow = "none";
  clone.style.border = "none";
  clone.style.borderRadius = "0";
  clone.style.width = "210mm";
  clone.style.minHeight = "297mm";
  clone.style.maxHeight = "none";
  clone.style.overflow = "visible";

  // Remove previous print frame if any exists
  const existingFrame = document.getElementById("resume-isolated-print-frame");
  if (existingFrame) existingFrame.remove();

  // 3. Create isolated iframe
  const iframe = document.createElement("iframe");
  iframe.id = "resume-isolated-print-frame";
  iframe.style.position = "fixed";
  iframe.style.top = "-99999px";
  iframe.style.left = "-99999px";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  // Copy all stylesheets from main page
  const styleElements = Array.from(
    document.querySelectorAll("link[rel='stylesheet'], style")
  )
    .map((s) => s.outerHTML)
    .join("\n");

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${cleanFilename}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${styleElements}
        <style>
          @page {
            size: A4 portrait;
            margin: 0mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html, body {
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
          }
          #resume-preview-content {
            width: 210mm !important;
            max-width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            transform: none !important;
            overflow: visible !important;
          }
          .resume-page-sheet {
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .resume-page-sheet:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${clone.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  toast.success(`Preparing ${cleanFilename}.pdf... Select 'Save as PDF'`, {
    duration: 3500,
    icon: "📄",
  });

  return new Promise((resolve) => {
    // Small timeout ensures fonts and Tailwind CSS are applied inside iframe
    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        resolve(true);
      } catch (err) {
        console.warn("Iframe print error, falling back to window.print:", err);
        const originalTitle = document.title;
        document.title = cleanFilename;
        window.print();
        document.title = originalTitle;
        resolve(true);
      } finally {
        setTimeout(() => {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 4000);
      }
    }, 280);
  });
}

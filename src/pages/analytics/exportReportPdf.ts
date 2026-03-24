import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function triggerPdfDownload(blob: Blob, fileName: string): void {
  const safeName = fileName.toLowerCase().endsWith(".pdf")
    ? fileName
    : `${fileName}.pdf`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeName;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** html2canvas color parser only supports legacy rgb/hex; not oklch/oklab/lab/etc. */
function hasUnsupportedColorFunction(value: string): boolean {
  if (!value || value === "none" || value === "transparent") return false;
  return /oklch|oklab|lab\(|lch\(|color-mix|hwb\(|color\(srgb|color\(display/i.test(
    value
  );
}

function fallbackForProperty(prop: string): string {
  if (prop === "background-color" || prop === "background") return "#ffffff";
  if (prop === "accent-color") return "#6b7280";
  if (
    prop === "color" ||
    prop === "fill" ||
    prop === "stroke" ||
    prop.endsWith("-color") ||
    (prop.includes("border") && prop.includes("color"))
  ) {
    return "#374151";
  }
  if (prop.includes("shadow")) return "none";
  if (prop.includes("background-image") || prop === "background-image")
    return "none";
  return "";
}

function safeColorValue(prop: string, raw: string): string {
  if (!hasUnsupportedColorFunction(raw)) return raw;
  const fb = fallbackForProperty(prop);
  if (fb === "") {
    if (/shadow/i.test(prop)) return "none";
    if (/background/i.test(prop)) return "#ffffff";
    if (
      /color|fill|stroke|accent|outline|caret|column-rule/i.test(prop) ||
      prop.endsWith("-color")
    ) {
      return "#374151";
    }
    return "#000000";
  }
  return fb;
}

/**
 * html2canvas cannot parse modern color functions (e.g. oklch) from stylesheets.
 * Strip linked styles in the clone and copy computed styles from the live DOM tree
 * onto the clone so values are typically rgb/hex.
 */
function sanitizeCloneForHtml2Canvas(
  clonedDoc: Document,
  originalRoot: HTMLElement,
  clonedRoot: HTMLElement
): void {
  clonedDoc
    .querySelectorAll('link[rel="stylesheet"], style')
    .forEach((node) => node.remove());

  const walk = (original: Element, clone: Element): void => {
    clone.removeAttribute("class");
    [...clone.attributes].forEach((attr) => {
      if (attr.name.startsWith("data-")) {
        clone.removeAttribute(attr.name);
      }
    });

    if ("style" in original && "style" in clone) {
      const styledClone = clone as HTMLElement | SVGElement;
      const cs = window.getComputedStyle(original);
      for (let i = 0; i < cs.length; i++) {
        const prop = cs.item(i);
        if (!prop) continue;
        const val = safeColorValue(prop, cs.getPropertyValue(prop));
        styledClone.style.setProperty(prop, val, cs.getPropertyPriority(prop));
      }
    }

    const n = Math.min(original.children.length, clone.children.length);
    for (let i = 0; i < n; i++) {
      walk(original.children[i], clone.children[i]);
    }
  };

  walk(originalRoot, clonedRoot);

  /** Form controls often expose oklab via accent-color / borders — force safe hex. */
  clonedRoot
    .querySelectorAll("input, textarea, select, button")
    .forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      node.style.setProperty("accent-color", "#6b7280");
      node.style.setProperty("color", "#111827");
      node.style.setProperty("background-color", "#ffffff");
      node.style.setProperty("border-color", "#e5e7eb");
      node.style.setProperty("outline-color", "transparent");
      node.style.setProperty("caret-color", "#111827");
    });

  /** Final pass: strip any remaining modern color syntax on inline styles. */
  const fixInlineColors = (el: Element) => {
    if (!("style" in el)) return;
    const s = (el as HTMLElement | SVGElement).style;
    const props = Array.from(s);
    for (const prop of props) {
      const val = s.getPropertyValue(prop);
      if (hasUnsupportedColorFunction(val)) {
        s.setProperty(prop, safeColorValue(prop, val));
      }
    }
  };
  fixInlineColors(clonedRoot);
  clonedRoot.querySelectorAll("*").forEach(fixInlineColors);

  let node: HTMLElement | null = clonedRoot;
  while (node) {
    node.style.overflow = "visible";
    node.style.maxHeight = "none";
    node.style.height = "auto";
    node = node.parentElement;
  }
}

/**
 * Rasterizes a DOM node to a multi-page A4 PDF and triggers download.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    allowTaint: false,
    onclone: (clonedDoc, clonedElement) => {
      sanitizeCloneForHtml2Canvas(clonedDoc, element, clonedElement);
    },
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 32;
  const imgW = pageWidth - margin * 2;
  const pageContentH = pageHeight - margin * 2;
  const imgH = (canvas.height * imgW) / canvas.width;

  let heightLeft = imgH;
  const y0 = margin;

  pdf.addImage(imgData, "JPEG", margin, y0, imgW, imgH);
  heightLeft -= pageContentH;

  while (heightLeft > 0) {
    const y = margin + heightLeft - imgH;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", margin, y, imgW, imgH);
    heightLeft -= pageContentH;
  }

  const blob = pdf.output("blob");
  triggerPdfDownload(blob, fileName);
}

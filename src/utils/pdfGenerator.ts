import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  onProgress?: (step: string) => void;
}

export async function exportInvoiceToPDF(
  elementId: string = 'invoice-print-area',
  options: PDFExportOptions = {}
): Promise<boolean> {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    throw new Error('Invoice preview element was not found in document.');
  }

  options.onProgress?.('Preparing document...');

  // Create an off-screen container to ensure the document is rendered
  // with exact A4 proportions and full visibility, even if currently hidden on mobile tab
  const wrapper = document.createElement('div');
  wrapper.id = 'pdf-export-temp-wrapper';
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-99999px';
  wrapper.style.top = '0';
  wrapper.style.width = '800px';
  wrapper.style.minHeight = '1120px';
  wrapper.style.zIndex = '-99999';
  wrapper.style.backgroundColor = '#ffffff';
  wrapper.style.display = 'block';
  wrapper.style.visibility = 'visible';
  wrapper.style.opacity = '1';

  // Deep clone the invoice sheet
  const clone = originalElement.cloneNode(true) as HTMLElement;
  clone.id = 'invoice-print-area-clone';
  clone.style.display = 'block';
  clone.style.visibility = 'visible';
  clone.style.transform = 'none';
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0px';
  clone.style.margin = '0 auto';
  clone.style.padding = '40px 44px';
  clone.style.width = '800px';
  clone.style.maxWidth = '800px';
  clone.style.boxSizing = 'border-box';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#0f172a';

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    options.onProgress?.('Rendering invoice...');

    // Small delay to allow layout calculation
    await new Promise((resolve) => setTimeout(resolve, 80));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 800,
      windowWidth: 1024,
    });

    options.onProgress?.('Building PDF document...');

    // Standard A4 dimensions (mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Additional pages if invoice spans multiple pages
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const safeFilename = options.filename
      ? options.filename.replace(/[^a-zA-Z0-9-_]/g, '_')
      : 'Invoice';

    options.onProgress?.('Downloading...');
    pdf.save(`${safeFilename}.pdf`);

    return true;
  } catch (error) {
    console.error('Canvas export error, invoking print fallback:', error);
    // If canvas fails, fallback gracefully to print window
    window.print();
    return true;
  } finally {
    // Always clean up the temporary DOM clone
    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
  }
}

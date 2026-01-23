'use client';

import { pdf } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import QRCode from 'qrcode';
import type { Invoice } from '@/types/api';

// Type for PDF Document component
type PDFDocumentComponent = ReactElement<any>;

/**
 * Generate QR Code as Data URL
 * FBR Requirements: 1.0 x 1.0 inch (72x72 pixels at 72 DPI)
 * Auto-selects version based on data size (minimum version 2)
 */
export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      width: 72, // 1 inch at 72 DPI
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}

/**
 * Generate QR Code data string from invoice
 * Simplified format to fit in smaller QR codes
 */
export function getQRCodeData(invoice: Invoice): string {
  const total = invoice.items?.reduce((sum, item) => sum + parseFloat(item.totalValues?.toString() || '0'), 0).toFixed(2);
  
  // Compact format: InvoiceNo|Date|SellerNTN|BuyerNTN|Total
  const data = [
    invoice.fbrInvoiceNumber || 'N/A',
    (invoice.invoiceDate || '').split('T')[0],
    invoice.user?.ntncnic || '',
    invoice.buyer?.ntncnic || '',
    total
  ].join('|');
  
  return data;
}

/**
 * Download invoice as PDF
 */
export async function downloadInvoicePDF(
  invoicePDFComponent: PDFDocumentComponent,
  fileName: string
): Promise<void> {
  try {
    const blob = await pdf(invoicePDFComponent as any).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

/**
 * Open invoice PDF in new window for printing
 */
export async function printInvoicePDF(
  invoicePDFComponent: PDFDocumentComponent
): Promise<void> {
  try {
    const blob = await pdf(invoicePDFComponent as any).toBlob();
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  } catch (error) {
    console.error('Error printing PDF:', error);
    throw new Error('Failed to print PDF');
  }
}

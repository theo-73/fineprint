"""
PDF Invoice Parser and Sample Generator for FinePrint (receipt-mcp)
Extracts untrusted text from PDF files using pdfplumber, sanitizes it,
and extracts structured ExtractedOrder facts.
"""

import os
from typing import Optional
from pathlib import Path
import pdfplumber
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from .extractor import OrderExtractor, ExtractedOrder

class PDFInvoiceParser:
    @staticmethod
    def extract_text_from_pdf(pdf_path: str) -> str:
        """Extracts raw text from all pages of a PDF invoice."""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF invoice not found at {pdf_path}")
        
        extracted_text = []
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
        return "\n".join(extracted_text)

    @classmethod
    def parse_invoice(cls, pdf_path: str) -> ExtractedOrder:
        """Parses a PDF file into a strict ExtractedOrder schema."""
        raw_text = cls.extract_text_from_pdf(pdf_path)
        return OrderExtractor.extract_order_from_text(raw_text)


def generate_sample_invoice(
    output_path: str,
    marketplace: str = "Amazon India",
    order_id: str = "402-8921473-9821401",
    purchase_date: str = "15 Oct 2026",
    product_name: str = "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: str = "Sony",
    amount_inr: float = 24990.0,
    seller_name: str = "Appario Retail Pvt Ltd",
    seller_gstin: str = "29AAACA0123M1Z5",
    serial_number: str = "SN-SONY-XM5-99281"
):
    """Generates a realistic Indian e-commerce PDF invoice for testing and demos."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    doc = SimpleDocTemplate(output_path, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    story = []

    title_style = ParagraphStyle(
        'InvoiceTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1E293B'),
    )
    normal_style = ParagraphStyle(
        'NormalText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
    )
    bold_style = ParagraphStyle(
        'BoldText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0F172A'),
    )

    story.append(Paragraph(f"Tax Invoice / Bill of Supply — {marketplace}", title_style))
    story.append(Spacer(1, 10))

    header_data = [
        [
            Paragraph(f"<b>Sold By:</b><br/>{seller_name}<br/>GSTIN: {seller_gstin}<br/>Warehouse: Indiranagar, Bengaluru, KA 560038", normal_style),
            Paragraph(f"<b>Order Details:</b><br/>Order Number: <b>{order_id}</b><br/>Order Date: {purchase_date}<br/>Invoice Date: {purchase_date}", normal_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[270, 270])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 15))

    items_data = [
        [
            Paragraph("<b>Description</b>", bold_style),
            Paragraph("<b>Serial / IMEI</b>", bold_style),
            Paragraph("<b>Qty</b>", bold_style),
            Paragraph("<b>Total (INR)</b>", bold_style)
        ],
        [
            Paragraph(f"<b>{product_name}</b><br/>Brand: {brand} | 1 Year Manufacturer Warranty", normal_style),
            Paragraph(serial_number, normal_style),
            Paragraph("1", normal_style),
            Paragraph(f"Rs. {amount_inr:,.2f}", bold_style)
        ],
        [
            Paragraph("<b>Total Amount Paid (Inclusive of 18% GST)</b>", bold_style),
            Paragraph("", normal_style),
            Paragraph("", normal_style),
            Paragraph(f"<b>Rs. {amount_inr:,.2f}</b>", bold_style)
        ]
    ]
    items_table = Table(items_data, colWidths=[250, 130, 40, 120])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 20))

    disclaimer = Paragraph(
        "<i>Return Policy: 7-day replacement window. For technical defects after 7 days, contact authorized brand service center under CPA 2019 statutory warranty.</i>",
        normal_style
    )
    story.append(disclaimer)

    doc.build(story)
    return output_path

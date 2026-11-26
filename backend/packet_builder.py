"""
Packet Builder for FinePrint (FastAPI Agent Layer)
Compiles formal, verifiable consumer claim packets:
1. Formal Legal Notice & Claim Packet (ReportLab PDF)
2. WhatsApp Escalation Message (Plain text formatted for instant messaging)
3. NCH (National Consumer Helpline) Portal Grievance Submission Format
"""

import os
from typing import Dict, Any, List, Optional
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas that accumulates pages and renders 'Page X of Y' 
    plus statutory compliance footer on every page.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count: int):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor('#64748B'))
        # A4 width = 595.28 points; printable width = 515.28 (margins 40pt)
        footer_text = f"Confidential Statutory Grievance Packet | CPA 2019 & E-Commerce Rules 2020 | Page {self._pageNumber} of {page_count}"
        self.drawCentredString(595.28 / 2.0, 25, footer_text)
        self.setStrokeColor(colors.HexColor('#CBD5E1'))
        self.setLineWidth(0.5)
        self.line(40, 36, 555.28, 36)
        self.restoreState()

class PacketBuilder:
    """
    Assembles court- and grievance-ready claim documentation citing exact Indian statutes.
    """

    @staticmethod
    def generate_pdf_packet(
        case_data: Dict[str, Any],
        output_pdf_path: str
    ) -> str:
        os.makedirs(os.path.dirname(os.path.abspath(output_pdf_path)), exist_ok=True)
        doc = SimpleDocTemplate(
            output_pdf_path,
            pagesize=A4,
            leftMargin=40,
            rightMargin=40,
            topMargin=40,
            bottomMargin=50
        )
        styles = getSampleStyleSheet()
        story = []

        # Color palette: Professional navy and slate
        PRIMARY_COLOR = colors.HexColor('#0F172A')
        ACCENT_COLOR = colors.HexColor('#1E3A8A')
        MUTED_COLOR = colors.HexColor('#475569')
        BORDER_COLOR = colors.HexColor('#CBD5E1')
        ALERT_BG = colors.HexColor('#F8FAFC')

        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=16,
            leading=20,
            textColor=PRIMARY_COLOR,
            alignment=1 # Center
        )
        subtitle_style = ParagraphStyle(
            'DocSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=14,
            textColor=ACCENT_COLOR,
            alignment=1 # Center
        )
        heading_style = ParagraphStyle(
            'SectionHead',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=15,
            textColor=ACCENT_COLOR,
            spaceBefore=8,
            spaceAfter=4
        )
        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=13,
            textColor=PRIMARY_COLOR
        )
        bold_body = ParagraphStyle(
            'BoldBody',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=13,
            textColor=PRIMARY_COLOR
        )
        citation_box_style = ParagraphStyle(
            'CitationBox',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=8.5,
            leading=12,
            textColor=colors.HexColor('#1E293B')
        )

        # 1. Header Banner
        claim_ref = case_data.get("claim_ref", f"FP-IN-{datetime.now().strftime('%Y%m%d%H%M')}")
        today_str = datetime.now().strftime("%d %B %Y")
        story.append(Paragraph("FORMAL STATUTORY NOTICE OF CONSUMER DEFECT CLAIM", title_style))
        story.append(Spacer(1, 4))
        story.append(Paragraph(
            "Issued under the Consumer Protection Act, 2019 & The Consumer Protection (E-Commerce) Rules, 2020",
            subtitle_style
        ))
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_COLOR, spaceAfter=12))

        # 2. Reference & Date
        ref_table_data = [
            [
                Paragraph(f"<b>Notice Ref:</b> {claim_ref}", body_style),
                Paragraph(f"<b>Date:</b> {today_str}", body_style)
            ]
        ]
        ref_table = Table(ref_table_data, colWidths=[250, 250])
        ref_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(ref_table)
        story.append(Spacer(1, 10))

        # 3. Addressed To (Respondent)
        seller = case_data.get("seller_name", "Authorized Retailer")
        brand = case_data.get("brand", "Manufacturer")
        marketplace = case_data.get("marketplace", "E-Commerce Platform")
        complainant = case_data.get("complainant_name", "Consumer / Purchaser")
        
        parties_data = [
            [
                Paragraph(f"<b>TO (RESPONDENT / SERVICE ENTITY):</b><br/>"
                          f"Grievance Officer & Support Leadership<br/>"
                          f"<b>Entity:</b> {seller} / {brand}<br/>"
                          f"<b>Marketplace Platform:</b> {marketplace}<br/>"
                          f"<b>Jurisdiction:</b> Consumer Protection Act, 2019 (India)", body_style),
                Paragraph(f"<b>FROM (COMPLAINANT):</b><br/>"
                          f"<b>Name:</b> {complainant}<br/>"
                          f"<b>Contact:</b> Via Registered Account / Email<br/>"
                          f"<b>Status:</b> Consumer under Section 2(7) of CPA 2019", body_style)
            ]
        ]
        parties_table = Table(parties_data, colWidths=[250, 250])
        parties_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('PADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP')
        ]))
        story.append(parties_table)
        story.append(Spacer(1, 12))

        # 4. Transaction & Product Particulars
        story.append(Paragraph("1. PRODUCT AND TRANSACTION PARTICULARS", heading_style))
        prod_data = [
            [Paragraph("<b>Product Description</b>", bold_body), Paragraph(case_data.get("product_name", "Electronics Product"), body_style)],
            [Paragraph("<b>Order / Invoice ID</b>", bold_body), Paragraph(case_data.get("order_id", "ORD-N/A"), body_style)],
            [Paragraph("<b>Purchase Date</b>", bold_body), Paragraph(case_data.get("purchase_date", "N/A"), body_style)],
            [Paragraph("<b>Serial / IMEI Number</b>", bold_body), Paragraph(case_data.get("serial_number") or "Documented on invoice", body_style)],
            [Paragraph("<b>Total Consideration Paid</b>", bold_body), Paragraph(f"Rs. {float(case_data.get('amount_inr', 0.0)):,.2f}", body_style)],
            [Paragraph("<b>Statutory Warranty Period</b>", bold_body), Paragraph(f"{case_data.get('warranty_months', 12)} Months Standard Warranty", body_style)]
        ]
        prod_table = Table(prod_data, colWidths=[160, 340])
        prod_table.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#F8FAFC')),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
        ]))
        story.append(prod_table)
        story.append(Spacer(1, 10))

        # 5. Statement of Facts & Inherent Defect
        story.append(Paragraph("2. STATEMENT OF INHERENT DEFECT & GRIEVANCE", heading_style))
        defect_desc = case_data.get("defect_description", "The device stopped working within the warranty period without external physical impact.")
        story.append(Paragraph(
            f"1. The complainant purchased the subject goods on {case_data.get('purchase_date', 'recent date')} for valuable consideration.<br/>"
            f"2. During normal and intended consumer usage, the product exhibited the following inherent defect/deficiency:<br/>"
            f"&nbsp;&nbsp;&nbsp;&nbsp;<i>\"{defect_desc}\"</i><br/>"
            f"3. The complainant reported the defect and was either bounced between platform customer support and the service center, or denied redress citing an expired short-term (e.g. 7-day) return window.",
            body_style
        ))
        story.append(Spacer(1, 10))

        # 6. Applicable Statutory Provisions
        story.append(Paragraph("3. STATUTORY PROVISIONS & LEGAL LIABILITIES", heading_style))
        statutes_text = (
            "<b>A. Consumer Protection (E-Commerce) Rules, 2020 — Rule 6(3)(a) read with Rule 7(4):</b><br/>"
            "<i>'No seller shall refuse to take back goods, or withdraw or discontinue services provided, or refuse to refund consideration paid, if such goods or services are defective, deficient or spurious.'</i> The statutory right to remedy supersedes contractual return window expiration.<br/><br/>"
            "<b>B. Consumer Protection Act, 2019 — Section 84 & Section 86 (Product Liability):</b><br/>"
            "The manufacturer and seller are strictly liable in a product liability action for products suffering from manufacturing defect or deviation from express warranty specifications.<br/><br/>"
            "<b>C. E-Commerce Rules, 2020 — Rule 4(5) (Statutory Timelines):</b><br/>"
            "The designated Grievance Officer is legally mandated to acknowledge receipt of this consumer complaint within <b>forty-eight (48) hours</b> and resolve it within <b>thirty (30) days</b>."
        )
        statute_box = Table([[Paragraph(statutes_text, citation_box_style)]], colWidths=[500])
        statute_box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86EFAC')),
            ('PADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(statute_box)
        story.append(Spacer(1, 10))

        # 7. Relief Demanded & Deadlines
        story.append(Paragraph("4. RELIEF DEMANDED & STATUTORY SLA", heading_style))
        story.append(Paragraph(
            f"The complainant hereby demands:<br/>"
            f"• <b>Immediate free repair / replacement</b> with an identical non-defective unit, OR<br/>"
            f"• <b>Full refund of Rs. {float(case_data.get('amount_inr', 0.0)):,.2f}</b> to the original payment source.<br/>"
            f"• Statutory written acknowledgment within <b>48 hours</b>.<br/>"
            f"Failure to redress this defect within the statutory 30-day window will result in formal escalation to the "
            f"<b>National Consumer Helpline (NCH 1915 / consumerhelpline.gov.in)</b> and filing of a formal complaint "
            f"before the competent <b>District Consumer Disputes Redressal Commission</b> seeking statutory compensation.",
            body_style
        ))
        story.append(Spacer(1, 10))

        # 8. Evidence Checklist (Burden of Proof Compliance)
        story.append(Paragraph("5. BURDEN OF PROOF — EVIDENCE DOCKET ENCLOSED", heading_style))
        evidence_items = [
            "[X] Copy of Original Tax Invoice establishing purchase date and serial number",
            "[X] Photographic / Video documentation demonstrating the non-functioning state",
            "[X] Log of Customer Support communications / refusal notices",
            "[ ] Service Centre Job Sheet (Attached if inspection was carried out)"
        ]
        evidence_p = "<br/>".join(evidence_items)
        story.append(Paragraph(evidence_p, body_style))

        doc.build(story, canvasmaker=NumberedCanvas)
        return output_pdf_path

    @staticmethod
    def generate_whatsapp_text(case_data: Dict[str, Any]) -> str:
        """Generates a concise, high-leverage WhatsApp message to send to brand or seller support."""
        order_id = case_data.get("order_id", "N/A")
        product = case_data.get("product_name", "Product")
        defect = case_data.get("defect_description", "inherent manufacturing defect")
        amount = case_data.get("amount_inr", 0.0)
        
        return (
            f"Hello Grievance Support,\n\n"
            f"I am writing regarding my purchase of *{product}* (Order ID: *{order_id}*, Amount: ₹{amount:,.2f}).\n\n"
            f"The device has developed an inherent defect: *{defect}*.\n\n"
            f"Under the *Consumer Protection (E-Commerce) Rules, 2020 (Rule 6(3) & Rule 7(4))*, sellers and platforms cannot refuse to take back defective goods or refund consideration, even after the initial 7-day return window.\n\n"
            f"Furthermore, under *Section 84 of the Consumer Protection Act, 2019*, statutory product liability applies.\n\n"
            f"Please arrange an immediate replacement or full refund, and confirm receipt of this grievance within 48 hours as mandated by Rule 4(5).\n\n"
            f"Invoice, defect photos, and formal notice packet reference are ready for submission. Thank you."
        )

    @staticmethod
    def generate_nch_portal_text(case_data: Dict[str, Any]) -> str:
        """Formats the grievance text ready for copy-pasting into consumerhelpline.gov.in (INGRAM)."""
        order_id = case_data.get("order_id", "N/A")
        product = case_data.get("product_name", "Product")
        brand = case_data.get("brand", "Manufacturer")
        seller = case_data.get("seller_name", "Seller")
        defect = case_data.get("defect_description", "Defect")
        purchase_date = case_data.get("purchase_date", "N/A")
        amount = case_data.get("amount_inr", 0.0)

        return (
            f"GRIEVANCE DETAILS FOR NATIONAL CONSUMER HELPLINE (NCH / INGRAM)\n"
            f"===========================================================\n"
            f"Grievance Category: E-Commerce / Consumer Electronics\n"
            f"Company / Brand: {brand}\n"
            f"Seller / Merchant: {seller}\n"
            f"Order / Invoice ID: {order_id}\n"
            f"Date of Purchase: {purchase_date}\n"
            f"Disputed Amount: Rs. {amount:,.2f}\n\n"
            f"CHRONOLOGY OF COMPLAINT:\n"
            f"1. I purchased the {product} on {purchase_date} from {seller}.\n"
            f"2. During regular usage within the warranty period, the product exhibited the following defect: {defect}.\n"
            f"3. When escalated to customer care, they refused support citing an expired return window, in direct contravention of Rule 6(3) of Consumer Protection (E-Commerce) Rules, 2020 and Section 84 of CPA 2019.\n"
            f"4. Slower service or customer bounce has caused harassment and deprivation of product utility.\n\n"
            f"RELIEF SOUGHT:\n"
            f"Direct the respondent to provide immediate replacement or 100% refund of Rs. {amount:,.2f} along with appropriate compensation."
        )

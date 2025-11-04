#!/usr/bin/env python3
import os
import sys

def create_pdf_from_html():
    """Create a PDF from HTML using various methods"""
    
    # Try using weasyprint if available
    try:
        import weasyprint
        html = weasyprint.HTML(filename='resume_template.html')
        html.write_pdf('files/resume.pdf')
        print("Successfully created PDF using WeasyPrint")
        return True
    except ImportError:
        print("WeasyPrint not available")
    except Exception as e:
        print(f"Error with WeasyPrint: {e}")
    
    # Try using pdfkit if available
    try:
        import pdfkit
        options = {
            'page-size': 'Letter',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
            'no-outline': None
        }
        pdfkit.from_file('resume_template.html', 'files/resume.pdf', options=options)
        print("Successfully created PDF using pdfkit")
        return True
    except ImportError:
        print("pdfkit not available")
    except Exception as e:
        print(f"Error with pdfkit: {e}")
    
    # Try using reportlab to create a simple PDF
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        
        # Create PDF
        doc = SimpleDocTemplate("files/resume.pdf", pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Add content
        story.append(Paragraph("Hannah's Resume", styles['Title']))
        story.append(Paragraph("Psychology Student | Nature Enthusiast | Performer", styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Education
        story.append(Paragraph("Education", styles['Heading1']))
        story.append(Paragraph("Bachelor of Science in Psychology with Business Minor", styles['Heading2']))
        story.append(Paragraph("University of Minnesota Duluth - Expected Graduation: 2029", styles['Normal']))
        story.append(Paragraph("• Psychology Major with focus on the connection between psychology and nature", styles['Normal']))
        story.append(Paragraph("• Business Minor to complement psychology studies", styles['Normal']))
        story.append(Paragraph("• Relevant coursework in environmental psychology and human consciousness", styles['Normal']))
        story.append(Paragraph("• Current Status: Freshman", styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Experience
        story.append(Paragraph("Experience", styles['Heading1']))
        
        story.append(Paragraph("Barista - Livonias Coffee Shop (February 2025 - Present)", styles['Heading2']))
        story.append(Paragraph("• Mastered specialty coffee preparation", styles['Normal']))
        story.append(Paragraph("• Built strong customer relationships through personalized service", styles['Normal']))
        story.append(Paragraph("• Managed inventory and maintained equipment", styles['Normal']))
        story.append(Paragraph("• Collaborated with team members during peak hours", styles['Normal']))
        story.append(Spacer(1, 8))
        
        story.append(Paragraph("Barista - Scooter's Coffee (June 2024 - June 2025)", styles['Heading2']))
        story.append(Paragraph("• Delivered exceptional customer service in high-volume environment", styles['Normal']))
        story.append(Paragraph("• Maintained strict quality standards", styles['Normal']))
        story.append(Paragraph("• Handled cash transactions and register operations", styles['Normal']))
        story.append(Paragraph("• Ensured compliance with health and safety regulations", styles['Normal']))
        story.append(Spacer(1, 8))
        
        story.append(Paragraph("Lifeguard - City of Fort Collins (2024)", styles['Heading2']))
        story.append(Paragraph("• Monitored large municipal pool facility", styles['Normal']))
        story.append(Paragraph("• Executed emergency response protocols and first aid", styles['Normal']))
        story.append(Paragraph("• Enforced pool rules while maintaining positive relations", styles['Normal']))
        story.append(Spacer(1, 8))
        
        story.append(Paragraph("Lifeguard - Splash Pools (Summer 2023)", styles['Heading2']))
        story.append(Paragraph("• Maintained pool chemical balance", styles['Normal']))
        story.append(Paragraph("• Responded quickly to water emergencies", styles['Normal']))
        story.append(Paragraph("• Resolved customer concerns professionally", styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Skills
        story.append(Paragraph("Skills", styles['Heading1']))
        story.append(Paragraph("Technical: Microsoft Office Suite, Data Analysis, Research Methods, Statistical Software, Red Cross Certified Lifeguard", styles['Normal']))
        story.append(Paragraph("Communication: Public Speaking, Multilingual (French, Italian, Latin, Spanish), Choir & Vocal Performance, Theater Performance", styles['Normal']))
        story.append(Paragraph("Personal: Hiking & Backpacking, Sustainability Advocacy, Environmental Awareness, Leadership", styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Achievements
        story.append(Paragraph("Achievements", styles['Heading1']))
        story.append(Paragraph("Performance: Member of 8th Grade Select Choir, Wavelength Jazz Choir Member, Lake Effect Jazz Choir Member, Multilingual singing performances", styles['Normal']))
        story.append(Paragraph("Environmental: Vegan lifestyle adoption, Sustainability advocacy, Psychology and nature research focus, Backpacking and outdoor leadership", styles['Normal']))
        
        # Build PDF
        doc.build(story)
        print("Successfully created PDF using ReportLab")
        return True
        
    except ImportError:
        print("ReportLab not available")
    except Exception as e:
        print(f"Error with ReportLab: {e}")
    
    print("No PDF creation libraries available")
    return False

if __name__ == "__main__":
    create_pdf_from_html()

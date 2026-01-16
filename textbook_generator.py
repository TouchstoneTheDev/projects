#!/usr/bin/env python3
"""
Textbook Generator from Syllabus PDF
Generates comprehensive textbook content from a syllabus using OpenAI API.
"""

import os
import sys
from pathlib import Path
from openai import OpenAI

# ============================================================================
# CONFIGURATION - Update these values
# ============================================================================

# OpenAI API Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-api-key-here")
MODEL = "gpt-4o"  # Change to "gpt-3.5-turbo" for faster/cheaper responses
# MODEL = "gpt-3.5-turbo"

# ============================================================================
# DEPENDENCIES: Install with: pip install openai PyPDF2
# ============================================================================


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text content from a PDF file."""
    try:
        import PyPDF2
    except ImportError:
        print("Error: PyPDF2 is required. Install with: pip install PyPDF2")
        sys.exit(1)
    
    text = []
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            print(f"📄 Extracting text from {num_pages} pages...")
            
            for page_num, page in enumerate(pdf_reader.pages, 1):
                page_text = page.extract_text()
                text.append(page_text)
                print(f"   ✓ Processed page {page_num}/{num_pages}")
        
        return "\n".join(text)
    except FileNotFoundError:
        print(f"❌ Error: PDF file not found at {pdf_path}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error reading PDF: {e}")
        sys.exit(1)


def generate_textbook(syllabus_text: str, output_file: str = "generated_textbook.md") -> None:
    """
    Generate a comprehensive textbook from syllabus using OpenAI API.
    Creates detailed, long-form educational content.
    """
    
    # Verify API key
    if OPENAI_API_KEY == "your-api-key-here":
        print("❌ Error: Please set your OpenAI API key in the script or via OPENAI_API_KEY env var")
        sys.exit(1)
    
    # Initialize OpenAI client
    client = OpenAI(api_key=OPENAI_API_KEY)
    
    print(f"\n🚀 Generating textbook using {MODEL}...")
    print(f"📝 Output will be saved to: {output_file}\n")
    
    # Create a comprehensive prompt for textbook generation
    prompt = f"""You are an expert educational content creator. Based on the following syllabus, 
generate a comprehensive, detailed textbook that covers all topics in depth.

SYLLABUS:
{syllabus_text}

INSTRUCTIONS:
1. Create a well-structured textbook with clear sections and chapters
2. For EACH topic in the syllabus, provide:
   - Detailed explanations (multiple paragraphs)
   - Key concepts and definitions
   - Examples and case studies
   - Learning objectives
   - Real-world applications
   - Practice questions
   - Summary points

3. Make the content COMPREHENSIVE and LENGTHY (aim for 5000+ words minimum)
4. Include an introduction, table of contents, and conclusion
5. Use clear formatting with headers, bullet points, and structured sections
6. Include learning outcomes for each section
7. Add review questions at the end of each major section
8. Make it suitable for students to use as a complete study guide

Generate a HIGH-QUALITY, DETAILED textbook that covers everything thoroughly:"""

    try:
        # Call OpenAI API with streaming for longer content
        textbook_content = ""
        
        print("⏳ Generating content (this may take a minute or two)...\n")
        print("=" * 80)
        
        # Use chat completions API
        response = client.chat.completions.create(
            model=MODEL,
            max_tokens=8000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        textbook_content = response.choices[0].message.content
        print(textbook_content)
        print("\n" + "=" * 80)
        
        # Save to file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(textbook_content)
        
        print(f"\n✅ Textbook generation complete!")
        print(f"✅ Saved to: {output_file}")
        print(f"📊 Content length: {len(textbook_content):,} characters (~{len(textbook_content.split())//250} pages)")
        
    except Exception as e:
        print(f"\n❌ Error generating textbook: {e}")
        sys.exit(1)


def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python textbook_generator.py <syllabus_pdf_path> [output_file.md]")
        print("\nExample:")
        print("  python textbook_generator.py syllabus.pdf")
        print("  python textbook_generator.py syllabus.pdf my_textbook.md")
        print("\nSetup:")
        print("  1. Install dependencies: pip install openai PyPDF2")
        print("  2. Set your OpenAI API key:")
        print("     export OPENAI_API_KEY='sk-...'")
        print("     OR edit OPENAI_API_KEY in the script")
        print("  3. Update MODEL variable for different OpenAI models")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "generated_textbook.md"
    
    # Verify PDF exists
    if not os.path.exists(pdf_path):
        print(f"❌ Error: PDF file not found: {pdf_path}")
        sys.exit(1)
    
    print(f"🎓 Textbook Generator")
    print(f"{'='*80}")
    print(f"📥 Input PDF: {pdf_path}")
    print(f"🔑 Model: {MODEL}")
    print(f"{'='*80}\n")
    
    # Extract text from PDF
    print("Step 1: Extracting text from PDF...")
    syllabus_text = extract_text_from_pdf(pdf_path)
    print(f"✓ Extracted {len(syllabus_text):,} characters\n")
    
    # Generate textbook
    print("Step 2: Generating textbook content...")
    generate_textbook(syllabus_text, output_file)


if __name__ == "__main__":
    main()

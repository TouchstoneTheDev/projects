#!/usr/bin/env python3
"""
TextbookMaster Auto-Generator
Automated generation of complete textbook content from PDF syllabus
Generates: Table of Contents, Full Textbook Sections, Cheat Sheets, Exercises & Solutions
"""

import os
import sys
import json
from datetime import datetime
from openai import OpenAI

# ============================================================================
# CONFIGURATION
# ============================================================================
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-api-key-here")
MODEL = "gpt-4o"

# Color codes for output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

def colored(text, color):
    return f"{color}{text}{Colors.END}"

# ============================================================================
# PDF EXTRACTION
# ============================================================================
def extract_pdf_text(pdf_path):
    """Extract text from PDF file."""
    try:
        import PyPDF2
    except ImportError:
        print(colored("❌ Error: PyPDF2 is required. Install with: pip install PyPDF2", Colors.RED))
        return None
    
    try:
        text = []
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            print(colored(f"  📄 Extracting text from {num_pages} pages...", Colors.YELLOW))
            
            for page_num, page in enumerate(pdf_reader.pages, 1):
                page_text = page.extract_text()
                text.append(page_text)
                print(colored(f"     ✓ Page {page_num}/{num_pages}", Colors.GREEN))
        
        extracted = "\n".join(text)
        print(colored(f"  ✓ Extracted {len(extracted):,} characters\n", Colors.GREEN))
        return extracted
        
    except FileNotFoundError:
        print(colored(f"❌ Error: PDF file not found at {pdf_path}", Colors.RED))
        return None
    except Exception as e:
        print(colored(f"❌ Error reading PDF: {e}", Colors.RED))
        return None

# ============================================================================
# OPENAI API CALLS
# ============================================================================
def call_openai(prompt):
    """Call OpenAI API and return response."""
    client = OpenAI(api_key=OPENAI_API_KEY)
    try:
        response = client.chat.completions.create(
            model=MODEL,
            max_tokens=8000,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(colored(f"❌ OpenAI Error: {e}", Colors.RED))
        return None

def generate_toc(subject, level, description, syllabus_text):
    """Generate Table of Contents."""
    print(colored("\n[1/5] Generating Table of Contents...", Colors.CYAN))
    
    prompt = f"""You are an expert academic curriculum designer. Create a comprehensive Table of Contents for a textbook.

Subject: {subject}
Level: {level}
Description: {description}

SYLLABUS CONTENT:
{syllabus_text}

Generate a detailed Table of Contents with:
- 8-12 main chapters
- 3-5 sections per chapter
- Clear logical progression from fundamentals to advanced topics
- Brief 2-3 line description for each section

Format as professional markdown with proper hierarchy (# ## ### ###)."""

    content = call_openai(prompt)
    if content:
        print(colored("✅ Table of Contents generated!", Colors.GREEN))
        return content
    return None

def generate_cheat_sheet(subject, level, description, syllabus_text):
    """Generate comprehensive study cheat sheet."""
    print(colored("\n[2/5] Generating Cheat Sheet...", Colors.CYAN))
    
    prompt = f"""You are an expert tutor creating a comprehensive study cheat sheet.

Subject: {subject}
Level: {level}
Description: {description}

SYLLABUS CONTENT:
{syllabus_text}

Create a high-density, comprehensive cheat sheet including:

1. **Core Formulas & Theorems** - All essential formulas with brief explanations
2. **Key Definitions** - Important terms and concepts (concise)
3. **Quick Reference** - Essential facts and relationships
4. **Common Techniques** - Standard methods and approaches
5. **Memory Aids** - Mnemonics and visual memory helpers
6. **Critical Concepts** - Core ideas that tie everything together
7. **Problem-Solving Flowchart** - Decision trees for different problem types
8. **Units & Notation** - Standard notation and conventions
9. **Common Mistakes** - Pitfalls to avoid
10. **Quick Derivations** - How to quickly re-derive key results

Use tables, boxes, bold text, and structured formatting. Make it dense but scannable.
Target: 3000-5000 words, highly organized."""

    content = call_openai(prompt)
    if content:
        print(colored("✅ Cheat Sheet generated!", Colors.GREEN))
        return content
    return None

def generate_textbook_section(subject, level, description, chapter_num, section_num, section_title, syllabus_text):
    """Generate a comprehensive textbook section."""
    
    prompt = f"""You are an elite, university-level textbook author with 25+ years of experience.

Write a comprehensive, academically rigorous textbook section.

TEXTBOOK DETAILS:
- Subject: {subject}
- Level: {level}
- Description: {description}

SYLLABUS CONTEXT:
{syllabus_text}

SECTION TO WRITE:
- Chapter {chapter_num}, Section {section_num}
- Title: {section_title}

REQUIREMENTS (MANDATORY):

1. **Learning Objectives** (5 bullet points)
   - Clear, measurable outcomes

2. **Comprehensive Main Text** (2500-3500 words minimum)
   - Extremely clear and logically progressive
   - Perfect scaffolding: simple → complex
   - Step-by-step development
   - Modern, engaging, professional academic tone

3. **Important Definitions & Theorems**
   - Use markdown boxes for key definitions
   - Include proof sketches where relevant

4. **Worked Examples** (3-4 detailed examples)
   - High-quality, step-by-step solutions
   - Explain reasoning, not just calculation
   - Show all intermediate steps

5. **Common Misconceptions & Mistakes**
   - Typical student errors
   - Why they're wrong with corrections

6. **Key Takeaways** (boxed summary)
   - Essential points condensed

7. **Exercises** (10-12 problems)
   - [Easy] - 3-4 problems
   - [Medium] - 4-5 problems
   - [Challenging] - 2-3 problems
   - Solutions provided below exercises

8. **Complete Solutions to All Exercises**
   - Step-by-step solutions
   - Alternative methods where applicable
   - Grading rubric

Use markdown extensively: headings, bold, italics, code, quotes, LaTeX ($$ $$), tables.

NOW WRITE THE COMPLETE, DETAILED SECTION:"""

    content = call_openai(prompt)
    return content

def generate_practice_problems(subject, level, description, syllabus_text, num_problems=50):
    """Generate comprehensive practice problems with solutions."""
    print(colored(f"\n[5/5] Generating {num_problems} Practice Problems with Solutions...", Colors.CYAN))
    
    prompt = f"""You are an expert problem creator for {subject} at {level} level.

Create a comprehensive problem set based on this syllabus:

SUBJECT: {subject}
LEVEL: {level}
DESCRIPTION: {description}

SYLLABUS:
{syllabus_text}

Generate {num_problems} practice problems organized as follows:

SECTION 1: BASIC CONCEPT PROBLEMS (10 problems)
- Test understanding of core definitions and concepts
- [Easy] difficulty
- Numbered 1-10

SECTION 2: SKILL-BUILDING PROBLEMS (15 problems)
- Require application of formulas and theorems
- [Medium] difficulty
- Mix different topic areas
- Numbered 11-25

SECTION 3: CHALLENGING APPLICATION PROBLEMS (15 problems)
- Multi-step problems requiring deep understanding
- [Challenging] difficulty
- Real-world applications where relevant
- Numbered 26-40

SECTION 4: EXAM-STYLE PROBLEMS (10 problems)
- Similar to actual exam questions
- [Challenging] difficulty
- Mixed topics
- Numbered 41-50

For EACH problem:
- Write the problem statement clearly
- Indicate difficulty and topic area

Then provide DETAILED SOLUTIONS:
- Number matching problems
- Step-by-step solutions
- Explain concepts used
- Show alternative approaches where relevant
- Include grading rubric for each

Format with clear markdown sections, numbered lists, and boxes for solutions."""

    content = call_openai(prompt)
    if content:
        print(colored(f"✅ Practice Problems generated!", Colors.GREEN))
        return content
    return None

# ============================================================================
# MAIN EXECUTION
# ============================================================================
def main():
    """Main execution function."""
    
    # Verify API key
    if OPENAI_API_KEY == "your-api-key-here":
        print(colored("❌ Error: Please set your OpenAI API key!", Colors.RED))
        print("   export OPENAI_API_KEY='sk-...'")
        sys.exit(1)
    
    # Display header
    print("\n")
    print(colored("╔" + "═"*77 + "╗", Colors.CYAN))
    print(colored("║" + " "*15 + "📚 TEXTBOOKMASTER AUTO-GENERATOR" + " "*30 + "║", Colors.CYAN))
    print(colored("║" + " "*10 + "Complete Textbook & Study Materials from Syllabus PDF" + " "*13 + "║", Colors.CYAN))
    print(colored("╚" + "═"*77 + "╝", Colors.CYAN))
    
    # Parse arguments
    if len(sys.argv) < 2:
        print("\n" + colored("❌ Usage:", Colors.RED))
        print("   python textbook_auto_generator.py <pdf_path> <subject> <level> <description>")
        print("\n" + colored("Example:", Colors.YELLOW))
        print("   python textbook_auto_generator.py syllabus.pdf 'IIT JAM Mathematics' Graduate 'Comprehensive guide...'")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    subject = sys.argv[2] if len(sys.argv) > 2 else "Mathematics"
    level = sys.argv[3] if len(sys.argv) > 3 else "Graduate"
    description = sys.argv[4] if len(sys.argv) > 4 else "Comprehensive textbook"
    
    print(colored(f"\n📥 Input PDF: {pdf_path}", Colors.YELLOW))
    print(colored(f"📚 Subject: {subject}", Colors.YELLOW))
    print(colored(f"🎓 Level: {level}", Colors.YELLOW))
    print(colored(f"📝 Description: {description}\n", Colors.YELLOW))
    
    # Step 1: Extract PDF
    print(colored("Step 1: Extracting PDF Content", Colors.BOLD))
    syllabus_text = extract_pdf_text(pdf_path)
    if not syllabus_text:
        sys.exit(1)
    
    # Create output directory
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = f"textbook_output_{timestamp}"
    os.makedirs(output_dir, exist_ok=True)
    print(colored(f"✓ Output directory: {output_dir}\n", Colors.GREEN))
    
    # Step 2: Generate Table of Contents
    print(colored("Step 2: Generating Table of Contents", Colors.BOLD))
    toc = generate_toc(subject, level, description, syllabus_text)
    if toc:
        with open(f"{output_dir}/01_TABLE_OF_CONTENTS.md", 'w', encoding='utf-8') as f:
            f.write(f"# Table of Contents - {subject}\n\n")
            f.write(f"**Level:** {level}\n\n")
            f.write(f"**Description:** {description}\n\n")
            f.write("---\n\n")
            f.write(toc)
        print(colored(f"✓ Saved to: 01_TABLE_OF_CONTENTS.md\n", Colors.GREEN))
    
    # Step 3: Generate Cheat Sheet
    print(colored("Step 3: Generating Study Cheat Sheet", Colors.BOLD))
    cheat_sheet = generate_cheat_sheet(subject, level, description, syllabus_text)
    if cheat_sheet:
        with open(f"{output_dir}/02_CHEAT_SHEET.md", 'w', encoding='utf-8') as f:
            f.write(f"# {subject} - Comprehensive Cheat Sheet\n\n")
            f.write(f"**Level:** {level}\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("---\n\n")
            f.write(cheat_sheet)
        print(colored(f"✓ Saved to: 02_CHEAT_SHEET.md\n", Colors.GREEN))
    
    # Step 4: Generate 2-3 Sample Textbook Sections
    print(colored("Step 4: Generating Textbook Sections", Colors.BOLD))
    sections = [
        (1, 1, "Fundamentals & Core Concepts"),
        (1, 2, "Key Theorems & Principles"),
        (2, 1, "Advanced Topics & Applications"),
    ]
    
    textbook_content = f"# Complete Textbook: {subject}\n\n"
    textbook_content += f"**Level:** {level}\n"
    textbook_content += f"**Description:** {description}\n"
    textbook_content += f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    textbook_content += "---\n\n"
    
    for chapter, section, title in sections:
        print(colored(f"  • Generating Chapter {chapter}.{section}: {title}...", Colors.YELLOW))
        section_content = generate_textbook_section(subject, level, description, chapter, section, title, syllabus_text)
        if section_content:
            textbook_content += f"\n## Chapter {chapter} - Section {section}: {title}\n\n"
            textbook_content += section_content
            textbook_content += "\n\n---\n\n"
            print(colored(f"    ✓ Generated", Colors.GREEN))
        else:
            print(colored(f"    ❌ Failed", Colors.RED))
    
    with open(f"{output_dir}/03_TEXTBOOK_SECTIONS.md", 'w', encoding='utf-8') as f:
        f.write(textbook_content)
    print(colored(f"✓ Saved to: 03_TEXTBOOK_SECTIONS.md\n", Colors.GREEN))
    
    # Step 5: Generate Practice Problems & Solutions
    print(colored("Step 5: Generating Practice Problems & Solutions", Colors.BOLD))
    problems = generate_practice_problems(subject, level, description, syllabus_text, 50)
    if problems:
        with open(f"{output_dir}/04_PRACTICE_PROBLEMS_AND_SOLUTIONS.md", 'w', encoding='utf-8') as f:
            f.write(f"# {subject} - Practice Problems & Complete Solutions\n\n")
            f.write(f"**Level:** {level}\n")
            f.write(f"**Total Problems:** 50\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("---\n\n")
            f.write(problems)
        print(colored(f"✓ Saved to: 04_PRACTICE_PROBLEMS_AND_SOLUTIONS.md\n", Colors.GREEN))
    
    # Step 6: Create summary file
    print(colored("Step 6: Creating Summary", Colors.BOLD))
    summary = f"""# TextbookMaster Auto-Generation Summary

## Project Details
- **Subject:** {subject}
- **Level:** {level}
- **Description:** {description}
- **PDF Source:** {pdf_path}
- **Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Generated Files

1. **01_TABLE_OF_CONTENTS.md**
   - Comprehensive 8-12 chapter structure
   - 3-5 sections per chapter
   - Logical progression from fundamentals to advanced topics

2. **02_CHEAT_SHEET.md**
   - Condensed study guide (3000-5000 words)
   - Key formulas, theorems, definitions
   - Quick reference for exam preparation
   - Memory aids and common mistakes

3. **03_TEXTBOOK_SECTIONS.md**
   - 3 sample detailed textbook sections
   - Learning objectives for each section
   - Main explanatory text (2500-3500 words per section)
   - 3-4 worked examples per section
   - Exercises with complete solutions

4. **04_PRACTICE_PROBLEMS_AND_SOLUTIONS.md**
   - 50 comprehensive practice problems
   - Organized by difficulty: Easy (10), Medium (15), Challenging (15), Exam-style (10)
   - Complete step-by-step solutions
   - Grading rubrics
   - Alternative problem-solving approaches

## Next Steps

1. Review and edit generated content as needed
2. Use 02_CHEAT_SHEET.md for quick study sessions
3. Work through 03_TEXTBOOK_SECTIONS.md to understand concepts
4. Practice with 04_PRACTICE_PROBLEMS_AND_SOLUTIONS.md
5. Generate additional sections by running the program again

## Statistics

- PDF Content: {len(syllabus_text):,} characters
- Estimated Study Material: ~15,000+ words
- Total Exercises: 50+ problems with solutions
- Time to Generate: ~2-3 minutes

---
Generated by TextbookMaster v3.5 Auto-Generator
"""
    
    with open(f"{output_dir}/00_SUMMARY.md", 'w', encoding='utf-8') as f:
        f.write(summary)
    print(colored(f"✓ Saved to: 00_SUMMARY.md\n", Colors.GREEN))
    
    # Final message
    print(colored("╔" + "═"*77 + "╗", Colors.GREEN))
    print(colored("║" + " "*77 + "║", Colors.GREEN))
    print(colored(f"║  ✅ ALL MATERIALS GENERATED SUCCESSFULLY!" + " "*37 + "║", Colors.GREEN))
    print(colored(f"║  📁 Output Directory: {output_dir}" + " "*(77-30-len(output_dir)) + "║", Colors.GREEN))
    print(colored("║" + " "*77 + "║", Colors.GREEN))
    print(colored("╚" + "═"*77 + "╝", Colors.GREEN))
    
    print(colored(f"\n📂 Generated Files:", Colors.BOLD))
    print(f"   1. 00_SUMMARY.md (Overview)")
    print(f"   2. 01_TABLE_OF_CONTENTS.md (Curriculum structure)")
    print(f"   3. 02_CHEAT_SHEET.md (Quick reference guide)")
    print(f"   4. 03_TEXTBOOK_SECTIONS.md (Detailed lessons)")
    print(f"   5. 04_PRACTICE_PROBLEMS_AND_SOLUTIONS.md (Exercises & solutions)")
    print(colored(f"\n🎓 Ready for studying! Start with the SUMMARY and CHEAT_SHEET.\n", Colors.GREEN))

if __name__ == "__main__":
    main()

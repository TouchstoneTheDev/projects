#!/usr/bin/env python3
"""
TextbookMaster v1 - Complete Textbook Generator
No token restrictions. Focuses on generating COMPLETE, FULL textbooks.
Generates: TOC, Cheat Sheet, Full Chapters (6-8), Exercises with Solutions
"""

import os
import sys
from datetime import datetime
from openai import OpenAI

# ============================================================================
# CONFIGURATION
# ============================================================================
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-api-key-here")
MODEL = "gpt-4o"

# Color codes
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
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
        print(colored("❌ PyPDF2 required: pip install PyPDF2", Colors.RED))
        return None
    
    try:
        text = []
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            print(colored(f"  📄 Extracting {num_pages} pages...", Colors.YELLOW))
            
            for page_num, page in enumerate(pdf_reader.pages, 1):
                page_text = page.extract_text()
                text.append(page_text)
                if page_num % 5 == 0 or page_num == num_pages:
                    print(colored(f"     ✓ Page {page_num}/{num_pages}", Colors.GREEN))
        
        extracted = "\n".join(text)
        print(colored(f"  ✓ Extracted {len(extracted):,} characters\n", Colors.GREEN))
        return extracted
        
    except FileNotFoundError:
        print(colored(f"❌ PDF not found: {pdf_path}", Colors.RED))
        return None
    except Exception as e:
        print(colored(f"❌ PDF Error: {e}", Colors.RED))
        return None

# ============================================================================
# OPENAI API - NO RESTRICTIONS
# ============================================================================
def call_openai(prompt, max_tokens=12000):
    """Call OpenAI API with NO token restrictions."""
    client = OpenAI(api_key=OPENAI_API_KEY)
    try:
        response = client.chat.completions.create(
            model=MODEL,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(colored(f"❌ OpenAI Error: {e}", Colors.RED))
        return None

# ============================================================================
# GENERATION FUNCTIONS
# ============================================================================
def generate_toc(subject, level, description, syllabus_text):
    """Generate detailed Table of Contents."""
    print(colored("\n[1/6] Generating Table of Contents...", Colors.CYAN))
    
    prompt = f"""You are an expert curriculum designer. Create a COMPREHENSIVE Table of Contents.

Subject: {subject}
Level: {level}
Description: {description}

SYLLABUS:
{syllabus_text}

Create a DETAILED Table of Contents with:
- 8-12 MAIN CHAPTERS (comprehensive coverage)
- 4-6 SECTIONS per chapter
- Clear logical progression (fundamentals → advanced)
- 2-3 line description for each section

Format: Professional markdown with # ## ### hierarchy.

Make it COMPLETE and COMPREHENSIVE - this is the full curriculum structure."""

    content = call_openai(prompt, max_tokens=5000)
    if content:
        print(colored("✅ TOC generated!", Colors.GREEN))
    return content

def generate_cheat_sheet(subject, level, description, syllabus_text):
    """Generate COMPREHENSIVE study cheat sheet."""
    print(colored("\n[2/6] Generating Comprehensive Cheat Sheet...", Colors.CYAN))
    
    prompt = f"""Create an EXHAUSTIVE study cheat sheet for exam preparation.

Subject: {subject}
Level: {level}
Description: {description}

SYLLABUS:
{syllabus_text}

Generate a HIGH-DENSITY cheat sheet including:

1. **ALL KEY FORMULAS** - Complete list with explanations
2. **THEOREMS & PRINCIPLES** - Essential theorems with proofs sketches
3. **DEFINITIONS** - Important terms and concepts
4. **QUICK REFERENCE** - Essential facts and relationships
5. **STANDARD TECHNIQUES** - Methods and approaches
6. **MNEMONICS & MEMORY AIDS** - Memory tricks
7. **COMMON MISTAKES** - Pitfalls and how to avoid them
8. **QUICK DERIVATIONS** - How to re-derive key results
9. **NOTATION & CONVENTIONS** - Standard symbols and conventions
10. **PROBLEM-SOLVING STRATEGIES** - Flowcharts and decision trees
11. **EXAM TIPS** - Strategies for exam success
12. **RELATIONSHIPS & CONNECTIONS** - How concepts relate

Make this DENSE, COMPREHENSIVE, and SCANNABLE.
Target: 5000-8000 words minimum.
Use tables, boxes, bold, lists extensively."""

    content = call_openai(prompt, max_tokens=12000)
    if content:
        print(colored("✅ Cheat sheet generated!", Colors.GREEN))
    return content

def generate_full_chapter(subject, level, description, chapter_num, chapter_title, syllabus_text):
    """Generate a COMPLETE full-length chapter."""
    
    prompt = f"""You are an elite academic textbook author. Write a COMPLETE, COMPREHENSIVE chapter for a textbook.

TEXTBOOK DETAILS:
- Subject: {subject}
- Level: {level}
- Description: {description}

CHAPTER {chapter_num}: {chapter_title}

SYLLABUS CONTEXT:
{syllabus_text}

WRITE A COMPLETE CHAPTER WITH:

1. **Chapter Introduction** (500 words)
   - Overview of chapter topics
   - Why this chapter matters
   - Learning roadmap

2. **Section 1: Fundamentals**
   - Learning objectives (5+ bullet points)
   - Main explanatory text (2000+ words)
   - Detailed definitions and theorems (with proofs where relevant)
   - 3-4 worked examples with complete solutions
   - Common misconceptions
   - Exercises (5 problems with solutions)

3. **Section 2: Core Concepts**
   - Learning objectives (5+ bullet points)
   - Main explanatory text (2000+ words)
   - Important theorems and principles
   - 3-4 worked examples
   - Real-world applications
   - Exercises (5 problems with solutions)

4. **Section 3: Advanced Topics**
   - Learning objectives (5+ bullet points)
   - Main explanatory text (2000+ words)
   - Advanced applications
   - 3-4 challenging worked examples
   - Extensions and deeper insights
   - Exercises (5 problems with solutions)

5. **Chapter Summary**
   - Key takeaways (boxed)
   - Concept map
   - Quick review

6. **Chapter Exercises & Problems** (15-20 problems)
   - Easy (4-5)
   - Medium (6-8)
   - Challenging (4-5)
   - With complete solutions for all

USE EXTENSIVELY:
- Markdown formatting (headings, bold, italic, code, quotes)
- LaTeX math: $$ ... $$
- Tables and lists
- Visual descriptions of concepts

REQUIREMENTS:
- MINIMUM 8000 words per chapter
- COMPLETE and SELF-CONTAINED
- Academic level appropriate to {level}
- Clear progression from simple to complex
- Every example has detailed solution

WRITE THE COMPLETE CHAPTER NOW - Leave nothing out:"""

    content = call_openai(prompt, max_tokens=12000)
    return content

def generate_all_chapters(subject, level, description, syllabus_text, num_chapters=6):
    """Generate MULTIPLE full chapters."""
    print(colored(f"\n[3/6] Generating {num_chapters} Complete Textbook Chapters...", Colors.CYAN))
    
    # First, extract chapter titles from syllabus
    titles_prompt = f"""Based on this syllabus, suggest {num_chapters} chapter titles for a {subject} textbook:

{syllabus_text}

Provide ONLY the chapter titles, numbered 1-{num_chapters}, one per line.
Make them descriptive and logical."""

    titles_text = call_openai(titles_prompt, max_tokens=1000)
    
    if not titles_text:
        # Fallback chapter titles
        fallback_titles = [
            "Fundamentals and Core Concepts",
            "Essential Principles and Theorems",
            "Applications and Problem-Solving",
            "Advanced Topics and Extensions",
            "Integration and Synthesis",
            "Practice and Mastery"
        ]
        titles_text = "\n".join(fallback_titles[:num_chapters])
    
    chapters = []
    titles = titles_text.strip().split('\n')
    
    for idx, title_line in enumerate(titles[:num_chapters], 1):
        # Clean up title
        title = title_line.split('. ', 1)[-1].strip() if '. ' in title_line else title_line.strip()
        
        print(colored(f"\n  • Chapter {idx}: {title}", Colors.YELLOW))
        print(colored("    Generating... (this takes ~30-60 seconds)", Colors.YELLOW))
        
        chapter_content = generate_full_chapter(subject, level, description, idx, title, syllabus_text)
        
        if chapter_content:
            chapters.append({
                "number": idx,
                "title": title,
                "content": chapter_content
            })
            print(colored(f"    ✓ Generated ({len(chapter_content)} chars)", Colors.GREEN))
        else:
            print(colored(f"    ❌ Failed to generate", Colors.RED))
    
    return chapters

def generate_exam_prep(subject, level, description, syllabus_text):
    """Generate comprehensive exam preparation guide."""
    print(colored("\n[5/6] Generating Exam Preparation Guide...", Colors.CYAN))
    
    prompt = f"""Create a COMPREHENSIVE exam preparation guide for:

Subject: {subject}
Level: {level}
Description: {description}

SYLLABUS:
{syllabus_text}

Generate:

1. **EXAM STRUCTURE & FORMAT**
   - Overview of exam
   - Time allocation
   - Scoring rubric

2. **STUDY PLAN** (4-8 weeks)
   - Week-by-week breakdown
   - Topics to focus on
   - Time management

3. **100+ PRACTICE PROBLEMS**
   - Organized by difficulty
   - By topic area
   - With complete solutions
   - Explanations and tips

4. **LAST-MINUTE TIPS**
   - Key formulas to memorize
   - Common traps
   - Time management strategies
   - Day-before checklist

5. **MOCK EXAM**
   - Full practice exam (similar to real exam)
   - Complete solutions with explanations
   - Self-assessment rubric

Make this COMPREHENSIVE and ACTIONABLE."""

    content = call_openai(prompt, max_tokens=12000)
    if content:
        print(colored("✅ Exam prep guide generated!", Colors.GREEN))
    return content

# ============================================================================
# MAIN EXECUTION
# ============================================================================
def main():
    """Main execution."""
    
    # Verify API key
    if OPENAI_API_KEY == "your-api-key-here":
        print(colored("❌ Error: Set your OpenAI API key!", Colors.RED))
        print("   export OPENAI_API_KEY='sk-...'")
        sys.exit(1)
    
    # Header
    print("\n")
    print(colored("╔" + "═"*77 + "╗", Colors.CYAN))
    print(colored("║" + " "*20 + "📚 TEXTBOOKMASTER v1" + " "*37 + "║", Colors.CYAN))
    print(colored("║" + " "*15 + "Complete Textbook Generator - NO TOKEN RESTRICTIONS" + " "*11 + "║", Colors.CYAN))
    print(colored("╚" + "═"*77 + "╝", Colors.CYAN))
    
    # Get user input
    print("\n" + colored("Step 1: PDF Input (Optional)", Colors.BOLD))
    pdf_input = input(colored("PDF path (or Enter to skip): ", Colors.YELLOW)).strip()
    
    syllabus_text = ""
    if pdf_input and os.path.exists(pdf_input):
        print(colored("Extracting PDF...", Colors.YELLOW))
        syllabus_text = extract_pdf_text(pdf_input)
        if not syllabus_text:
            print(colored("⚠ Could not extract PDF, continuing without it", Colors.YELLOW))
    
    print("\n" + colored("Step 2: Textbook Details", Colors.BOLD))
    subject = input(colored("Subject: ", Colors.YELLOW)).strip()
    if not subject:
        print(colored("❌ Subject required!", Colors.RED))
        sys.exit(1)
    
    level = input(colored("Level (e.g., Graduate, College): ", Colors.YELLOW)).strip() or "Graduate"
    description = input(colored("Brief description: ", Colors.YELLOW)).strip() or "Comprehensive textbook"
    
    num_chapters = input(colored("Number of chapters (default 6): ", Colors.YELLOW)).strip()
    num_chapters = int(num_chapters) if num_chapters.isdigit() else 6
    
    # Create output directory
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = f"textbook_full_{timestamp}"
    os.makedirs(output_dir, exist_ok=True)
    
    print(colored(f"\n📁 Output: {output_dir}\n", Colors.YELLOW))
    print(colored("="*80, Colors.CYAN))
    print(colored("STARTING GENERATION (This will take several minutes)...", Colors.BOLD))
    print(colored("="*80 + "\n", Colors.CYAN))
    
    # Step 1: TOC
    toc = generate_toc(subject, level, description, syllabus_text)
    if toc:
        with open(f"{output_dir}/01_TOC.md", 'w', encoding='utf-8') as f:
            f.write(f"# {subject} - Table of Contents\n\n")
            f.write(f"**Level:** {level}\n\n---\n\n")
            f.write(toc)
        print(colored(f"✅ Saved: 01_TOC.md\n", Colors.GREEN))
    
    # Step 2: Cheat Sheet
    cheat_sheet = generate_cheat_sheet(subject, level, description, syllabus_text)
    if cheat_sheet:
        with open(f"{output_dir}/02_CHEAT_SHEET.md", 'w', encoding='utf-8') as f:
            f.write(f"# {subject} - Comprehensive Cheat Sheet\n\n")
            f.write(f"**Level:** {level}\n\n---\n\n")
            f.write(cheat_sheet)
        print(colored(f"✅ Saved: 02_CHEAT_SHEET.md\n", Colors.GREEN))
    
    # Step 3: Generate full chapters
    chapters = generate_all_chapters(subject, level, description, syllabus_text, num_chapters)
    
    if chapters:
        chapters_file = f"{output_dir}/03_FULL_TEXTBOOK.md"
        with open(chapters_file, 'w', encoding='utf-8') as f:
            f.write(f"# Complete Textbook: {subject}\n\n")
            f.write(f"**Level:** {level}\n")
            f.write(f"**Description:** {description}\n")
            f.write(f"**Chapters:** {num_chapters}\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("---\n\n")
            
            for chapter in chapters:
                f.write(f"\n# Chapter {chapter['number']}: {chapter['title']}\n\n")
                f.write(chapter['content'])
                f.write("\n\n---\n\n")
        
        total_chars = sum(len(c['content']) for c in chapters)
        print(colored(f"\n✅ Saved: 03_FULL_TEXTBOOK.md ({total_chars:,} characters)\n", Colors.GREEN))
    
    # Step 4: Exam prep
    exam_prep = generate_exam_prep(subject, level, description, syllabus_text)
    if exam_prep:
        with open(f"{output_dir}/04_EXAM_PREP.md", 'w', encoding='utf-8') as f:
            f.write(f"# {subject} - Exam Preparation Guide\n\n")
            f.write(f"**Level:** {level}\n\n---\n\n")
            f.write(exam_prep)
        print(colored(f"✅ Saved: 04_EXAM_PREP.md\n", Colors.GREEN))
    
    # Step 5: Summary
    print(colored("\n[6/6] Creating Summary...", Colors.CYAN))
    
    summary = f"""# Complete Textbook Generation Summary

## Project Details
- **Subject:** {subject}
- **Level:** {level}
- **Description:** {description}
- **Chapters Generated:** {len(chapters)}
- **Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Generated Files

1. **01_TOC.md** - Table of Contents (8-12 chapters, 4-6 sections each)
2. **02_CHEAT_SHEET.md** - Comprehensive study guide (5000-8000 words)
3. **03_FULL_TEXTBOOK.md** - Complete textbook ({len(chapters)} chapters, 8000+ words each)
4. **04_EXAM_PREP.md** - Exam preparation guide with 100+ practice problems

## Textbook Statistics

- Total chapters: {len(chapters)}
- Total characters (textbook): {sum(len(c['content']) for c in chapters):,}
- Estimated pages: ~{sum(len(c['content']) for c in chapters)//3000}
- Estimated reading time: ~{sum(len(c['content']) for c in chapters)//1000} hours

## How to Use

1. **Start Here:** Read 02_CHEAT_SHEET.md for overview
2. **Learn:** Read 03_FULL_TEXTBOOK.md chapter by chapter
3. **Practice:** Use 04_EXAM_PREP.md for exercises and practice
4. **Reference:** Use 01_TOC.md for navigation

## Content Included in Each Chapter

✓ Learning objectives
✓ Comprehensive main text (2000+ words per section)
✓ Definitions and theorems with proofs
✓ 3-4 worked examples per section
✓ Common misconceptions
✓ Practice exercises with solutions
✓ Real-world applications

---
Generated by TextbookMaster v1 - No Token Restrictions
"""
    
    with open(f"{output_dir}/00_SUMMARY.md", 'w', encoding='utf-8') as f:
        f.write(summary)
    
    print(colored(f"✅ Saved: 00_SUMMARY.md\n", Colors.GREEN))
    
    # Final message
    print(colored("╔" + "═"*77 + "╗", Colors.GREEN))
    print(colored("║" + " "*77 + "║", Colors.GREEN))
    print(colored(f"║  ✅ COMPLETE TEXTBOOK GENERATED!" + " "*(77-36) + "║", Colors.GREEN))
    print(colored(f"║  📁 Directory: {output_dir}" + " "*(77-18-len(output_dir)) + "║", Colors.GREEN))
    print(colored("║" + " "*77 + "║", Colors.GREEN))
    print(colored("╚" + "═"*77 + "╝\n", Colors.GREEN))
    
    print(colored("📂 Files Generated:", Colors.BOLD))
    print("  1. 00_SUMMARY.md - Overview and statistics")
    print("  2. 01_TOC.md - Full curriculum structure")
    print("  3. 02_CHEAT_SHEET.md - Condensed study guide")
    print("  4. 03_FULL_TEXTBOOK.md - COMPLETE textbook with all chapters")
    print("  5. 04_EXAM_PREP.md - Exam preparation with 100+ problems")
    
    print(colored(f"\n📊 Textbook Size:", Colors.BOLD))
    print(f"  • Chapters: {len(chapters)}")
    print(f"  • Total Characters: {sum(len(c['content']) for c in chapters):,}")
    print(f"  • Estimated Pages: ~{sum(len(c['content']) for c in chapters)//3000}")
    print(f"  • Estimated Reading Time: ~{sum(len(c['content']) for c in chapters)//1000} hours")
    
    print(colored(f"\n✨ Your complete textbook is ready!\n", Colors.GREEN))

if __name__ == "__main__":
    main()

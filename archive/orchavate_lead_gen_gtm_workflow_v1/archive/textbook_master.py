#!/usr/bin/env python3
"""
TextbookMaster v3.5 - Elite University-Level Interactive Textbook Generator
An interactive CLI tool for creating professional academic textbooks with scaffolded learning.
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
from openai import OpenAI

# ============================================================================
# CONFIGURATION
# ============================================================================
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-api-key-here")
MODEL = "gpt-4o"
TEXTBOOK_STATE_FILE = "textbook_state.json"

# ============================================================================
# COLOR & FORMATTING
# ============================================================================
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
# TEXTBOOK STATE MANAGEMENT
# ============================================================================
class TextbookState:
    def __init__(self):
        self.subject = ""
        self.level = ""
        self.working_title = ""
        self.pdf_path = ""
        self.syllabus_text = ""
        self.chapters = []
        self.current_chapter = 0
        self.current_section = 0
        self.content = {}
        self.table_of_contents = []
        self.estimated_pages = 0
        self.created_at = datetime.now().isoformat()
        
    def to_dict(self):
        return {
            "subject": self.subject,
            "level": self.level,
            "working_title": self.working_title,
            "pdf_path": self.pdf_path,
            "syllabus_text": self.syllabus_text,
            "chapters": self.chapters,
            "current_chapter": self.current_chapter,
            "current_section": self.current_section,
            "content": self.content,
            "table_of_contents": self.table_of_contents,
            "estimated_pages": self.estimated_pages,
            "created_at": self.created_at,
        }
    
    @staticmethod
    def from_dict(data):
        state = TextbookState()
        state.subject = data.get("subject", "")
        state.level = data.get("level", "")
        state.working_title = data.get("working_title", "")
        state.pdf_path = data.get("pdf_path", "")
        state.syllabus_text = data.get("syllabus_text", "")
        state.chapters = data.get("chapters", [])
        state.current_chapter = data.get("current_chapter", 0)
        state.current_section = data.get("current_section", 0)
        state.content = data.get("content", {})
        state.table_of_contents = data.get("table_of_contents", [])
        state.estimated_pages = data.get("estimated_pages", 0)
        state.created_at = data.get("created_at", datetime.now().isoformat())
        return state
    
    def save(self, filename=TEXTBOOK_STATE_FILE):
        with open(filename, 'w') as f:
            json.dump(self.to_dict(), f, indent=2)
    
    @staticmethod
    def load(filename=TEXTBOOK_STATE_FILE):
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                data = json.load(f)
                return TextbookState.from_dict(data)
        return None

# ============================================================================
# TEXTBOOK MASTER ENGINE
# ============================================================================
class TextbookMaster:
    def __init__(self):
        self.state = TextbookState()
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.last_generated_section = None
    
    def extract_pdf_text(self, pdf_path):
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
                    print(colored(f"     ✓ Processed page {page_num}/{num_pages}", Colors.GREEN))
            
            extracted = "\n".join(text)
            print(colored(f"  ✓ Extracted {len(extracted):,} characters", Colors.GREEN))
            return extracted
            
        except FileNotFoundError:
            print(colored(f"❌ Error: PDF file not found at {pdf_path}", Colors.RED))
            return None
        except Exception as e:
            print(colored(f"❌ Error reading PDF: {e}", Colors.RED))
            return None
        
    def display_header(self):
        print("\n")
        print(colored("╔" + "═"*77 + "╗", Colors.CYAN))
        print(colored("║" + " "*77 + "║", Colors.CYAN))
        print(colored("║" + " "*15 + "📚 TEXTBOOKMASTER v3.5" + " "*40 + "║", Colors.CYAN))
        print(colored("║" + " "*10 + "Elite University-Level Interactive Textbook Generator" + " "*14 + "║", Colors.CYAN))
        print(colored("║" + " "*77 + "║", Colors.CYAN))
        print(colored("╚" + "═"*77 + "╝", Colors.CYAN))
        print()
    
    def display_status(self):
        """Display current textbook status."""
        print(colored("┌" + "─"*31 + "┐", Colors.BLUE))
        print(colored("│ CURRENT TEXTBOOK STATUS       │", Colors.BLUE))
        print(colored("└" + "─"*31 + "┘", Colors.BLUE))
        
        subject = self.state.subject or "[Not set]"
        level = self.state.level or "[Not set]"
        title = self.state.working_title or "[Untitled]"
        chapters_done = len(self.state.chapters)
        current = f"{self.state.current_chapter}.{self.state.current_section}" if self.state.chapters else "None"
        
        print(f"  Subject         : {colored(subject, Colors.YELLOW)}")
        print(f"  Level           : {colored(level, Colors.YELLOW)}")
        print(f"  Working Title   : {colored(title, Colors.YELLOW)}")
        print(f"  Chapters done   : {colored(f'{chapters_done}', Colors.GREEN)}")
        print(f"  Current chapter : {colored(current, Colors.YELLOW)}")
        print(f"  Estimated pages : {colored(f'~{self.state.estimated_pages}', Colors.YELLOW)}")
        print()
    
    def display_menu(self):
        """Display interactive menu."""
        print(colored("┌" + "─"*31 + "┐", Colors.BLUE))
        print(colored("│ OUTPUT MENU                   │", Colors.BLUE))
        print(colored("└" + "─"*31 + "┘", Colors.BLUE))
        print()
        print(colored("  [1]", Colors.BOLD) + "  Show current Table of Contents")
        print(colored("  [2]", Colors.BOLD) + "  Generate/continue next section")
        print(colored("  [3]", Colors.BOLD) + "  Generate specific chapter/section")
        print(colored("  [4]", Colors.BOLD) + "  Generate exercises + solutions")
        print(colored("  [5]", Colors.BOLD) + "  Improve/rewrite last section")
        print(colored("  [6]", Colors.BOLD) + "  Change scope/style/level")
        print(colored("  [7]", Colors.BOLD) + "  Add visual description / pseudocode")
        print(colored("  [8]", Colors.BOLD) + "  Generate summary/cheat-sheet")
        print(colored("  [9]", Colors.BOLD) + "  Export current textbook (full markdown)")
        print(colored("  [*]", Colors.BOLD) + "  🚀 AUTO-GENERATE COMPLETE TEXTBOOK (TOC+Cheat+Sections+Problems)")
        print(colored("  [0]", Colors.BOLD) + "  Start completely new textbook (reset)")
        print()
    
    def display_last_action(self, action):
        """Display last action/user request."""
        print(colored("┌" + "─"*31 + "┐", Colors.BLUE))
        print(colored("│ LAST ACTION / USER REQUEST    │", Colors.BLUE))
        print(colored("└" + "─"*31 + "┘", Colors.BLUE))
        print(f"  {action}")
        print()
    
    def setup_new_textbook(self):
        """Interactive setup for new textbook."""
        self.display_header()
        print(colored("🎓 Welcome to TextbookMaster v3.5!", Colors.GREEN))
        print(colored("Let's create an excellent academic textbook together.\n", Colors.GREEN))
        
        print(colored("Step 1: Add a Syllabus PDF (Optional)", Colors.BOLD))
        print("You can provide a PDF syllabus to use as context for textbook generation.")
        pdf_input = input(colored("PDF path (or press Enter to skip): ", Colors.YELLOW)).strip()
        
        if pdf_input:
            syllabus = self.extract_pdf_text(pdf_input)
            if syllabus:
                self.state.pdf_path = pdf_input
                self.state.syllabus_text = syllabus
                print(colored("✓ PDF loaded successfully!\n", Colors.GREEN))
            else:
                print(colored("⚠ Could not load PDF. Continuing without it.\n", Colors.YELLOW))
        
        print(colored("Step 2: Choose Subject", Colors.BOLD))
        print("What subject would you like to create a textbook about?")
        print("Examples: Linear Algebra, Python Programming, Organic Chemistry,")
        print("          Data Structures & Algorithms, Classical Mechanics, etc.\n")
        self.state.subject = input(colored("Subject: ", Colors.YELLOW)).strip()
        
        if not self.state.subject:
            print(colored("❌ Subject cannot be empty!", Colors.RED))
            return False
        
        print("\n" + colored("Step 3: Choose Level", Colors.BOLD))
        print("What is your preferred academic level?")
        print("  [1] School (high school / secondary)")
        print("  [2] College (introductory university)")
        print("  [3] Advanced-Undergrad (upper-level courses)")
        print("  [4] Graduate (master's level, research-oriented)")
        print("  [5] Professional (industry/certification prep)")
        print("  [6] Exam-Prep (focused on test mastery)")
        print("  [7] Self-Learner (friendly, exploratory)\n")
        
        level_map = {
            "1": "School",
            "2": "College",
            "3": "Advanced-Undergrad",
            "4": "Graduate",
            "5": "Professional",
            "6": "Exam-Prep",
            "7": "Self-Learner"
        }
        
        choice = input(colored("Level (1-7): ", Colors.YELLOW)).strip()
        self.state.level = level_map.get(choice, "College")
        
        print("\n" + colored("Step 4: Brief Description", Colors.BOLD))
        print("Brief description of textbook scope (optional):")
        scope = input(colored("Scope: ", Colors.YELLOW)).strip()
        
        if scope:
            self.state.working_title = f"{self.state.subject} - {scope}"
        else:
            self.state.working_title = f"Complete Textbook on {self.state.subject}"
        
        print(colored(f"\n✓ Textbook initialized!", Colors.GREEN))
        self.state.save()
        return True
    
    def generate_toc(self):
        """Generate Table of Contents using OpenAI."""
        if not self.state.subject:
            print(colored("❌ No textbook initialized!", Colors.RED))
            return False
        
        print(colored("\n⏳ Generating Table of Contents...", Colors.YELLOW))
        
        prompt = f"""You are an expert academic textbook author. Create a comprehensive Table of Contents for a textbook on:

Subject: {self.state.subject}
Level: {self.state.level}
Title: {self.state.working_title}

Generate a structured Table of Contents with:
- 8-15 main chapters
- 3-5 sections per chapter
- Clear, logical progression from simple to complex
- Section descriptions (2-3 lines each)

Format as markdown with proper hierarchy using # ## ###
Include brief descriptions of what students will learn in each section."""

        try:
            response = self.client.chat.completions.create(
                model=MODEL,
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            toc = response.choices[0].message.content
            self.state.table_of_contents.append(toc)
            self.state.save()
            
            print(colored("\n✅ Table of Contents generated!\n", Colors.GREEN))
            print(toc)
            return True
            
        except Exception as e:
            print(colored(f"\n❌ Error: {e}", Colors.RED))
            return False
    
    def generate_section(self, chapter_num=None, section_num=None, title=None):
        """Generate a specific section."""
        if not self.state.subject:
            print(colored("❌ No textbook initialized!", Colors.RED))
            return False
        
        if chapter_num is None or section_num is None or title is None:
            chapter_num = input(colored("Chapter number: ", Colors.YELLOW))
            section_num = input(colored("Section number: ", Colors.YELLOW))
            title = input(colored("Section title: ", Colors.YELLOW))
        
        print(colored(f"\n⏳ Generating Chapter {chapter_num}.{section_num}: {title}...", Colors.YELLOW))
        
        # Include syllabus context if available
        syllabus_context = ""
        if self.state.syllabus_text:
            syllabus_context = f"\n\nRELATED SYLLABUS CONTEXT:\n{self.state.syllabus_text[:2000]}\n(Use this to align the textbook with the course requirements)"
        
        prompt = f"""You are an elite, university-level textbook author with 25+ years of experience.

Write a comprehensive, academically rigorous section for a textbook.

TEXTBOOK DETAILS:
- Subject: {self.state.subject}
- Level: {self.state.level}
- Title: {self.state.working_title}
{syllabus_context}

SECTION TO WRITE:
- Chapter {chapter_num}, Section {section_num}
- Title: {title}

REQUIREMENTS FOR THIS SECTION (STRICT):

1. **Learning Objectives** (4-6 bullet points)
   - Clear, measurable learning outcomes

2. **Main Explanatory Text**
   - Extremely clear and logically progressive
   - Perfect scaffolding (simple → complex)
   - Step-by-step development
   - Modern, engaging but professional academic tone
   - 2000-3000 words minimum

3. **Important Definitions & Conventions**
   - Use markdown boxes (> **Note:**)
   - Consistent terminology throughout

4. **Worked Examples** (2-3 numbered examples)
   - Detailed, high-quality worked solutions
   - Show all steps clearly
   - Explain reasoning, not just formulas

5. **Common Mistakes / Watch Out For**
   - Typical student misconceptions
   - Explain why these are wrong

6. **Quick Summary / Key Takeaways** (boxed)
   - Condensed review of essential points

7. **Exercises** (8-12 problems)
   - Tag difficulty: [Easy] [Medium] [Challenging]
   - 3-4 easy, 3-4 medium, 2-4 challenging
   - Mix theory and application

8. **Hints for Hard Problems**
   - Guidance without giving away answer

FORMAT: Use markdown lavishly with:
- Headings (##, ###, ####)
- **bold**, *italic*, `code`
- > quotes and callouts
- LaTeX for math: $$ ... $$
- Tables, lists, organized sections

START WRITING THE SECTION NOW:"""

        try:
            response = self.client.chat.completions.create(
                model=MODEL,
                max_tokens=8000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            section_content = response.choices[0].message.content
            
            # Store section
            section_key = f"Chapter{chapter_num}_Section{section_num}"
            self.state.content[section_key] = {
                "title": title,
                "chapter": int(chapter_num),
                "section": int(section_num),
                "content": section_content
            }
            
            # Update state
            if int(chapter_num) not in self.state.chapters:
                self.state.chapters.append(int(chapter_num))
            self.state.current_chapter = int(chapter_num)
            self.state.current_section = int(section_num)
            self.state.estimated_pages = len(self.state.content) * 3  # Rough estimate
            self.state.save()
            
            self.last_generated_section = section_content
            
            print(colored("\n✅ Section generated!\n", Colors.GREEN))
            print("─" * 80)
            print(colored(f"CHAPTER {chapter_num} / SECTION {section_num}: {title}", Colors.BOLD))
            print("─" * 80)
            print(section_content)
            print("─" * 80)
            print(colored("\nEnd of section. Ready for next instruction.", Colors.BLUE))
            
            return True
            
        except Exception as e:
            print(colored(f"\n❌ Error: {e}", Colors.RED))
            return False
    
    def generate_exercises_with_solutions(self):
        """Generate exercises and solutions for the last section."""
        if not self.last_generated_section:
            print(colored("❌ No section generated yet!", Colors.RED))
            return False
        
        print(colored("\n⏳ Generating comprehensive exercises and solutions...", Colors.YELLOW))
        
        prompt = f"""Based on this textbook section, generate comprehensive practice problems with detailed solutions.

SECTION CONTENT:
{self.last_generated_section}

Generate:

1. **Practice Exercises** (12-15 problems)
   - [Easy] - 4 problems
   - [Medium] - 5 problems  
   - [Challenging] - 3-4 problems
   - [Bonus/Extension] - 1-2 problems
   - Each with clear numbering

2. **Solutions** (detailed step-by-step)
   - Show all work
   - Explain reasoning
   - Common pitfalls to avoid

3. **Grading Rubric**
   - Point allocations
   - What constitutes full credit

Use markdown formatting with:
- Numbered lists for problems
- Code blocks where applicable
- LaTeX math: $$ ... $$
- Clear section breaks"""

        try:
            response = self.client.chat.completions.create(
                model=MODEL,
                max_tokens=5000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            exercises = response.choices[0].message.content
            
            print(colored("\n✅ Exercises and solutions generated!\n", Colors.GREEN))
            print("─" * 80)
            print(colored("PRACTICE EXERCISES & SOLUTIONS", Colors.BOLD))
            print("─" * 80)
            print(exercises)
            print("─" * 80)
            
            return True
            
        except Exception as e:
            print(colored(f"\n❌ Error: {e}", Colors.RED))
            return False
    
    def export_textbook(self, filename=None):
        """Export complete textbook to markdown."""
        if not filename:
            filename = f"textbook_{self.state.subject.replace(' ', '_').lower()}.md"
        
        print(colored(f"\n📝 Exporting textbook to {filename}...", Colors.YELLOW))
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                # Header
                f.write(f"# {self.state.working_title}\n\n")
                f.write(f"**Level:** {self.state.level}\n\n")
                f.write(f"**Subject:** {self.state.subject}\n\n")
                f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                f.write("---\n\n")
                
                # Table of Contents
                if self.state.table_of_contents:
                    f.write("## Table of Contents\n\n")
                    for toc in self.state.table_of_contents:
                        f.write(toc)
                        f.write("\n\n---\n\n")
                
                # Content sections
                sorted_sections = sorted(
                    self.state.content.values(),
                    key=lambda x: (x['chapter'], x['section'])
                )
                
                for section in sorted_sections:
                    f.write(f"\n## Chapter {section['chapter']} - Section {section['section']}: {section['title']}\n\n")
                    f.write(section['content'])
                    f.write("\n\n---\n\n")
            
            print(colored(f"✅ Textbook exported to {filename}", Colors.GREEN))
            return True
            
        except Exception as e:
            print(colored(f"❌ Error: {e}", Colors.RED))
            return False
    
    def auto_generate_complete_textbook(self):
        """Auto-generate complete textbook: TOC, Cheat Sheet, Sections, Problems."""
        print(colored("\n🚀 AUTO-GENERATING COMPLETE TEXTBOOK...", Colors.BOLD))
        print(colored("This will generate: TOC + Cheat Sheet + Sections + Practice Problems\n", Colors.CYAN))
        
        if not self.state.subject:
            print(colored("❌ No textbook initialized!", Colors.RED))
            return False
        
        # Create output directory
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_dir = f"textbook_complete_{timestamp}"
        os.makedirs(output_dir, exist_ok=True)
        print(colored(f"📁 Output directory: {output_dir}\n", Colors.YELLOW))
        
        # Step 1: Generate TOC
        print(colored("Step 1: Generating Table of Contents...", Colors.CYAN))
        toc = self.generate_toc()
        if toc:
            with open(f"{output_dir}/01_TABLE_OF_CONTENTS.md", 'w', encoding='utf-8') as f:
                f.write(f"# Table of Contents - {self.state.subject}\n\n")
                f.write(f"**Level:** {self.state.level}\n\n")
                f.write("---\n\n")
                f.write(toc)
            print(colored("✓ Saved: 01_TABLE_OF_CONTENTS.md\n", Colors.GREEN))
        
        # Step 2: Generate Cheat Sheet
        print(colored("Step 2: Generating Comprehensive Cheat Sheet...", Colors.CYAN))
        cheat_sheet = self.generate_cheat_sheet()
        if cheat_sheet:
            with open(f"{output_dir}/02_CHEAT_SHEET.md", 'w', encoding='utf-8') as f:
                f.write(f"# {self.state.subject} - Comprehensive Cheat Sheet\n\n")
                f.write(f"**Level:** {self.state.level}\n")
                f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                f.write("---\n\n")
                f.write(cheat_sheet)
            print(colored("✓ Saved: 02_CHEAT_SHEET.md\n", Colors.GREEN))
        
        # Step 3: Generate 3 Sample Sections
        print(colored("Step 3: Generating Textbook Sections...", Colors.CYAN))
        sections = [
            (1, 1, "Fundamentals & Core Concepts"),
            (1, 2, "Key Theorems & Principles"),
            (2, 1, "Advanced Topics & Applications"),
        ]
        
        textbook_content = f"# Complete Textbook: {self.state.subject}\n\n"
        textbook_content += f"**Level:** {self.state.level}\n"
        textbook_content += f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        textbook_content += "---\n\n"
        
        for chapter, section, title in sections:
            print(colored(f"  • Chapter {chapter}.{section}: {title}...", Colors.YELLOW))
            section_content = self.generate_textbook_section_auto(chapter, section, title)
            if section_content:
                textbook_content += f"\n## Chapter {chapter} - Section {section}: {title}\n\n"
                textbook_content += section_content
                textbook_content += "\n\n---\n\n"
                print(colored(f"    ✓ Generated", Colors.GREEN))
        
        with open(f"{output_dir}/03_TEXTBOOK_SECTIONS.md", 'w', encoding='utf-8') as f:
            f.write(textbook_content)
        print(colored("✓ Saved: 03_TEXTBOOK_SECTIONS.md\n", Colors.GREEN))
        
        # Step 4: Generate Practice Problems
        print(colored("Step 4: Generating 50 Practice Problems with Solutions...", Colors.CYAN))
        problems = self.generate_practice_problems()
        if problems:
            with open(f"{output_dir}/04_PRACTICE_PROBLEMS.md", 'w', encoding='utf-8') as f:
                f.write(f"# {self.state.subject} - Practice Problems & Solutions\n\n")
                f.write(f"**Level:** {self.state.level}\n")
                f.write(f"**Total Problems:** 50\n")
                f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                f.write("---\n\n")
                f.write(problems)
            print(colored("✓ Saved: 04_PRACTICE_PROBLEMS.md\n", Colors.GREEN))
        
        # Step 5: Create Summary
        summary = f"""# Complete Textbook Generation Summary

## Project Details
- **Subject:** {self.state.subject}
- **Level:** {self.state.level}
- **Title:** {self.state.working_title}
- **Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Generated Files

1. **01_TABLE_OF_CONTENTS.md** - Curriculum structure with 8-12 chapters
2. **02_CHEAT_SHEET.md** - Quick reference guide (3000-5000 words)
3. **03_TEXTBOOK_SECTIONS.md** - 3 detailed textbook sections with examples
4. **04_PRACTICE_PROBLEMS.md** - 50 problems with complete solutions

## Study Guide
1. Start with CHEAT_SHEET for overview
2. Read TEXTBOOK_SECTIONS for detailed learning
3. Practice with PRACTICE_PROBLEMS
4. Use TABLE_OF_CONTENTS for navigation

---
Generated by TextbookMaster v3.5
"""
        
        with open(f"{output_dir}/00_SUMMARY.md", 'w', encoding='utf-8') as f:
            f.write(summary)
        
        print(colored("╔" + "═"*75 + "╗", Colors.GREEN))
        print(colored("║" + " "*75 + "║", Colors.GREEN))
        print(colored(f"║  ✅ COMPLETE TEXTBOOK GENERATED!" + " "*40 + "║", Colors.GREEN))
        print(colored(f"║  📁 Directory: {output_dir}" + " "*(75-22-len(output_dir)) + "║", Colors.GREEN))
        print(colored("║" + " "*75 + "║", Colors.GREEN))
        print(colored("╚" + "═"*75 + "╝", Colors.GREEN))
        print(colored(f"\n📂 5 Files Generated:", Colors.BOLD))
        print("  1. 00_SUMMARY.md")
        print("  2. 01_TABLE_OF_CONTENTS.md")
        print("  3. 02_CHEAT_SHEET.md")
        print("  4. 03_TEXTBOOK_SECTIONS.md")
        print("  5. 04_PRACTICE_PROBLEMS.md")
        
        return True
    
    def generate_textbook_section_auto(self, chapter_num, section_num, title):
        """Generate a textbook section (auto version without input prompts)."""
        syllabus_context = ""
        if self.state.syllabus_text:
            syllabus_context = f"\n\nRELATED SYLLABUS CONTEXT:\n{self.state.syllabus_text[:2000]}"
        
        prompt = f"""You are an elite, university-level textbook author with 25+ years of experience.

Write a comprehensive, academically rigorous section for a textbook.

TEXTBOOK DETAILS:
- Subject: {self.state.subject}
- Level: {self.state.level}
- Title: {self.state.working_title}
{syllabus_context}

SECTION TO WRITE:
- Chapter {chapter_num}, Section {section_num}
- Title: {title}

REQUIREMENTS (MANDATORY):

1. **Learning Objectives** (5 bullet points)
2. **Main Explanatory Text** (2500-3500 words minimum, clear progression)
3. **Important Definitions & Theorems** (with markdown boxes)
4. **Worked Examples** (3-4 detailed step-by-step examples)
5. **Common Mistakes & Misconceptions** 
6. **Key Takeaways** (boxed summary)
7. **Exercises** (10-12 problems: Easy/Medium/Challenging)
8. **Complete Solutions to All Exercises**

Use markdown extensively: headings, bold, italics, LaTeX ($$...$$), tables, code blocks.

NOW WRITE THE COMPLETE SECTION:"""

        try:
            response = self.client.chat.completions.create(
                model=MODEL,
                max_tokens=8000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(colored(f"❌ Error: {e}", Colors.RED))
            return None
    
    def generate_cheat_sheet(self):
        """Generate comprehensive cheat sheet."""
        syllabus_context = ""
        if self.state.syllabus_text:
            syllabus_context = f"\n\nSYLLABUS:\n{self.state.syllabus_text[:1500]}"
        
        prompt = f"""Create a high-density, comprehensive study cheat sheet for:

Subject: {self.state.subject}
Level: {self.state.level}
Title: {self.state.working_title}
{syllabus_context}

Include:
1. Core Formulas & Theorems (with brief explanations)
2. Key Definitions (concise)
3. Quick Reference (essential facts)
4. Common Techniques (standard methods)
5. Memory Aids (mnemonics)
6. Critical Concepts (core ideas)
7. Problem-Solving Flowchart
8. Units & Notation
9. Common Mistakes to Avoid
10. Quick Derivations

Make it dense but scannable, 3000-5000 words, highly organized with tables and boxes."""

        try:
            response = self.client.chat.completions.create(
                model=MODEL,
                max_tokens=6000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(colored(f"❌ Error: {e}", Colors.RED))
            return None
    
    def generate_practice_problems(self):
        """Generate 50 practice problems with solutions."""
        syllabus_context = ""
        if self.state.syllabus_text:
            syllabus_context = f"\n\nSYLLABUS:\n{self.state.syllabus_text[:1500]}"
        
        prompt = f"""Create 50 comprehensive practice problems for:

Subject: {self.state.subject}
Level: {self.state.level}
{syllabus_context}

Organize as:
- SECTION 1: BASIC CONCEPT PROBLEMS (10 [Easy] problems)
- SECTION 2: SKILL-BUILDING PROBLEMS (15 [Medium] problems)
- SECTION 3: CHALLENGING PROBLEMS (15 [Challenging] problems)
- SECTION 4: EXAM-STYLE PROBLEMS (10 [Challenging] problems)

For EACH problem:
- Clear problem statement
- Indicate difficulty and topic

Then provide:
- Detailed step-by-step solutions
- Explanations of concepts used
- Alternative approaches where relevant
- Grading rubric for each

Use clear markdown formatting with numbered lists and solution boxes."""

        try:
            response = self.client.chat.completions.create(
                model=MODEL,
                max_tokens=8000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(colored(f"❌ Error: {e}", Colors.RED))
            return None
    
    def run(self):
        """Main interactive loop."""
        self.display_header()
        
        # Check if resuming existing project
        existing_state = TextbookState.load()
        if existing_state and existing_state.subject:
            print(colored("📚 Found existing textbook project!", Colors.CYAN))
            print(f"Subject: {existing_state.subject}")
            print(f"Level: {existing_state.level}\n")
            
            resume = input(colored("Resume this project? (y/n): ", Colors.YELLOW)).lower().strip()
            if resume == 'y':
                self.state = existing_state
            else:
                # Clear state and start fresh
                if os.path.exists(TEXTBOOK_STATE_FILE):
                    os.remove(TEXTBOOK_STATE_FILE)
                self.state = TextbookState()
                self.setup_new_textbook()
        else:
            self.setup_new_textbook()
        
        # Main interactive loop
        while True:
            try:
                print("\n")
                self.display_status()
                self.display_menu()
                
                choice = input(colored("Your choice (0-9): ", Colors.YELLOW)).strip()
                
                # Skip empty input
                if not choice:
                    print(colored("⚠ Please enter a valid choice (0-9)", Colors.YELLOW))
                    continue
                
                self.display_last_action(f"User selected option [{choice}]")
                
                if choice == "1":
                    self.generate_toc()
                
                elif choice == "2":
                    chap = str(len(self.state.chapters) + 1) if self.state.chapters else "1"
                    sect = "1"
                    title = input(colored("Section title: ", Colors.YELLOW)).strip()
                    if title:
                        self.generate_section(chap, sect, title)
                    else:
                        print(colored("⚠ Section title cannot be empty", Colors.YELLOW))
                
                elif choice == "3":
                    chapter = input(colored("Chapter number: ", Colors.YELLOW)).strip()
                    section = input(colored("Section number: ", Colors.YELLOW)).strip()
                    title = input(colored("Section title: ", Colors.YELLOW)).strip()
                    if chapter and section and title:
                        self.generate_section(chapter, section, title)
                    else:
                        print(colored("⚠ All fields are required", Colors.YELLOW))
                
                elif choice == "4":
                    self.generate_exercises_with_solutions()
                
                elif choice == "5":
                    if self.last_generated_section:
                        print(colored("💡 Use option [3] to generate a new version of a specific section", Colors.BLUE))
                    else:
                        print(colored("❌ No section generated yet!", Colors.RED))
                
                elif choice == "6":
                    print(colored("📝 Modify the prompt in generate_section() to change style/level", Colors.BLUE))
                
                elif choice == "7":
                    print(colored("🎨 Add visual descriptions in section title (e.g., 'Chapter 1: [Diagram of concept]')", Colors.BLUE))
                
                elif choice == "8":
                    print(colored("\n📋 CURRENT PROJECT SUMMARY:", Colors.BOLD))
                    summary = f"  Textbook: {self.state.working_title}\n"
                    summary += f"  Subject: {self.state.subject}\n"
                    summary += f"  Level: {self.state.level}\n"
                    summary += f"  Sections generated: {len(self.state.content)}\n"
                    summary += f"  Estimated pages: ~{self.state.estimated_pages}\n"
                    if self.state.pdf_path:
                        summary += f"  PDF Source: {self.state.pdf_path}"
                    print(colored(summary, Colors.GREEN))
                
                elif choice == "9":
                    filename = input(colored("Output filename (default: auto): ", Colors.YELLOW)).strip()
                    self.export_textbook(filename if filename else None)
                
                elif choice == "*":
                    confirm = input(colored("Generate complete textbook? (y/n): ", Colors.YELLOW)).lower().strip()
                    if confirm == 'y':
                        self.auto_generate_complete_textbook()
                
                elif choice == "0":
                    confirm = input(colored("Start new textbook? (y/n): ", Colors.YELLOW)).lower().strip()
                    if confirm == 'y':
                        if os.path.exists(TEXTBOOK_STATE_FILE):
                            os.remove(TEXTBOOK_STATE_FILE)
                        self.state = TextbookState()
                        self.setup_new_textbook()
                
                else:
                    print(colored("❌ Invalid choice. Please select 0-9.", Colors.RED))
                
                # Wait for user to see the output
                input(colored("\nPress Enter to continue...", Colors.CYAN))
                
            except KeyboardInterrupt:
                print(colored("\n\n✋ Program interrupted. Saving progress...", Colors.YELLOW))
                self.state.save()
                print(colored("✅ Progress saved!", Colors.GREEN))
                break
            except Exception as e:
                print(colored(f"❌ Unexpected error: {e}", Colors.RED))
                continue

# ============================================================================
# MAIN
# ============================================================================
if __name__ == "__main__":
    if OPENAI_API_KEY == "your-api-key-here":
        print(colored("❌ Error: Please set your OpenAI API key!", Colors.RED))
        print("   export OPENAI_API_KEY='sk-...'")
        sys.exit(1)
    
    master = TextbookMaster()
    master.run()

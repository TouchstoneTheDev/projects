# Textbook Generator from Syllabus PDF

A simple Python program that generates comprehensive textbook content from a syllabus PDF using OpenAI API.

## Features

- ✅ Extracts text from PDF syllabus
- ✅ Uses OpenAI API (GPT-4o or GPT-3.5-turbo)
- ✅ Generates detailed, long-form textbook content
- ✅ Includes learning objectives, examples, and practice questions
- ✅ Saves output as formatted Markdown file
- ✅ Streaming output for real-time feedback

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements_textbook.txt
```

Or manually:
```bash
pip install openai PyPDF2
```

### 2. Set Up OpenAI API Key

**Option A: Environment Variable (Recommended)**
```bash
export OPENAI_API_KEY="sk-your-api-key-here"
```

**Option B: Edit the Script**
Open `textbook_generator.py` and update:
```python
OPENAI_API_KEY = "sk-your-api-key-here"
```

### 3. Choose Your Model

In `textbook_generator.py`, set the MODEL variable:

```python
MODEL = "gpt-4o"              # Best quality (more expensive)
# MODEL = "gpt-3.5-turbo"     # Faster and cheaper
```

### 4. Run the Program

```bash
# Basic usage
python textbook_generator.py syllabus.pdf

# With custom output filename
python textbook_generator.py syllabus.pdf my_textbook.md
```

## Example Usage

```bash
# Generate textbook from economics syllabus
python textbook_generator.py economics_syllabus.pdf economics_textbook.md

# Or just use default output name
python textbook_generator.py machine_learning_syllabus.pdf
```

Output files:
- Default: `generated_textbook.md`
- Custom: `my_textbook.md`

## Configuration Options

Edit these in `textbook_generator.py`:

```python
# Your OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-api-key-here")

# Model choice
MODEL = "gpt-4o"  # or "gpt-3.5-turbo"
```

## Output Format

The generated textbook includes:
- Table of contents
- Chapter introductions
- Detailed explanations for each topic
- Key concepts and definitions
- Examples and case studies
- Learning objectives
- Real-world applications
- Practice questions and review sections
- Summary points

## API Costs

Approximate costs per textbook (5000+ words):
- **gpt-4o**: $0.10 - $0.50 per textbook
- **gpt-3.5-turbo**: $0.01 - $0.05 per textbook

Costs depend on:
- PDF length/complexity
- Output length (typically 5000-10000 words)
- Model choice

## Troubleshooting

### "API key not found"
```bash
export OPENAI_API_KEY="sk-your-key"
# or edit OPENAI_API_KEY in the script
```

### "PyPDF2 not installed"
```bash
pip install PyPDF2
```

### "PDF file not found"
- Make sure the PDF path is correct (absolute or relative)
- Check file exists: `ls -la syllabus.pdf`

### Large PDF Performance
- Larger PDFs take longer to process
- Consider increasing `max_tokens` in the script if output is truncated
- Use GPT-3.5-turbo for faster processing on large files

## Tips for Best Results

1. **Clear syllabus**: Well-structured syllabus PDFs produce better textbooks
2. **Specific topics**: More specific topic descriptions generate more relevant content
3. **Model choice**: Use gpt-4o for better quality, gpt-3.5-turbo for speed
4. **Token limits**: Adjust `max_tokens` for longer/shorter textbooks

## Example Output

The generated textbook will have:

```markdown
# Complete Textbook on [Subject]

## Table of Contents
1. Introduction
2. Chapter 1: [First Topic]
3. Chapter 2: [Second Topic]
...

## Introduction
[Comprehensive introduction to the subject]

## Chapter 1: [First Topic]

### Learning Objectives
- [Objective 1]
- [Objective 2]

### Detailed Explanation
[Long-form, detailed explanation]

### Key Concepts
- Concept 1: Definition...
- Concept 2: Definition...

### Examples
[Real-world examples and case studies]

### Practice Questions
1. Question 1
2. Question 2

### Summary
[Summary of key points]
```

## API Limits

- Context: Up to 128k tokens (input + output combined)
- Output: Up to 8000 tokens per request (can be increased)
- Rate limits: Based on your OpenAI plan

## Next Steps

1. Test with a sample syllabus PDF
2. Adjust prompt in the script for your specific needs
3. Use the output as a study guide or starting point for further editing

## Support

For issues with:
- **OpenAI API**: https://platform.openai.com/docs
- **PyPDF2**: https://github.com/py-pdf/PyPDF2
- **This script**: Check the troubleshooting section above

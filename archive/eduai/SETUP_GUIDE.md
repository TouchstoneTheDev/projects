# EduAI - Educational Content Generation Tool

A comprehensive Python tool for generating educational content (study guides, concept explanations, and practice problems) powered by leading AI models.

## 📋 Project Overview

EduAI is an intelligent content generation system that helps educators and students create high-quality educational materials from raw learning content. It supports multiple AI providers (OpenAI, Anthropic Claude, Google Vertex AI, and Grok) and provides three main content generation templates.

### Key Features

- **Multi-Provider Support**: Generate content using OpenAI (GPT-4), Claude, Google Gemini, or Grok
- **Multiple Templates**: Choose from study guides, concept explanations, or practice problems
- **Material Loading**: Automatically load and process materials from files or directories
- **Context Building**: Intelligently combine multiple materials into structured prompts
- **Production Quality**: Full type hints, comprehensive docstrings, and error handling

## 🏗️ Project Structure

```
eduai/
├── config.py                 # Configuration and constants
├── requirements.txt          # Python dependencies
├── cli.py                    # Main command-line interface
├── llm/                      # Language model adapters
│   ├── __init__.py
│   ├── base.py              # Abstract base class
│   ├── router.py            # Factory pattern router
│   ├── openai_llm.py        # OpenAI adapter
│   ├── claude_llm.py        # Anthropic Claude adapter
│   ├── gcp_llm.py           # Google Vertex AI adapter
│   └── grok_llm.py          # Grok adapter
├── prompts/                 # Prompt templates
│   ├── __init__.py
│   ├── templates.py         # Template functions
│   └── registry.py          # Template registry
├── context/                 # Learning context
│   ├── __init__.py
│   └── learning_context.py  # Context builder
└── core/                    # Core generation logic
    ├── __init__.py
    ├── loader.py            # Material loader
    └── generator.py         # Content generator orchestrator
```

## 🚀 Setup Instructions

### 1. Navigate to Project Directory

```bash
cd /workspaces/projects/eduai
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Up API Keys

Before running, ensure you have the necessary API credentials:

**OpenAI**:
```bash
export OPENAI_API_KEY="your-openai-api-key"
```

**Anthropic Claude**:
```bash
export ANTHROPIC_API_KEY="your-anthropic-api-key"
```

**Google Cloud (for Vertex AI)**:
```bash
# Set up Google Cloud credentials
gcloud auth application-default login
```

**Grok**:
```bash
export GROK_API_KEY="your-grok-api-key"
```

### 4. Create Sample Materials (Optional)

Create a `materials/` directory with sample content:

```bash
mkdir -p materials
cat > materials/sample.md << 'EOF'
# Python Basics

## Variables and Data Types

Variables are containers for storing data values. Python is dynamically typed, 
meaning you don't need to declare variable types explicitly.

### Common Data Types:
- int: Integer numbers
- float: Decimal numbers
- str: Text strings
- bool: True or False
- list: Ordered collections
- dict: Key-value pairs

## Control Flow

### if/elif/else Statements
```
if condition:
    # code
elif other_condition:
    # code
else:
    # code
```

### Loops
- for loops: Iterate over sequences
- while loops: Repeat while condition is true
EOF
```

## 📖 How to Run the CLI

### Interactive Mode

Run the main CLI with interactive prompts:

```bash
python cli.py
```

You'll be guided through:
1. **Provider Selection**: Choose your AI provider (OpenAI, Claude, GCP, Grok)
2. **Credentials**: Provide necessary API keys or credentials
3. **Model Selection**: Choose or confirm the model to use
4. **Content Configuration**:
   - Course/Subject name
   - Topic to generate content about
   - Student level (beginner, intermediate, advanced)
   - Path to learning materials
5. **Template Selection**: Choose content type (study guide, concept explainer, practice problems)

### Example Session

```bash
$ python cli.py

============================================================
🎓 EduAI - Educational Content Generator
============================================================

Create study guides, concept explanations, and practice problems
powered by leading AI models.

📊 Available LLM Providers:
  1. openai
  2. claude
  3. gcp
  4. grok

Select provider (number): 2
✓ Selected: CLAUDE

🔐 CLAUDE Credentials:
  Claude API Key: sk-ant-...

Enter model name [claude-3-5-sonnet-20241022]: 

📝 Content Configuration:
  Course/Subject name [Computer Science]: Python Programming
  Topic to generate content about [Python Basics]: List Comprehensions
  Student level [beginner]: intermediate
  Path to learning materials [./materials]: ./materials

📋 Available Templates:
  1. Study Guide
  2. Concept Explainer
  3. Practice Problems

Select template (number): 1
✓ Selected: study_guide

============================================================
Starting content generation pipeline...

🚀 Initializing LLM: claude (claude-3-5-sonnet-20241022)
✓ LLM initialized successfully
📚 Loading materials from ./materials
✓ Loaded 1 file(s)
🔨 Building learning context
✓ Context built: 1 file(s), 1250 characters
📝 Applying template: study_guide
✓ Template applied
⚡ Generating content with LLM
✓ Content generated successfully
✓ Output saved to output/result.md

============================================================
✨ Content generation completed successfully!
📄 Output saved to: output/result.md
============================================================
```

## 🎯 Usage Examples

### Example 1: Generate a Study Guide

```bash
python cli.py
# Select: Claude
# Enter course: "Advanced Python"
# Topic: "Decorators and Closures"
# Level: "advanced"
# Materials path: "./python_materials/"
# Template: "study_guide"
```

**Output**: Comprehensive study guide in `output/result.md`

### Example 2: Create a Concept Explanation

```bash
python cli.py
# Select: OpenAI (GPT-4)
# Course: "Web Development"
# Topic: "REST APIs"
# Level: "intermediate"
# Materials: "./web_dev_docs/"
# Template: "concept_explainer"
```

**Output**: Detailed concept explanation in `output/result.md`

### Example 3: Generate Practice Problems

```bash
python cli.py
# Select: GCP (Gemini)
# Course: "Data Science"
# Topic: "Machine Learning Classification"
# Level: "advanced"
# Materials: "./ml_textbook/"
# Template: "practice_problems"
```

**Output**: Structured practice problems with solutions in `output/result.md`

## 📦 Module Documentation

### config.py

Central configuration module containing:
- **DEFAULT_MODELS**: Model identifiers for each provider
- **OUTPUT_DIR**: Directory for generated content
- **MAX_TOKENS**: Maximum tokens for generation (4000)
- **TEMPERATURE**: Sampling temperature (0.7)
- Automatic output directory creation

### llm/ (Language Model Adapters)

#### base.py
- **BaseLLM**: Abstract base class defining the adapter interface
- Methods: `__init__()`, `generate()`, `validate_credentials()`

#### router.py
- **LLMRouter**: Factory class for instantiating adapters
- Methods: `get_adapter()`, `get_available_providers()`

#### Provider Adapters
- **OpenAILLM**: Uses OpenAI's Chat Completion API
- **ClaudeLLM**: Uses Anthropic's Messages API
- **GCPLLM**: Uses Google Vertex AI Generative Models
- **GrokLLM**: Uses Grok's REST API

Each adapter implements provider-specific:
- API client initialization
- Request formatting
- Response parsing
- Error handling

### prompts/ (Prompt Templates)

#### templates.py
Three template functions returning (system_prompt, user_prompt) tuples:

1. **study_guide()**: Creates comprehensive study materials
2. **concept_explainer()**: Explains complex concepts step-by-step
3. **practice_problems()**: Generates practice exercises with solutions

#### registry.py
- **TEMPLATE_REGISTRY**: Maps template names to functions
- **get_template()**: Retrieve template by name
- **get_available_templates()**: List all templates
- **apply_template()**: Apply template with parameters

### context/ (Context Building)

#### learning_context.py
- **LearningContext**: Combines multiple materials into formatted context
- Methods:
  - `build()`: Format materials with section headers
  - `get_summary()`: Return file count and character count
  - `from_materials()`: Class method for instantiation

### core/ (Generation Pipeline)

#### loader.py
- **MaterialLoader**: Loads educational content from files/directories
- Supports: .txt, .md, .py, .java, .c, .cpp, .js, .html, .css, .json, .xml
- Methods:
  - `load()`: Load from file or directory
  - `_load_directory()`: Recursive directory loading
  - `_read_file()`: Read individual files
  - `get_supported_extensions()`: List supported types

#### generator.py
- **ContentGenerator**: Orchestrates the full generation pipeline
- Pipeline steps:
  1. Initialize LLM
  2. Load materials
  3. Build context
  4. Apply template
  5. Call LLM
  6. Save output
- Methods:
  - `generate()`: Main pipeline execution
  - `_initialize_llm()`: Set up LLM adapter
  - `_save_output()`: Write result to file

### cli.py

Command-line interface with:
- **get_user_input()**: Prompt user with optional defaults
- **select_provider()**: Provider menu selection
- **get_credentials()**: Collect provider-specific credentials
- **select_template()**: Template selection menu
- **get_default_model()**: Get default model for provider
- **main()**: Full interactive workflow

## ✅ Testing Checklist

### Configuration Tests
- [ ] config.py loads without errors
- [ ] DEFAULT_MODELS contains all four providers
- [ ] OUTPUT_DIR and OUTPUT_FILE are correctly set
- [ ] output/ directory is created automatically

### LLM Module Tests
- [ ] base.py BaseLLM class is abstract
- [ ] router.py correctly maps all adapters
- [ ] Each adapter validates credentials properly
- [ ] Unsupported provider raises ValueError

### Prompts Module Tests
- [ ] study_guide returns (system_prompt, user_prompt) tuple
- [ ] concept_explainer returns proper tuple
- [ ] practice_problems returns proper tuple
- [ ] Registry contains all three templates
- [ ] get_template raises ValueError for unknown template

### Context Module Tests
- [ ] LearningContext initializes with materials
- [ ] build() returns formatted string with file headers
- [ ] get_summary() returns correct file count and character count
- [ ] from_materials() creates instance correctly

### Core Module Tests
- [ ] MaterialLoader loads single files
- [ ] MaterialLoader loads directories recursively
- [ ] MaterialLoader raises FileNotFoundError for missing paths
- [ ] MaterialLoader raises ValueError when no text files found
- [ ] Only supported extensions are loaded
- [ ] ContentGenerator orchestrates full pipeline
- [ ] Progress messages print at each step

### CLI Tests
- [ ] CLI starts without errors
- [ ] Provider selection menu works
- [ ] Credential prompting works for each provider
- [ ] Template selection menu displays all options
- [ ] User input collection handles defaults
- [ ] KeyboardInterrupt is handled gracefully
- [ ] Success message displays output path

### Integration Tests
- [ ] Full pipeline executes with sample materials
- [ ] Output file is created with generated content
- [ ] Content is properly formatted Markdown
- [ ] Error messages are helpful and clear

## 🔧 Troubleshooting

### Import Errors

If you get `ModuleNotFoundError`:
```bash
# Install dependencies
pip install -r requirements.txt

# Ensure you're in the eduai directory
cd /workspaces/projects/eduai
```

### API Key Issues

**OpenAI**:
```python
# Import error with openai library
pip install openai==1.3.0
```

**Claude**:
```python
# Import error with anthropic library
pip install anthropic==0.7.0
```

**GCP**:
```python
# Need Google Cloud credentials
pip install google-cloud-aiplatform==1.26.0
pip install google-auth==2.25.0
```

### No Materials Found

Ensure your material path exists and contains text files:
```bash
# Check file existence
ls -la ./materials/

# Verify file extensions
file ./materials/*

# Supported extensions:
# .txt, .md, .py, .java, .c, .cpp, .js, .html, .css, .json, .xml
```

### Network/API Errors

- Verify API keys are correct
- Check internet connection
- Ensure rate limits aren't exceeded
- Check API service status

## 📝 Example Output

Once generation completes, `output/result.md` contains your generated content:

```markdown
# Study Guide: List Comprehensions

## Key Concepts

### What is a List Comprehension?
A list comprehension is a concise and elegant way to create lists in Python. 
It provides a syntactic shortcut for creating lists based on existing lists or 
other iterables...

## Detailed Explanations

### Basic Syntax
The basic syntax of a list comprehension is:
```python
[expression for item in iterable if condition]
```

...

## Practice Scenarios

### Scenario 1: Filtering Even Numbers
...

---
```

## 🎓 Best Practices

1. **Organize Materials**: Keep related materials in the same directory
2. **Clear Topic Names**: Use specific, descriptive topic names
3. **Appropriate Levels**: Match student level to content complexity
4. **Vary Templates**: Try different templates for the same material
5. **Review Output**: Always review AI-generated content for accuracy
6. **Test Different Models**: Different models may have different strengths

## 📚 Additional Resources

- [OpenAI Documentation](https://platform.openai.com/docs)
- [Anthropic Claude Documentation](https://docs.anthropic.com)
- [Google Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)

## 🤝 Contributing

To extend this tool:

1. **Add New Templates**: Create new functions in `prompts/templates.py`
2. **Add New Providers**: Create new adapter classes in `llm/`
3. **Enhance CLI**: Extend functionality in `cli.py`

## ⚠️ Important Notes

- Generated content should be reviewed for accuracy
- Respect API rate limits and quotas
- Protect your API keys; never commit them to version control
- Output format is always Markdown for consistency
- Maximum token limit is 4000 (adjustable in config.py)

---

**Happy Learning! 🎓**

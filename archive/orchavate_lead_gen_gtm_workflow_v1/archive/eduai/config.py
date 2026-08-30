"""Configuration module for EduAI content generation.

This module contains all configuration settings used throughout the application.
"""

import os

# LLM Model Configuration
DEFAULT_MODELS = {
    "openai": "gpt-4-turbo-preview",
    "claude": "claude-3-5-sonnet-20241022",
    "gcp": "gemini-1.5-pro",
    "grok": "grok-beta",
}

# Output Configuration
OUTPUT_DIR = "output"
OUTPUT_FILE = "result.md"
OUTPUT_PATH = os.path.join(OUTPUT_DIR, OUTPUT_FILE)

# LLM Generation Parameters
MAX_TOKENS = 4000
TEMPERATURE = 0.7

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

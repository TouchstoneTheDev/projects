#!/usr/bin/env python
"""Test script for EduAI full pipeline."""

import sys
import os

# Setup path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from eduai.core.loader import MaterialLoader
from eduai.context.learning_context import LearningContext
from eduai.prompts import registry as prompts_registry
from eduai.llm.base import BaseLLM
from eduai import config

print("\n" + "="*60)
print("🎓 EduAI - Full Pipeline Test")
print("="*60 + "\n")

# Test 1: Load materials
print("1️⃣  Testing Material Loader...")
try:
    materials = MaterialLoader.load("eduai/sample_materials")
    print(f"   ✓ Loaded {len(materials)} file(s) from eduai/sample_materials")
    for filename, content in materials:
        print(f"      - {filename} ({len(content)} chars)")
except Exception as e:
    print(f"   ❌ Error: {e}")
    sys.exit(1)

# Test 2: Build context
print("\n2️⃣  Testing Context Builder...")
try:
    context = LearningContext.from_materials(materials)
    context_text = context.build()
    print(f"   ✓ Context built: {context.get_summary()}")
    print(f"      Preview: {context_text[:80]}...")
except Exception as e:
    print(f"   ❌ Error: {e}")
    sys.exit(1)

# Test 3: Apply templates
print("\n3️⃣  Testing Prompt Templates...")
try:
    for template_name in prompts_registry.get_available_templates():
        system_prompt, user_prompt = prompts_registry.apply_template(
            template_name,
            context_text,
            "List Comprehensions",
            "intermediate",
            "Python Programming"
        )
        print(f"   ✓ {template_name}")
        print(f"      System prompt: {system_prompt[:50]}...")
        print(f"      User prompt: {user_prompt[:50]}...")
except Exception as e:
    print(f"   ❌ Error: {e}")
    sys.exit(1)

# Test 4: Configuration
print("\n4️⃣  Testing Configuration...")
try:
    print(f"   ✓ DEFAULT_MODELS: {config.DEFAULT_MODELS}")
    print(f"   ✓ OUTPUT_PATH: {config.OUTPUT_PATH}")
    print(f"   ✓ MAX_TOKENS: {config.MAX_TOKENS}")
    print(f"   ✓ TEMPERATURE: {config.TEMPERATURE}")
    if os.path.exists(config.OUTPUT_DIR):
        print(f"   ✓ Output directory exists: {config.OUTPUT_DIR}")
except Exception as e:
    print(f"   ❌ Error: {e}")
    sys.exit(1)

# Test 5: LLM Router
print("\n5️⃣  Testing LLM Router...")
try:
    from eduai.llm.router import LLMRouter
    providers = LLMRouter.get_available_providers()
    print(f"   ✓ Available providers: {providers}")
    
    # Test invalid provider
    try:
        LLMRouter.get_adapter("invalid", {}, "model")
        print(f"   ❌ Should have raised ValueError for invalid provider")
    except ValueError as e:
        print(f"   ✓ Correctly raises error for invalid provider")
except Exception as e:
    print(f"   ❌ Error: {e}")
    sys.exit(1)

# Test 6: Material Loader Extensions
print("\n6️⃣  Testing Material Loader Extensions...")
try:
    extensions = MaterialLoader.get_supported_extensions()
    print(f"   ✓ Supported extensions: {sorted(extensions)}")
except Exception as e:
    print(f"   ❌ Error: {e}")
    sys.exit(1)

print("\n" + "="*60)
print("✨ All tests passed!")
print("="*60 + "\n")

print("📝 Quick Start:")
print("   Run the interactive CLI with:")
print("   $ python eduai/cli.py")
print("\n   Or run tests with:")
print("   $ python test_pipeline.py")
print()

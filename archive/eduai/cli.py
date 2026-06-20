"""Command-line interface for EduAI content generation.

This module provides the main entry point for the educational content generation tool.
Users interact with this CLI to create study guides, concept explanations, and practice problems.
"""

from typing import Dict, Optional
import sys
import os

# Ensure the parent directory is in the path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from eduai import config
from eduai.core.generator import ContentGenerator
from eduai.llm.router import LLMRouter
from eduai.prompts import registry as prompts_registry


def get_user_input(prompt: str, default: Optional[str] = None) -> str:
    """Get input from the user with optional default value.
    
    Args:
        prompt (str): The prompt to display to the user.
        default (Optional[str]): Default value if user enters nothing.
        
    Returns:
        str: The user's input or default value.
    """
    if default:
        display_prompt = f"{prompt} [{default}]: "
    else:
        display_prompt = f"{prompt}: "
    
    user_input = input(display_prompt).strip()
    return user_input if user_input else default


def select_provider() -> str:
    """Prompt user to select an LLM provider.
    
    Returns:
        str: The selected provider name.
    """
    print("\n📊 Available LLM Providers:")
    providers = LLMRouter.get_available_providers()
    
    for idx, provider in enumerate(providers, 1):
        print(f"  {idx}. {provider.upper()}")
    
    while True:
        try:
            choice = int(input("\nSelect provider (number): "))
            if 1 <= choice <= len(providers):
                selected = providers[choice - 1]
                print(f"✓ Selected: {selected.upper()}")
                return selected
            print(f"Please enter a number between 1 and {len(providers)}")
        except ValueError:
            print("Please enter a valid number")


def get_credentials(provider: str) -> Dict[str, str]:
    """Get credentials for the selected provider.
    
    Args:
        provider (str): The LLM provider name.
        
    Returns:
        Dict[str, str]: Dictionary containing the required credentials.
    """
    print(f"\n🔐 {provider.upper()} Credentials:")
    
    if provider == "gcp":
        project_id = get_user_input("  Google Cloud Project ID", "my-project")
        region = get_user_input("  Region", "us-central1")
        return {"project_id": project_id, "region": region}
    else:
        api_key = get_user_input(f"  {provider.upper()} API Key")
        if not api_key:
            raise ValueError(f"API key is required for {provider}")
        return {"api_key": api_key}


def select_template() -> str:
    """Prompt user to select a prompt template.
    
    Returns:
        str: The selected template name.
    """
    print("\n📋 Available Templates:")
    templates = prompts_registry.get_available_templates()
    
    for idx, template in enumerate(templates, 1):
        print(f"  {idx}. {template.replace('_', ' ').title()}")
    
    while True:
        try:
            choice = int(input("\nSelect template (number): "))
            if 1 <= choice <= len(templates):
                selected = templates[choice - 1]
                print(f"✓ Selected: {selected}")
                return selected
            print(f"Please enter a number between 1 and {len(templates)}")
        except ValueError:
            print("Please enter a valid number")


def get_default_model(provider: str) -> str:
    """Get the default model for the selected provider.
    
    Args:
        provider (str): The LLM provider name.
        
    Returns:
        str: The default model identifier.
    """
    return config.DEFAULT_MODELS.get(provider, "")


def main() -> None:
    """Main CLI entry point for content generation."""
    try:
        # Print banner
        print("\n" + "=" * 60)
        print("🎓 EduAI - Educational Content Generator")
        print("=" * 60)
        print("\nCreate study guides, concept explanations, and practice problems")
        print("powered by leading AI models.\n")
        
        # Collect user input
        provider = select_provider()
        credentials = get_credentials(provider)
        
        default_model = get_default_model(provider)
        model = get_user_input(
            f"\nEnter model name",
            default_model
        )
        
        print("\n📝 Content Configuration:")
        course = get_user_input("  Course/Subject name", "Computer Science")
        topic = get_user_input("  Topic to generate content about", "Python Basics")
        level = get_user_input("  Student level", "beginner")
        material_path = get_user_input("  Path to learning materials", "./materials")
        
        template = select_template()
        
        # Create generator and run pipeline
        print("\n" + "=" * 60)
        print("Starting content generation pipeline...\n")
        
        generator = ContentGenerator(provider, credentials, model)
        output_path = generator.generate(course, topic, level, material_path, template)
        
        # Success message
        print("\n" + "=" * 60)
        print("✨ Content generation completed successfully!")
        print(f"📄 Output saved to: {output_path}")
        print("=" * 60 + "\n")
    
    except KeyboardInterrupt:
        print("\n\n⚠️  Generation cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        raise


if __name__ == "__main__":
    main()

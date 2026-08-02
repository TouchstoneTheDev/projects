"""Content generator orchestrating the full pipeline.

This module provides the main ContentGenerator class that coordinates
loading materials, building context, applying templates, and generating content.
"""

from typing import Dict

from .. import config
from ..llm.router import LLMRouter
from ..llm.base import BaseLLM
from ..context.learning_context import LearningContext
from ..core.loader import MaterialLoader
from ..prompts import registry as prompts_registry


class ContentGenerator:
    """Orchestrator for the content generation pipeline.
    
    Coordinates all steps: loading materials, building context, applying
    templates, calling LLM, and saving results.
    """
    
    def __init__(
        self, provider: str, credentials: Dict[str, str], model: str
    ) -> None:
        """Initialize the content generator.
        
        Args:
            provider (str): LLM provider name (openai, claude, gcp, grok).
            credentials (Dict[str, str]): Credentials for the provider.
            model (str): Model identifier to use.
        """
        self.provider = provider
        self.credentials = credentials
        self.model = model
        self.llm: BaseLLM = None
    
    def _initialize_llm(self) -> None:
        """Initialize the LLM adapter using the router."""
        print(f"🚀 Initializing LLM: {self.provider} ({self.model})")
        self.llm = LLMRouter.get_adapter(self.provider, self.credentials, self.model)
        print("✓ LLM initialized successfully")
    
    def _save_output(self, content: str) -> str:
        """Save generated content to output file.
        
        Args:
            content (str): The content to save.
            
        Returns:
            str: The path where content was saved.
        """
        with open(config.OUTPUT_PATH, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✓ Output saved to {config.OUTPUT_PATH}")
        return config.OUTPUT_PATH
    
    def generate(
        self,
        course: str,
        topic: str,
        level: str,
        material_path: str,
        template_name: str,
    ) -> str:
        """Generate educational content through the full pipeline.
        
        Args:
            course (str): Course or subject name.
            topic (str): Topic to generate content about.
            level (str): Student level (e.g., beginner, intermediate, advanced).
            material_path (str): Path to learning materials (file or directory).
            template_name (str): Name of the prompt template to use.
            
        Returns:
            str: Path to the saved output file.
            
        Raises:
            Exception: If any step in the pipeline fails.
        """
        try:
            # Step 1: Initialize LLM
            self._initialize_llm()
            
            # Step 2: Load materials
            print(f"📚 Loading materials from {material_path}")
            materials = MaterialLoader.load(material_path)
            print(f"✓ Loaded {len(materials)} file(s)")
            
            # Step 3: Build context
            print("🔨 Building learning context")
            context = LearningContext.from_materials(materials)
            context_text = context.build()
            print(f"✓ Context built: {context.get_summary()}")
            
            # Step 4: Apply template
            print(f"📝 Applying template: {template_name}")
            system_prompt, user_prompt = prompts_registry.apply_template(
                template_name, context_text, topic, level, course
            )
            print("✓ Template applied")
            
            # Step 5: Generate content
            print("⚡ Generating content with LLM")
            output_content = self.llm.generate(system_prompt, user_prompt)
            print("✓ Content generated successfully")
            
            # Step 6: Save output
            output_path = self._save_output(output_content)
            
            return output_path
        
        except Exception as e:
            print(f"❌ Error during generation: {str(e)}")
            raise

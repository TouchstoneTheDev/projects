"""GCP Vertex AI LLM adapter.

This module provides the adapter for integrating with Google Cloud Vertex AI.
"""

from typing import Dict, Any

from .. import config
from .base import BaseLLM


class GCPLLM(BaseLLM):
    """GCP Vertex AI LLM adapter for Gemini models.
    
    This adapter handles communication with Google Cloud's Vertex AI service
    using the official Google Cloud libraries.
    """
    
    def __init__(self, credentials: Dict[str, str], model: str) -> None:
        """Initialize the GCP Vertex AI adapter.
        
        Args:
            credentials (Dict[str, str]): Must contain 'project_id' and 'region' fields.
            model (str): Gemini model identifier (e.g., "gemini-1.5-pro").
        """
        super().__init__(credentials, model)
    
    def validate_credentials(self) -> bool:
        """Validate that GCP credentials are provided.
        
        Returns:
            bool: True if project_id and region are present.
            
        Raises:
            ValueError: If required fields are missing.
        """
        super().validate_credentials()
        if "project_id" not in self.credentials:
            raise ValueError("GCP credentials must contain 'project_id'")
        if "region" not in self.credentials:
            raise ValueError("GCP credentials must contain 'region'")
        return True
    
    def generate(self, system_prompt: str, user_prompt: str, **kwargs) -> str:
        """Generate content using GCP Vertex AI Gemini models.
        
        Args:
            system_prompt (str): System message defining the AI's role.
            user_prompt (str): User's request or question.
            **kwargs: Optional parameters:
                - max_tokens (int): Maximum tokens to generate.
                - temperature (float): Sampling temperature (0-2).
                
        Returns:
            str: The generated text response.
            
        Raises:
            ImportError: If Google Cloud libraries are not installed.
            Exception: If the API call fails.
        """
        try:
            from google.cloud import aiplatform
            from vertexai.preview.generative_models import GenerativeModel
        except ImportError:
            raise ImportError(
                "Google Cloud libraries are not installed. "
                "Install them with: pip install google-cloud-aiplatform"
            )
        
        try:
            project_id = self.credentials["project_id"]
            region = self.credentials["region"]
            
            aiplatform.init(project=project_id, location=region)
            
            model = GenerativeModel(self.model)
            
            # Combine prompts as Gemini doesn't separate system and user messages
            combined_prompt = f"{system_prompt}\n\n{user_prompt}"
            
            max_tokens = kwargs.get("max_tokens", config.MAX_TOKENS)
            temperature = kwargs.get("temperature", config.TEMPERATURE)
            
            generation_config = {
                "max_output_tokens": max_tokens,
                "temperature": temperature,
            }
            
            response = model.generate_content(
                combined_prompt,
                generation_config=generation_config,
            )
            
            return response.text
        
        except Exception as e:
            raise Exception(f"GCP Vertex AI error: {str(e)}")


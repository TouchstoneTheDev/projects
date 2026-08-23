"""OpenAI LLM adapter.

This module provides the adapter for integrating with OpenAI's chat completion API.
"""

from typing import Dict, Any

from .. import config
from .base import BaseLLM


class OpenAILLM(BaseLLM):
    """OpenAI LLM adapter for GPT models.
    
    This adapter handles communication with OpenAI's API using the official
    OpenAI Python library.
    """
    
    def __init__(self, credentials: Dict[str, str], model: str) -> None:
        """Initialize the OpenAI adapter.
        
        Args:
            credentials (Dict[str, str]): Must contain 'api_key' field.
            model (str): OpenAI model identifier (e.g., "gpt-4-turbo-preview").
        """
        super().__init__(credentials, model)
    
    def validate_credentials(self) -> bool:
        """Validate that OpenAI API key is provided.
        
        Returns:
            bool: True if api_key is present.
            
        Raises:
            ValueError: If api_key is missing.
        """
        super().validate_credentials()
        if "api_key" not in self.credentials:
            raise ValueError("OpenAI credentials must contain 'api_key'")
        return True
    
    def generate(self, system_prompt: str, user_prompt: str, **kwargs) -> str:
        """Generate content using OpenAI's chat completion API.
        
        Args:
            system_prompt (str): System message defining the AI's role.
            user_prompt (str): User's request or question.
            **kwargs: Optional parameters:
                - max_tokens (int): Maximum tokens to generate.
                - temperature (float): Sampling temperature (0-2).
                
        Returns:
            str: The generated text response.
            
        Raises:
            ImportError: If openai library is not installed.
            Exception: If the API call fails.
        """
        try:
            from openai import OpenAI
        except ImportError:
            raise ImportError(
                "OpenAI library is not installed. "
                "Install it with: pip install openai"
            )
        
        try:
            client = OpenAI(api_key=self.credentials["api_key"])
            
            max_tokens = kwargs.get("max_tokens", config.MAX_TOKENS)
            temperature = kwargs.get("temperature", config.TEMPERATURE)
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=max_tokens,
                temperature=temperature,
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")

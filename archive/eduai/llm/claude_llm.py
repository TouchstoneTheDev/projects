"""Claude LLM adapter.

This module provides the adapter for integrating with Anthropic's Claude API.
"""

from typing import Dict, Any

from .. import config
from .base import BaseLLM


class ClaudeLLM(BaseLLM):
    """Claude LLM adapter for Anthropic's Claude models.
    
    This adapter handles communication with Anthropic's API using the official
    Anthropic Python library.
    """
    
    def __init__(self, credentials: Dict[str, str], model: str) -> None:
        """Initialize the Claude adapter.
        
        Args:
            credentials (Dict[str, str]): Must contain 'api_key' field.
            model (str): Claude model identifier (e.g., "claude-3-5-sonnet-20241022").
        """
        super().__init__(credentials, model)
    
    def validate_credentials(self) -> bool:
        """Validate that Claude API key is provided.
        
        Returns:
            bool: True if api_key is present.
            
        Raises:
            ValueError: If api_key is missing.
        """
        super().validate_credentials()
        if "api_key" not in self.credentials:
            raise ValueError("Claude credentials must contain 'api_key'")
        return True
    
    def generate(self, system_prompt: str, user_prompt: str, **kwargs) -> str:
        """Generate content using Claude's messaging API.
        
        Args:
            system_prompt (str): System message defining the AI's role.
            user_prompt (str): User's request or question.
            **kwargs: Optional parameters:
                - max_tokens (int): Maximum tokens to generate.
                - temperature (float): Sampling temperature (0-1).
                
        Returns:
            str: The generated text response.
            
        Raises:
            ImportError: If anthropic library is not installed.
            Exception: If the API call fails.
        """
        try:
            from anthropic import Anthropic
        except ImportError:
            raise ImportError(
                "Anthropic library is not installed. "
                "Install it with: pip install anthropic"
            )
        
        try:
            client = Anthropic(api_key=self.credentials["api_key"])
            
            max_tokens = kwargs.get("max_tokens", config.MAX_TOKENS)
            temperature = kwargs.get("temperature", config.TEMPERATURE)
            
            response = client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt},
                ],
            )
            
            return response.content[0].text
        
        except Exception as e:
            raise Exception(f"Claude API error: {str(e)}")

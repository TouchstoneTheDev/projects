"""Grok LLM adapter.

This module provides the adapter for integrating with Grok AI API.
"""

from typing import Dict, Any
import requests

from .. import config
from .base import BaseLLM


class GrokLLM(BaseLLM):
    """Grok LLM adapter for Grok's API.
    
    This adapter handles communication with Grok's API using HTTP requests.
    """
    
    def __init__(self, credentials: Dict[str, str], model: str) -> None:
        """Initialize the Grok adapter.
        
        Args:
            credentials (Dict[str, str]): Must contain 'api_key' field.
            model (str): Grok model identifier (e.g., "grok-beta").
        """
        super().__init__(credentials, model)
    
    def validate_credentials(self) -> bool:
        """Validate that Grok API key is provided.
        
        Returns:
            bool: True if api_key is present.
            
        Raises:
            ValueError: If api_key is missing.
        """
        super().validate_credentials()
        if "api_key" not in self.credentials:
            raise ValueError("Grok credentials must contain 'api_key'")
        return True
    
    def generate(self, system_prompt: str, user_prompt: str, **kwargs) -> str:
        """Generate content using Grok's API.
        
        Args:
            system_prompt (str): System message defining the AI's role.
            user_prompt (str): User's request or question.
            **kwargs: Optional parameters:
                - max_tokens (int): Maximum tokens to generate.
                - temperature (float): Sampling temperature.
                
        Returns:
            str: The generated text response.
            
        Raises:
            Exception: If the API call fails.
        """
        try:
            max_tokens = kwargs.get("max_tokens", config.MAX_TOKENS)
            temperature = kwargs.get("temperature", config.TEMPERATURE)
            
            headers = {
                "Authorization": f"Bearer {self.credentials['api_key']}",
                "Content-Type": "application/json",
            }
            
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
            
            response = requests.post(
                "https://api.x.ai/v1/chat/completions",
                headers=headers,
                json=payload,
            )
            
            response.raise_for_status()
            
            data = response.json()
            return data["choices"][0]["message"]["content"]
        
        except requests.exceptions.RequestException as e:
            raise Exception(f"Grok API request error: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected Grok API response format: {str(e)}")
        except Exception as e:
            raise Exception(f"Grok generation error: {str(e)}")

"""Abstract base class for LLM adapters.

This module defines the interface that all LLM adapter implementations must follow.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any


class BaseLLM(ABC):
    """Abstract base class for Language Model adapters.
    
    All LLM provider adapters (OpenAI, Claude, GCP, etc.) must inherit from
    this class and implement the abstract methods.
    """
    
    def __init__(self, credentials: Dict[str, str], model: str) -> None:
        """Initialize the LLM adapter.
        
        Args:
            credentials (Dict[str, str]): Dictionary containing credentials for the LLM provider.
                Format varies by provider (api_key, project_id, region, etc.).
            model (str): The model identifier to use (e.g., "gpt-4-turbo-preview").
            
        Raises:
            ValueError: If credentials are invalid or incomplete.
        """
        self.credentials = credentials
        self.model = model
        self.validate_credentials()
    
    @abstractmethod
    def generate(self, system_prompt: str, user_prompt: str, **kwargs) -> str:
        """Generate content using the LLM.
        
        Args:
            system_prompt (str): The system message that defines the AI's behavior and role.
            user_prompt (str): The user's request or question.
            **kwargs: Additional parameters like max_tokens, temperature, etc.
            
        Returns:
            str: The generated text response from the LLM.
            
        Raises:
            Exception: If the API call fails or returns an error.
        """
        pass
    
    def validate_credentials(self) -> bool:
        """Validate that provided credentials are sufficient.
        
        This method should be called during initialization to ensure
        all required credential fields are present.
        
        Returns:
            bool: True if credentials are valid, False otherwise.
            
        Raises:
            ValueError: If credentials are invalid or incomplete.
        """
        if not self.credentials:
            raise ValueError("Credentials cannot be empty")
        return True

"""Router factory for LLM adapter selection.

This module implements the factory pattern to instantiate the appropriate
LLM adapter based on the provider name.
"""

from typing import Dict, Type, List

from .base import BaseLLM
from .openai_llm import OpenAILLM
from .claude_llm import ClaudeLLM
from .gcp_llm import GCPLLM
from .grok_llm import GrokLLM


class LLMRouter:
    """Factory class for selecting and creating LLM adapters.
    
    This router manages a registry of available LLM providers and
    provides a unified interface for creating LLM instances.
    """
    
    _adapters: Dict[str, Type[BaseLLM]] = {
        "openai": OpenAILLM,
        "claude": ClaudeLLM,
        "gcp": GCPLLM,
        "grok": GrokLLM,
    }
    
    @classmethod
    def get_adapter(
        cls, provider: str, credentials: Dict[str, str], model: str
    ) -> BaseLLM:
        """Get an LLM adapter instance for the specified provider.
        
        Args:
            provider (str): The LLM provider name (openai, claude, gcp, grok).
            credentials (Dict[str, str]): Credentials for the provider.
            model (str): The model identifier to use.
            
        Returns:
            BaseLLM: An instance of the appropriate LLM adapter.
            
        Raises:
            ValueError: If the provider is not supported or recognized.
        """
        if provider not in cls._adapters:
            available = ", ".join(cls.get_available_providers())
            raise ValueError(
                f"Unsupported LLM provider '{provider}'. "
                f"Available providers: {available}"
            )
        
        adapter_class = cls._adapters[provider]
        return adapter_class(credentials, model)
    
    @classmethod
    def get_available_providers(cls) -> List[str]:
        """Get a list of available LLM providers.
        
        Returns:
            List[str]: List of provider names that are currently supported.
        """
        return list(cls._adapters.keys())

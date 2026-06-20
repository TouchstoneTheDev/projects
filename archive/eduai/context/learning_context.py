"""Learning context builder.

This module provides utilities for building and managing learning context
from multiple material sources.
"""

from typing import List, Tuple


class LearningContext:
    """Builder for learning context from educational materials.
    
    Combines multiple learning materials into a formatted context string
    suitable for use as prompt input.
    """
    
    def __init__(self, materials: List[Tuple[str, str]]) -> None:
        """Initialize the learning context.
        
        Args:
            materials (List[Tuple[str, str]]): List of (filename, content) tuples
                representing the learning materials.
        """
        self.materials = materials
    
    def build(self) -> str:
        """Build a formatted context string from materials.
        
        Combines all materials into a single string with clear section headers
        indicating the source of each material.
        
        Returns:
            str: Formatted context string with all materials.
        """
        context_parts = []
        for filename, content in self.materials:
            context_parts.append(f"### File: {filename}\n{content}")
        return "\n\n".join(context_parts)
    
    def get_summary(self) -> str:
        """Get a summary of the learning context.
        
        Returns:
            str: A summary string showing number of files and total characters.
        """
        num_files = len(self.materials)
        total_chars = sum(len(content) for _, content in self.materials)
        return f"{num_files} file(s), {total_chars} characters"
    
    @classmethod
    def from_materials(cls, materials: List[Tuple[str, str]]) -> "LearningContext":
        """Create a LearningContext instance from materials.
        
        Args:
            materials (List[Tuple[str, str]]): List of (filename, content) tuples.
            
        Returns:
            LearningContext: New instance with the provided materials.
        """
        return cls(materials)

"""Material loader for reading educational content files.

This module provides utilities for loading text files and directories
as learning materials.
"""

import os
from typing import List, Tuple, Optional, Set


class MaterialLoader:
    """Loader for educational materials from files and directories."""
    
    # Supported text file extensions
    TEXT_EXTENSIONS: Set[str] = {
        ".txt", ".md", ".py", ".java", ".c", ".cpp",
        ".js", ".html", ".css", ".json", ".xml",
    }
    
    @classmethod
    def load(cls, path: str) -> List[Tuple[str, str]]:
        """Load materials from a file or directory.
        
        Args:
            path (str): Path to a file or directory to load.
            
        Returns:
            List[Tuple[str, str]]: List of (filename, content) tuples.
            
        Raises:
            FileNotFoundError: If the path doesn't exist.
            ValueError: If no readable text files are found.
        """
        if not os.path.exists(path):
            raise FileNotFoundError(f"Path not found: {path}")
        
        materials = []
        
        if os.path.isfile(path):
            # Load single file
            content = cls._read_file(path)
            if content is not None:
                materials.append((os.path.basename(path), content))
        else:
            # Load directory
            materials = cls._load_directory(path)
        
        if not materials:
            raise ValueError(
                f"No readable text files found in {path}. "
                f"Supported extensions: {', '.join(sorted(cls.TEXT_EXTENSIONS))}"
            )
        
        return materials
    
    @classmethod
    def _load_directory(cls, directory: str) -> List[Tuple[str, str]]:
        """Load all supported text files from a directory.
        
        Args:
            directory (str): Path to the directory.
            
        Returns:
            List[Tuple[str, str]]: List of (filename, content) tuples.
        """
        materials = []
        
        for filename in os.listdir(directory):
            filepath = os.path.join(directory, filename)
            
            # Skip subdirectories
            if os.path.isdir(filepath):
                continue
            
            content = cls._read_file(filepath)
            if content is not None:
                materials.append((filename, content))
        
        return materials
    
    @classmethod
    def _read_file(cls, filepath: str) -> Optional[str]:
        """Read a file if it has a supported text extension.
        
        Args:
            filepath (str): Path to the file.
            
        Returns:
            Optional[str]: File content if readable, None otherwise.
        """
        # Check file extension
        _, ext = os.path.splitext(filepath)
        if ext.lower() not in cls.TEXT_EXTENSIONS:
            return None
        
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return f.read()
        except (UnicodeDecodeError, IOError):
            return None
    
    @classmethod
    def get_supported_extensions(cls) -> Set[str]:
        """Get the set of supported file extensions.
        
        Returns:
            Set[str]: Set of supported extensions.
        """
        return cls.TEXT_EXTENSIONS.copy()

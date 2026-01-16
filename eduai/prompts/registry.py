"""Prompt template registry and utilities.

This module provides a registry of available prompt templates and functions
to retrieve and apply them.
"""

from typing import Callable, Dict, Tuple, List

from . import templates


# Registry mapping template names to functions
TEMPLATE_REGISTRY: Dict[str, Callable] = {
    "study_guide": templates.study_guide,
    "concept_explainer": templates.concept_explainer,
    "practice_problems": templates.practice_problems,
}


def get_template(template_name: str) -> Callable:
    """Get a template function by name.
    
    Args:
        template_name (str): The name of the template to retrieve.
        
    Returns:
        Callable: The template function.
        
    Raises:
        ValueError: If the template name is not found in the registry.
    """
    if template_name not in TEMPLATE_REGISTRY:
        available = ", ".join(TEMPLATE_REGISTRY.keys())
        raise ValueError(
            f"Unknown template '{template_name}'. "
            f"Available templates: {available}"
        )
    return TEMPLATE_REGISTRY[template_name]


def get_available_templates() -> List[str]:
    """Get a list of all available template names.
    
    Returns:
        List[str]: List of template names.
    """
    return list(TEMPLATE_REGISTRY.keys())


def apply_template(
    template_name: str,
    context: str,
    topic: str,
    level: str,
    course: str,
) -> Tuple[str, str]:
    """Apply a template with the given parameters.
    
    Args:
        template_name (str): Name of the template to use.
        context (str): Learning materials and reference content.
        topic (str): The topic for the content.
        level (str): Student level.
        course (str): Course name.
        
    Returns:
        Tuple[str, str]: (system_prompt, user_prompt)
        
    Raises:
        ValueError: If the template name is invalid.
    """
    template_func = get_template(template_name)
    return template_func(context, topic, level, course)

"""Prompt templates for educational content generation.

This module contains template functions that return system and user prompts
for different types of educational content.
"""

from typing import Tuple


def study_guide(context: str, topic: str, level: str, course: str) -> Tuple[str, str]:
    """Generate prompts for creating a comprehensive study guide.
    
    Args:
        context (str): Learning materials and reference content.
        topic (str): The subject or topic for the study guide.
        level (str): Student level (e.g., beginner, intermediate, advanced).
        course (str): Course or subject name.
        
    Returns:
        Tuple[str, str]: (system_prompt, user_prompt)
    """
    system_prompt = (
        "You are an expert educator creating comprehensive study materials. "
        "Your goal is to help students understand and master the subject matter. "
        "Create well-structured, clear, and engaging study guides with practical examples."
    )
    
    user_prompt = f"""Based on the following learning materials:

{context}

Create a comprehensive study guide for the topic: **{topic}**

Course: {course}
Student Level: {level}

The study guide should include:

## Key Concepts
- Core ideas and principles
- Important terminology with clear definitions

## Detailed Explanations
- Step-by-step breakdowns of complex ideas
- Real-world examples and applications

## Important Points to Remember
- Critical facts and rules
- Common pitfalls to avoid

## Practice Scenarios
- Situations where this knowledge applies
- How to approach problems in this area

## Summary
- Concise recap of main points
- Connections between concepts

Format the output in clean, readable Markdown with appropriate headings, bullet points, and emphasis."""
    
    return system_prompt, user_prompt


def concept_explainer(context: str, topic: str, level: str, course: str) -> Tuple[str, str]:
    """Generate prompts for explaining a concept step-by-step.
    
    Args:
        context (str): Learning materials and reference content.
        topic (str): The concept to explain.
        level (str): Student level (e.g., beginner, intermediate, advanced).
        course (str): Course or subject name.
        
    Returns:
        Tuple[str, str]: (system_prompt, user_prompt)
    """
    system_prompt = (
        "You are a patient and skilled teacher explaining complex topics. "
        "Your explanations are clear, use analogies, and build understanding step-by-step. "
        "You anticipate student confusion and address common misconceptions."
    )
    
    user_prompt = f"""Using the following reference materials:

{context}

Explain the concept: **{topic}**

Course: {course}
Student Level: {level}

Your explanation should include:

## What Is It?
- Clear, simple definition
- Put it in plain language for {level} students

## Why Does It Matter?
- Practical importance and applications
- When and where it's used

## How Does It Work?
- Step-by-step breakdown
- Use analogies or metaphors to clarify

## Real-World Examples
- Concrete examples students can relate to
- Show it in action

## Common Misconceptions
- What students often get wrong
- How to think about it correctly

## Connection to Other Concepts
- How this relates to what students already know
- Building blocks for future learning

Use clear Markdown formatting with headers, bold text for key terms, and bullet points for clarity."""
    
    return system_prompt, user_prompt


def practice_problems(context: str, topic: str, level: str, course: str) -> Tuple[str, str]:
    """Generate prompts for creating practice problems and exercises.
    
    Args:
        context (str): Learning materials and reference content.
        topic (str): The topic for which to create practice problems.
        level (str): Student level (e.g., beginner, intermediate, advanced).
        course (str): Course or subject name.
        
    Returns:
        Tuple[str, str]: (system_prompt, user_prompt)
    """
    system_prompt = (
        "You are an educational content creator specializing in practice problems and exercises. "
        "Your problems are appropriate for the student's level, progressively challenging, "
        "and include detailed solutions that teach problem-solving strategies."
    )
    
    user_prompt = f"""Based on these learning materials:

{context}

Create practice problems for: **{topic}**

Course: {course}
Student Level: {level}

Generate a set of practice exercises that include:

## Warm-Up Problems
- 2-3 simple problems to build confidence
- Focus on basic application of concepts

## Standard Practice
- 3-4 medium-difficulty problems
- Typical scenarios students will encounter

## Challenge Problems
- 1-2 advanced problems for {level} level
- Require deeper thinking or multiple steps

For EACH problem, provide:

### Problem Statement
- Clear question or task
- All necessary information

### Hints (Optional)
- Gentle guidance without giving away the answer
- Help students think through the approach

### Solution
- Step-by-step solution process
- Explanation of why each step is taken
- Final answer clearly marked

### Key Takeaway
- What this problem teaches
- Common mistakes to avoid

Format everything in clean Markdown with clear section headers and numbered problems."""
    
    return system_prompt, user_prompt

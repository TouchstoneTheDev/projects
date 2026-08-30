# Python Basics

## Variables and Data Types

Variables are containers for storing data values. Python is dynamically typed, 
meaning you don't need to declare variable types explicitly.

### Common Data Types:
- **int**: Integer numbers (e.g., 42, -10)
- **float**: Decimal numbers (e.g., 3.14, -2.5)
- **str**: Text strings (e.g., "Hello", 'World')
- **bool**: True or False
- **list**: Ordered collections (e.g., [1, 2, 3])
- **dict**: Key-value pairs (e.g., {"name": "John", "age": 30})

## Lists and List Comprehensions

### Traditional List Creation
```python
squares = []
for i in range(1, 6):
    squares.append(i ** 2)
# Result: [1, 4, 9, 16, 25]
```

### List Comprehension
```python
squares = [i ** 2 for i in range(1, 6)]
# Result: [1, 4, 9, 16, 25]
```

List comprehensions are more concise and often faster than using loops.

## Functions

Functions are reusable blocks of code:

```python
def greet(name):
    """Greet someone by name."""
    return f"Hello, {name}!"

# Usage
message = greet("Alice")
print(message)
```

Key points:
- Define with `def` keyword
- Include docstrings for documentation
- Can return values or None

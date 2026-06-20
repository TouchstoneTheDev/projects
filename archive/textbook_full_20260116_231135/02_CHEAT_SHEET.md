# IIT JAM Mathematics - Comprehensive Cheat Sheet

**Level:** Graduate

---

### IIT JAM Mathematics Cheat Sheet

---

## Table of Contents

1. **Real Analysis**
2. **Multivariable Calculus and Differential Equations**
3. **Linear Algebra and Algebra**
4. **General Exam Tips**
5. **Resource List**

Each section is organized by the cheat sheet components specified: definitions, formulas, theorems, techniques, and more.

---

## Section 1: Real Analysis

### Key Formulas

- **Limit Definition**: \(\lim_{{x \to a}} f(x) = L \) iff \(\forall \epsilon > 0, \exists \delta>0\) such that \(0 < |x-a| < \delta \Rightarrow |f(x)-L|<\epsilon\)
- **Cauchy Sequence**: A sequence \(\{a_n\}\) is Cauchy if \(\forall \epsilon > 0, \exists N \in \mathbb{N}\) such that \(|a_m - a_n| < \epsilon\) for all \(m, n > N\).

### Theorems & Principles

- **Bolzano-Weierstrass Theorem**: Every bounded sequence has a convergent subsequence.
  - **Proof Sketch**: Show any bounded sequence has a supremum and an infimum and utilizing these, construct a convergent subsequence.
  
- **Rolle’s Theorem**: If \(f(a) = f(b)\), then \(\exists c \in (a, b)\) such that \(f'(c) = 0\).

- **Mean Value Theorem**: \(\exists c \in (a, b)\) such that \(f'(c) = \frac{f(b)-f(a)}{b-a}\).

### Definitions

- **Convergence of Series**: A series \(\sum_{n=1}^{\infty} a_n\) converges to \(L\) if \(\lim_{n \to \infty} S_n = L\), where \(S_n\) is the \(n^{th}\) partial sum.
  
### Quick Reference

- **Taylor’s Theorem**: \(f(x) = \sum_{{n=0}}^{\infty} \frac{f^n(a)}{n!}(x-a)^n\)
- **Absolute Convergence Implies Convergence**: If \(\sum |a_n|\) converges, then \(\sum a_n\) converges.

### Standard Techniques

- **L'Hôpital's Rule**: Used when limits present \(\frac{0}{0}\) or \(\frac{\infty}{\infty}\) by differentiating the numerator and denominator until limit is solvable.
  
### Mnemonics & Memory Aids

- **"LIPET" for Integration by Parts**: Logarithmic, Inverse trigonometric, Polynomial, Exponential, Trigonometric.

### Common Mistakes

- **Misapplying L'Hôpital’s Rule**: Ensure form is \(\frac{0}{0}\) or \(\frac{\infty}{\infty}\) and derivatives are correctly calculated.

---

## Section 2: Multivariable Calculus and Differential Equations

### Key Formulas

- **Partial Derivatives**: \( \frac{\partial z}{\partial x}, \frac{\partial z}{\partial y}\) for \(z = f(x,y)\).
- **Double Integral Over Rectangle**: \(\int_a^b \int_c^d f(x,y) \,dy\,dx\)

### Theorems & Principles

- **Green's Theorem**: Connects the line integral around a simple curve with a double integral over the plane region it encloses.

### Definitions

- **Exact Differential Equations**: \(M(x, y) \, dx + N(x, y) \, dy = 0\) is exact if \(\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}\).

### Standard Techniques

- **Method of Separation of Variables**: Split \( \frac{dy}{dx} = g(y)h(x) \) into \(\frac{dy}{g(y)} = h(x)dx\).

### Quick Derivations

- **Cauchy-Euler Equation**: Substitution \(x = e^t\) turns it into linear with constant coefficients.

---

## Section 3: Linear Algebra and Algebra

### Key Formulas

- **Cramer's Rule**: \(x_i = \frac{\det(A_i)}{\det(A)}\) where \(A_i\) is \(A\) with the \(i^{th}\) column replaced by the results vector.

### Theorems & Principles

- **Rank-Nullity Theorem**: \(\text{rank}(A) + \text{nullity}(A) = n\) for an \(m \times n\) matrix.
  
### Definitions

- **Eigenvalue/Eigenvector**: \(A\mathbf{v} = \lambda \mathbf{v}\) where \(\mathbf{v}\) is nonzero.

### Standard Techniques

- **Row Reduction to Echelon Form**: Used to find rank, solve linear systems, and compute inverses.
  
### Mnemonics & Memory Aids

- **"PEMDAS" for Order of Operations**: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction.

### Problem-Solving Strategies

- **Flowchart for Solving Systems**:
  1. Check for consistency (augmented vs. coefficient matrix rank).
  2. Use Gaussian elimination.
  3. Back substitution for solutions.

---

## General Exam Tips

- **Time Management**: Allocate time per question based on total marks.
- **Double Check Calculations**: Especially for sign errors in algebraic manipulations.
- **Notes on Formula Sheets**: Familiarize with layout to quickly locate key formulas.
- **Relaxation Techniques**: Practice controlled breathing to manage anxiety.

---

## Resource List

- **Books**: 
  - "Principles of Mathematical Analysis" by Walter Rudin
  - "Linear Algebra Done Right" by Sheldon Axler
- **Online Resources**:
  - MIT OpenCourseWare for lectures
  - Paul's Online Math Notes for calculus and DEs

---

This cheat sheet provides key insights, advanced tips, and mnemonic devices to help you succeed in the IIT JAM Mathematics exam. For deeper understanding, complement this guide with the suggested resources and tailored practice problems. Good luck!
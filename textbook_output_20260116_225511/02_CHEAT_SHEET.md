# IIT JAM Mathematics - Comprehensive Cheat Sheet

**Level:** Graduate
**Generated:** 2026-01-16 22:55:45

---

Creating a comprehensive cheat sheet for the IIT JAM Mathematics exam is a great way to consolidate all key concepts necessary for success. Here's an organized draft that covers various essential elements as per your requirements:

---

**IIT JAM Mathematics Cheat Sheet**

---

### Section 1: Real Analysis

**Core Formulas & Theorems**

- **Convergence of Sequences:**
  - **Convergent Sequence**: A sequence \((a_n)\) converges to \(L\) if \(\forall \epsilon > 0, \exists N: n > N \Rightarrow |a_n - L| < \epsilon\).
  - **Cauchy Sequence**: \((a_n)\) is Cauchy if \(\forall \epsilon > 0, \exists N: m, n > N \Rightarrow |a_m - a_n| < \epsilon\).

- **Bolzano-Weierstrass Theorem**: Every bounded sequence in \(\mathbb{R}\) has a convergent subsequence.

- **Tests of Convergence for Series**:
  - **Comparison Test**: If \(0 \leq a_n \leq b_n\) and \(\sum b_n\) converges, then \(\sum a_n\) converges.
  - **Ratio Test**: \(\lim_{n\to\infty} \left|\frac{a_{n+1}}{a_n}\right| = L\); if \(L < 1\), \(\sum a_n\) converges absolutely.
  - **Root Test**: \(\lim_{n\to\infty} \sqrt[n]{|a_n|} = L\); if \(L < 1\), \(\sum a_n\) converges absolutely.

**Key Definitions**

- **Power Series**: \(\sum_{n=0}^{\infty} c_n (x-a)^n\) with radius of convergence \(R\). 

**Quick Reference**

- **Riemann Integration**: If \(f\) is continuous on \([a, b]\), then \(\int_a^b f(x) \, dx\) represents the area under \(f\).

**Common Techniques**

- **L'Hospital's Rule**: If \(\lim_{x \to c}\frac{f(x)}{g(x)} = \frac{0}{0}\) or \(\frac{\pm \infty}{\pm \infty}\), \(\lim_{x \to c}\frac{f(x)}{g(x)} = \lim_{x \to c}\frac{f'(x)}{g'(x)}\).

**Memory Aids**

- **D.A.B.C. for Tests of Convergence**: D'Alembert (Ratio), Balcony (Comparison), Cesàro (Root).

**Critical Concepts**

- **Intermediate Value Theorem**: If \(f\) is continuous on \([a, b]\) and \(N\) is between \(f(a)\) and \(f(b)\), there exists \(c \in (a, b)\) such that \(f(c) = N\).

---

### Section 2: Multivariable Calculus and Differential Equations

**Core Formulas & Theorems**

- **Partial Derivatives**: \(f_x = \frac{\partial f}{\partial x}, f_y = \frac{\partial f}{\partial y}\).

- **Double Integrals**: \(\iint_R f(x, y) \, dA\) represents volume under surface over region \(R\).

- **Exact Differential Equations**: \(\frac{dy}{dx} = -\frac{M_y}{N_y}\); if exact, \(M_x = N_y\).

**Quick Reference**

- **Maxima and Minima for Functions of Two Variables:**
  - **Critical Point**: Where \(\frac{\partial f}{\partial x} = \frac{\partial f}{\partial y} = 0\).
  - **Second Derivative Test**: \(D = f_{xx}f_{yy} - (f_{xy})^2\).

**Problem-Solving Flowchart**

1. **Identify Type**: Sequence, Series, Power Series?
2. **Determine Convergence**: Use appropriate test (Comparison, Ratio, Root).
3. **Function Analysis**: Check continuity, differentiability.
4. **Apply Theorems**: MVT, Taylor.

---

### Section 3: Linear Algebra and Algebra

**Core Formulas & Theorems**

- **Rank-Nullity Theorem**: \( \mathrm{rank}(A) + \mathrm{nullity}(A) = n \) for an \(n \times m\) matrix \(A\).

- **Eigenvalues & Eigenvectors**: \(Av = \lambda v\), solve \(|A - \lambda I| = 0\).

**Key Definitions**

- **Groups**: A group \((G, \cdot)\) is a set with a binary operation satisfying closure, associativity, identity, and invertibility.

**Quick Derivations**

- **Diagonalization**: \(A = PDP^{-1}\) for diagonal \(D\).

**Common Mistakes**

- Confusing linearly dependent and independent sets. 
- Ignoring non-zero determinant condition for inverses.

**Memory Aids**

- **ROWS for Eigenvectors**: Real Ordered Work first Scalar later.

---

### Units & Notation

- **Standard Notation**: 
  - \( \mathbb{R}^n \) for \(n\)-dimensional Euclidean space.
  - \( I_n \) for the \(n \times n\) identity matrix.

**Common Mistakes**

- Misinterpreting limits properties.
- Mixing differentiation and integration rules.

---

### Summary

This IIT JAM Mathematics cheat sheet provides a quick reference guide to essential topics and formulas that are central to success in the exam. Use mnemonics to recall difficult sections and systematically tackle each area for maximum effectiveness.

---

This cheat sheet is designed to be dense yet scannable, and it should be supplemented with detailed studies and practice problems to ensure mastery of the content.
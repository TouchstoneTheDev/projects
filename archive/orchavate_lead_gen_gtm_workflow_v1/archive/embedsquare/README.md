# EmbedKit_[YourName]

**Author:** [Your Full Name]  
**Assignment:** Embed Square Solutions — Embedded Developer Fresher Assessment

---

## Modules

| File | Description |
|------|-------------|
| `ringbuf.c` | Circular (ring) buffer for `uint8_t` data with fixed 8-byte capacity, demonstrating safe ISR-friendly FIFO semantics. |

---

## Build Instructions

```bash
gcc -Wall -std=c99 ringbuf.c -o ringbuf
./ringbuf
```

Compiles cleanly with **zero warnings and zero errors** under C99.

---

## Design Notes

- Uses `uint8_t` from `<stdint.h>` throughout — no raw `int` or `char` for data.
- All constants defined with `#define` — no magic numbers in logic.
- **Bonus implemented:** Head/tail wrap-around uses `& (BUFFER_SIZE - 1)` instead of `% BUFFER_SIZE` for single-cycle wrapping on MCUs without a hardware divider. See comments in `ringbuf.c` for full explanation.

/*
 * ringbuf.c -- Embed Kit: Circular Buffer Module
 *
 * A fixed-capacity ring buffer for uint8_t data.
 * Capacity: BUFFER_SIZE bytes (must be a power of 2 for the bitwise wrap trick).
 *
 * Bonus: Head/tail wrap-around uses (& (BUFFER_SIZE - 1)) instead of (% BUFFER_SIZE).
 *   WHY FASTER: On MCUs without a hardware divider (e.g., Cortex-M0, AVR),
 *   the % operator compiles to a software division routine that can take
 *   20-100+ clock cycles. A bitwise AND takes exactly 1 cycle.
 *   WHY POWER-OF-2 ONLY: Binary representation of (BUFFER_SIZE - 1) is all 1s
 *   in the lower bits, so AND masks the index to [0, BUFFER_SIZE-1] correctly.
 *   e.g., BUFFER_SIZE=8 -> mask=0b00000111. Index 8 & 7 = 0. Wraps perfectly.
 *   This does NOT work for non-power-of-2 sizes.
 */

#include <stdio.h>
#include <stdint.h>
#include <string.h>

/* ── Configuration ─────────────────────────────────────────────────── */

#define BUFFER_SIZE     8u          /* Must be a power of 2 */
#define BUFFER_MASK     (BUFFER_SIZE - 1u)

/* ── Return codes ──────────────────────────────────────────────────── */

#define RB_OK           0
#define RB_ERR_FULL    -1
#define RB_ERR_EMPTY   -2

/* ── Data structure ────────────────────────────────────────────────── */

typedef struct {
    uint8_t  data[BUFFER_SIZE];
    uint8_t  head;   /* Next write position */
    uint8_t  tail;   /* Next read position  */
    uint8_t  count;  /* Number of bytes currently stored */
} RingBuffer;

/* ── API ───────────────────────────────────────────────────────────── */

/*
 * rb_init -- Initialise buffer to empty state.
 */
void rb_init(RingBuffer *rb)
{
    rb->head  = 0u;
    rb->tail  = 0u;
    rb->count = 0u;
    memset(rb->data, 0u, sizeof(rb->data));
}

/*
 * rb_is_full -- Returns 1 if buffer is full, 0 otherwise.
 */
uint8_t rb_is_full(const RingBuffer *rb)
{
    return (rb->count == BUFFER_SIZE) ? 1u : 0u;
}

/*
 * rb_is_empty -- Returns 1 if buffer is empty, 0 otherwise.
 */
uint8_t rb_is_empty(const RingBuffer *rb)
{
    return (rb->count == 0u) ? 1u : 0u;
}

/*
 * rb_count -- Returns number of bytes currently in the buffer.
 */
uint8_t rb_count(const RingBuffer *rb)
{
    return rb->count;
}

/*
 * rb_write -- Write one byte into the buffer.
 * Returns RB_OK on success, RB_ERR_FULL if buffer is full.
 * Never overwrites unread data.
 */
int rb_write(RingBuffer *rb, uint8_t byte)
{
    if (rb_is_full(rb)) {
        return RB_ERR_FULL;
    }

    rb->data[rb->head] = byte;
    rb->head = (uint8_t)((rb->head + 1u) & BUFFER_MASK); /* Bonus: bitwise wrap */
    rb->count++;

    return RB_OK;
}

/*
 * rb_read -- Read one byte from the buffer into *out.
 * Returns RB_OK on success, RB_ERR_EMPTY if buffer is empty.
 * Never returns garbage data.
 */
int rb_read(RingBuffer *rb, uint8_t *out)
{
    if (rb_is_empty(rb)) {
        return RB_ERR_EMPTY;
    }

    *out = rb->data[rb->tail];
    rb->tail = (uint8_t)((rb->tail + 1u) & BUFFER_MASK); /* Bonus: bitwise wrap */
    rb->count--;

    return RB_OK;
}

/* ── Demo ──────────────────────────────────────────────────────────── */

int main(void)
{
    RingBuffer rb;
    rb_init(&rb);

    uint8_t byte;
    int     result;

    printf("=== Embed Kit: Ring Buffer Demo ===\n\n");

    /* Step 1: Write 8 bytes 0x41 .. 0x48 */
    uint8_t initial_data[] = {0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48};

    for (uint8_t i = 0u; i < BUFFER_SIZE; i++) {
        result = rb_write(&rb, initial_data[i]);
        if (result == RB_OK) {
            printf("[WRITE] 0x%02X -> OK (count=%u)%s\n",
                   initial_data[i],
                   rb_count(&rb),
                   rb_is_full(&rb) ? " FULL" : "");
        }
    }

    /* Step 2: Attempt overflow write */
    result = rb_write(&rb, 0x99u);
    if (result == RB_ERR_FULL) {
        printf("[WRITE] 0x99 -> FAIL (buffer full)\n");
    }

    printf("\n");

    /* Step 3: Read 3 bytes */
    for (uint8_t i = 0u; i < 3u; i++) {
        result = rb_read(&rb, &byte);
        if (result == RB_OK) {
            printf("[READ]  -> 0x%02X (count=%u)\n", byte, rb_count(&rb));
        }
    }
    printf("        Count confirmed: %u\n\n", rb_count(&rb));

    /* Step 4: Write 3 new bytes into freed slots */
    uint8_t new_data[] = {0x49, 0x4A, 0x4B};
    for (uint8_t i = 0u; i < 3u; i++) {
        result = rb_write(&rb, new_data[i]);
        if (result == RB_OK) {
            printf("[WRITE] 0x%02X -> OK (count=%u)%s\n",
                   new_data[i],
                   rb_count(&rb),
                   rb_is_full(&rb) ? " FULL" : "");
        }
    }
    printf("        Count confirmed: %u\n\n", rb_count(&rb));

    /* Step 5: Read all remaining 8 bytes */
    while (!rb_is_empty(&rb)) {
        result = rb_read(&rb, &byte);
        if (result == RB_OK) {
            printf("[READ]  -> 0x%02X (count=%u)%s\n",
                   byte,
                   rb_count(&rb),
                   rb_is_empty(&rb) ? " EMPTY" : "");
        }
    }

    /* Step 6: Attempt underflow read */
    result = rb_read(&rb, &byte);
    if (result == RB_ERR_EMPTY) {
        printf("[READ]  (empty) -> FAIL (buffer empty)\n");
    }

    printf("\n=== Demo complete ===\n");
    return 0;
}

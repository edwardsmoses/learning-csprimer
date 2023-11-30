#include <stdio.h>
#include <pthread.h>
#include <stdatomic.h>

#define EACH_COUNT 100000000

atomic_int counter = 0;

void* thread_entry(void *arg) {
    for (int i = 0; i < EACH_COUNT; i++) {
        atomic_fetch_add_explicit(&counter, 1, memory_order_relaxed);
    }
    return NULL;
}

int main () {
    pthread_t p1, p2;

    pthread_create(&p1, NULL, thread_entry, NULL);
    pthread_create(&p2, NULL, thread_entry, NULL);

    pthread_join(p1, NULL);
    pthread_join(p2, NULL);

    printf("Final count: %d (expected %d)\n", atomic_load(&counter), 2 * EACH_COUNT);

    return 0;
}

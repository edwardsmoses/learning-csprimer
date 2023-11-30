#include <stdio.h>
#include <pthread.h>

#define EACH_COUNT 100000000

int counter = 0;
pthread_mutex_t lock;

void* thread_entry(void *arg) {
        pthread_mutex_lock(&lock); // Lock the mutex before accessing counter
    for (int i = 0; i < EACH_COUNT; i++) {
        counter++;
    }
        pthread_mutex_unlock(&lock); // Unlock the mutex after accessing counter
    return NULL;
}

int main () {
    pthread_t p1, p2;
    pthread_mutex_init(&lock, NULL); // Initialize the mutex

    pthread_create(&p1, NULL, thread_entry, NULL);
    pthread_create(&p2, NULL, thread_entry, NULL);

    pthread_join(p1, NULL);
    pthread_join(p2, NULL);

    printf("Final count: %d (expected %d)\n", counter, 2 * EACH_COUNT);

    pthread_mutex_destroy(&lock); // Destroy the mutex

    return 0;
}

#include <stdlib.h>
#include <stdint.h>
#include <sys/time.h>
#include <unistd.h>
#include <stdio.h>

#define SLEEP_SEC 3
#define NUM_MULS 100000000
#define NUM_MALLOCS 100000
#define MALLOC_SIZE 1000

#define TOTAL_USEC(tv) (tv).tv_sec * 100000 + (tv).tv_usec

// TODO define this struct
struct profile_times
{
  int process_id;
  uint64_t real_usec;
};

// TODO populate the given struct with starting information
void profile_start(struct profile_times *t)
{
  t->process_id = getpid();

  struct timeval tv;
  gettimeofday(&tv, NULL);
  t->real_usec = TOTAL_USEC(tv);
}

// TODO given starting information, compute and log differences to now
void profile_log(struct profile_times *t)
{

  struct timeval tv;
  gettimeofday(&tv, NULL);

  uint64_t real_diff = TOTAL_USEC(tv) - t->real_usec;

  printf("[pid %i] \t", t->process_id);
  printf("real %0.03f \n", real_diff / 1000000.0);
}

int main(int argc, char *argv[])
{
  struct profile_times t;

  // TODO profile doing a bunch of floating point muls
  float x = 1.0;
  profile_start(&t);
  for (int i = 0; i < NUM_MULS; i++)
    x *= 1.1;
  profile_log(&t);

  // TODO profile doing a bunch of mallocs
  profile_start(&t);
  void *p;
  for (int i = 0; i < NUM_MALLOCS; i++)
    p = malloc(MALLOC_SIZE);
  profile_log(&t);

  // TODO profile sleeping
  profile_start(&t);
  sleep(SLEEP_SEC);
  profile_log(&t);
}

#include <stdlib.h>
#include <stdint.h>
#include <sys/time.h>
#include <sys/resource.h>
#include <sys/processor.h>
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
  int cpu_id
  uint64_t real_usec;
  uint64_t user_usec;
  uint64_t system_usec;
};

// TODO populate the given struct with starting information
void profile_start(struct profile_times *t)
{
  t->process_id = getpid();
  t->cpu_id = getcpuid();

  struct timeval tv;
  struct rusage ru;

  gettimeofday(&tv, NULL);
  getrusage(RUSAGE_SELF, &ru);

  t->real_usec = TOTAL_USEC(tv);

  t->user_usec = TOTAL_USEC(ru.ru_utime);
  t->system_usec = TOTAL_USEC(ru.ru_stime);

}

// TODO given starting information, compute and log differences to now
void profile_log(struct profile_times *t)
{

  struct timeval tv;
  struct rusage ru;

  gettimeofday(&tv, NULL);
  getrusage(RUSAGE_SELF, &ru);


  uint64_t real_diff = TOTAL_USEC(tv) - t->real_usec;

  uint64_t usec_diff = TOTAL_USEC(ru.ru_utime) - t->user_usec;
  uint64_t sys_diff = TOTAL_USEC(ru.ru_stime) - t->system_usec;



  printf("[pid %i] \t", t->process_id);
  printf("[cpu_id %i] \t", t->cpu_id);

  printf("real %0.03f \t", real_diff / 1000000.0);
  printf("user %0.03f \t", usec_diff / 1000000.0);
  printf("system %0.03f \t \n", sys_diff / 1000000.0);

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

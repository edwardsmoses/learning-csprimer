#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

bool ispangram(char *s)
{
  __uint32_t bs = 0;
  char c;

  while (*s != '\n')
  {
    c = tolower(*s++);
    if (c < 'a' || c > 'z')
      continue;

    bs |= 1 << (c - 'a');
  }

  return bs == 0x03ffffff;
}

int main()
{
  size_t len;
  ssize_t read;
  char *line = NULL;
  while ((read = getline(&line, &len, stdin)) != -1)
  {
    if (ispangram(line))
      printf("%s", line);
  }

  if (ferror(stdin))
    fprintf(stderr, "Error reading from stdin");

  free(line);
  fprintf(stderr, "ok\n");
}

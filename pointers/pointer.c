#include <stdio.h>

int main(int argc)
{
    int n = 5;
    int *p = &n;

    int foo = *p;

    printf("n = %d, &n = %p, :foo, %d\n", n, p, foo);
}
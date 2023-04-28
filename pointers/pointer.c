#include <stdio.h>

int main(int argc)
{
    int n = 5;
    int *p = &n;

    printf("n = %d, &n = %p\n", n, p);
}
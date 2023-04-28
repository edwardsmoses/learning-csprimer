#include <stdio.h>

int main(int argc)
{
    int n = 5;
    int *p = &n;

    int foo = *p;

    int arr[10];

    printf("array memory address %p\n", arr);

    printf("n = %d, &n = %p, :foo, %d\n", n, p, foo);
}
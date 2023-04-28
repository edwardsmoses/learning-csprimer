#include <stdio.h>

int main(int argc)
{
    int n = 5;
    int *p = &n;

    int foo = *p;

    int arr[10];

    arr[3] = 42;

    printf("array memory address %p, arr + 1 = %p\n", arr, arr + 1);
    printf("looking up 3rd index of the array using the memory address: %p, %d\n", arr + 3, *(arr + 3));

    printf("n = %d, &n = %p, :foo, %d\n", n, p, foo);
}
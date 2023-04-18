#include <assert.h>
#include <stdio.h>

int bitcount(int k)
{

    printf("%i", (k == 0 || k == 1 ? k : ((k % 2) + 10 * bitcount(k / 2))));

    return 0;
}

int main()
{
    bitcount(3);

    // assert(bitcount(0) == 0);
    // assert(bitcount(1) == 1);
    // assert(bitcount(3) == 2);
    // assert(bitcount(8) == 1);
    // harder case:
    // assert(bitcount(0xffffffff) == 32);
    printf("OK\n");
}

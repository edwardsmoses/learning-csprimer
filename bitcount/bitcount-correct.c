#include <assert.h>
#include <stdio.h>
#include <nmmintrin.h>

int bitcount(unsigned int val)
{
    return __builtin_popcount(val);
}

int main()
{

    assert(bitcount(0) == 0);
    assert(bitcount(1) == 1);
    assert(bitcount(3) == 2);
    assert(bitcount(8) == 1);
    // harder case:
    assert(bitcount(0xffffffff) == 32);

    printf("OK\n");
}

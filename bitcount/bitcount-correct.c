#include <assert.h>
#include <stdio.h>
#include <string.h>

int bitcount(unsigned int val)
{
    int count = 0;

    while (val)
    {
        count += val & 0x01;
        val >>= 1;
    }

    return count;
}

int bitcountfast(unsigned int val)
{
    int count = 0;

    while (val)
    {
        val = val & (val - 1);
        count++;
    }

    return count;
}

int main()
{

    assert(bitcount(0) == 0);
    assert(bitcount(1) == 1);
    assert(bitcount(3) == 2);
    assert(bitcount(8) == 1);
    // harder case:
    assert(bitcount(0xffffffff) == 32);

    assert(bitcountfast(0) == 0);
    assert(bitcountfast(1) == 1);
    assert(bitcountfast(3) == 2);
    assert(bitcountfast(8) == 1);
    // harder case:
    assert(bitcountfast(0xffffffff) == 32);

    printf("OK\n");
}

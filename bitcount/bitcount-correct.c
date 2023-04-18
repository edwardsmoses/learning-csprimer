#include <assert.h>
#include <stdio.h>
#include <string.h>

int bitcount(int val)
{
    int count = 0;

    while (val)
    {
        if (val & 0x01)
        {
            count += 1;
        }
        val >>= 1;
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
    // assert(bitcount(0xffffffff) == 32);
    printf("OK\n");
}

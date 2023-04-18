#include <assert.h>
#include <stdio.h>
#include <string.h>

// first convert the decimal to its' binary version
long long convert(int n)
{
    long long bin = 0;
    int rem, i = 1;

    while (n != 0)
    {
        rem = n % 2;
        n /= 2;
        bin += rem * i;
        i *= 10;
    }

    return bin;
}

int bitcount(int val)
{

    // converted to binary
    long bin = convert(val);

    // convert the binary to string
    char data[128];
    int count = 0;

    sprintf(data, "%ld", bin);
    int length = strlen(data);
    for (int i = 0; i < length; i++)
    {
        // and when it's in string format, check if it's a 1, and count if so.
        if (data[i] == '1')
        {
            count = count + 1;
        }
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

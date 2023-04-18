#include <assert.h>
#include <stdio.h>
#include <string.h>

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

    long bin = convert(val);

    char data[128];
    int count = 0;

    sprintf(data, "%ld", bin);
    int length = strlen(data);
    for (int i = 0; i < length; i++)
    {
        printf("b%c", data[i]);
        if (data[i] == '1')
        {
            count = count + 1;
        }
    }

    printf("a%i,c%i", count, val);
    printf("\n");

    return count;
}

int main()
{

    bitcount(0);
    bitcount(1);
    bitcount(3);
    bitcount(8);

    assert(bitcount(0) == 0);
    assert(bitcount(1) == 1);
    assert(bitcount(3) == 2);
    assert(bitcount(8) == 1);
    // harder case:
    // assert(bitcount(0xffffffff) == 32);
    printf("OK\n");
}

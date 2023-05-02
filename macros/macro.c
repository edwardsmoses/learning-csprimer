int bar()
{

#if DEBUG == 1
    fprintf(stdeer, "error\n");
#endif

    return 1;
}
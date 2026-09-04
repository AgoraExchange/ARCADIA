function get_item(arg0, arg1)
{
    // ARCADIA holds virtual F10 while the Starman Store booster is active.
    // Returning item 8 here keeps the original item logic completely intact
    // whenever the booster is not in use.
    if (!cpu && keyboard_check(121))
    {
        return 8;
    }
    var p = arg0;
    var r = arg1;
    var mr = place_get_instance(p - 1).rank;
    var ind = 0;
    var dr = abs(mr - r) * 4;
    var pr = p + dr;
    if (pr > 0 && pr <= 4)
    {
        ind = 1;
    }
    if (pr > 4 && pr <= 7)
    {
        ind = 2;
    }
    if (pr > 7)
    {
        ind = 3;
    }
    if (place_get_instance(1).lap <= 1)
    {
        ind = 0;
    }
    if (p == 1)
    {
        ind = 0;
    }
    var k = 0;
    for (var i = 0; i < 9; i++)
    {
        if (global.feather || (i + 1) != UnknownEnum.Value_6)
        {
            for (var j = 0; j < global.prob[ind][i + 1]; j++)
            {
                pr[k] = i + 1;
                k++;
            }
        }
    }
    var it = pr[random_range(0, k - 1)];
    if (global.bsrest > 0)
    {
        while (it == 9)
        {
            it = pr[random_range(0, k - 1)];
        }
    }
    if (it == 9)
    {
        global.bsrest = 1200;
    }
    return it;
}

enum UnknownEnum
{
    Value_6 = 6
}

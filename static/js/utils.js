'use strict';

anr.utils = {};

//-----------------------------------------------------------------------------
{
    let __id_counter = 0;

    anr.utils.uniqueId = () => __id_counter++;
}

package com.nitinsurana;


// Imports
///////////////

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>Base class for cheese-ontology based examples. Declares
 * common namespaces and provides some basic utilities.</p>
 */
public abstract class CheeseBase extends Base {
    /***********************************/
    /* Constants                       */
    /***********************************/

    public static final String CHEESE_SCHEMA = "http://data.kasabi.com/dataset/cheese/schema/";

    public static final String CHEESE_DATA_FILE = DATA_DIR + "cheeses-0.1.ttl";

    /***********************************/
    /* Static variables                */
    /***********************************/

    @SuppressWarnings(value = "unused")
    private static final Logger log = LoggerFactory.getLogger(CheeseBase.class);

    /***********************************/
    /* Instance variables              */
    /***********************************/

    /***********************************/
    /* Constructors                    */
    /***********************************/

    /***********************************/
    /* External signature methods      */
    /***********************************/

    /***********************************/
    /* Internal implementation methods */
    /***********************************/

    /***********************************/
    /* Inner class definitions         */
    /***********************************/

}


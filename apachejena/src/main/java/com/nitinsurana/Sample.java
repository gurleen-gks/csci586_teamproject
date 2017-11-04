package com.nitinsurana;

import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.OWL;
import org.apache.jena.vocabulary.RDFS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Sample extends Base {
    /***********************************/
    /* Constants                       */
    /***********************************/

    public static final String SOURCE = "./src/main/resources/data/";

    public static final String SAMPLE_NS = "http://example.com";

    /***********************************/
    /* Static variables                */
    /***********************************/

    @SuppressWarnings(value = "unused")
    private static final Logger log = LoggerFactory.getLogger(Sample.class);

    /***********************************/
    /* Instance variables              */
    /***********************************/

    /***********************************/
    /* Constructors                    */
    /***********************************/

    /***********************************/
    /* External signature methods      */
    /***********************************/

    /**
     * @param args
     */
    public static void main(String[] args) {
        new Sample().setArgs(args).run();
    }

    public void run() {
        OntModel m = getModel();
        loadData(m);
        String prefix = "prefix test: <" + SAMPLE_NS + ">\n" +
                "prefix rdfs: <" + RDFS.getURI() + ">\n" +
                "prefix owl: <" + OWL.getURI() + ">\n";


//        showQuery(m,
//                prefix +
//                        "select ?pizza where {?pizza a owl:Class ; " +
//                        "                            rdfs:subClassOf ?restriction.\n" +
//                        "                     ?restriction owl:onProperty pizza:hasTopping ;" +
//                        "                            owl:someValuesFrom pizza:PeperoniSausageTopping" +
//                        "}");


        showQuery(m,
                prefix + "select ?s ?p ?o  WHERE { ?s ?p ?o .}"
        );

//        showQuery(m,
//                prefix + "select ?s ?p   WHERE { ?s ?p  \"Cowboy Bebop The Movie\" .}"
//        );

//        showQuery(m,
//                prefix + "select ?a_title ?a_rating  WHERE { ?a_title test:a_producer ?a_rating. }"
//        );
//
//        showQuery(m,
//                prefix + "select  ?a_rating  WHERE { ?s ?p ?o}"
//        );

    }

    protected OntModel getModel() {
        return ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM);
    }

    protected void loadData(Model m) {
        FileManager.get().readModel(m, SOURCE + "sample.ttl");
    }

    protected void showQuery(Model m, String q) {
        Query query = QueryFactory.create(q);
        QueryExecution qexec = QueryExecutionFactory.create(query, m);
        try {
            ResultSet results = qexec.execSelect();
            ResultSetFormatter.out(results, m);
        } finally {
            qexec.close();
        }

    }

    /***********************************/
    /* Internal implementation methods */
    /***********************************/

    /***********************************/
    /* Inner class definitions         */
    /***********************************/

}

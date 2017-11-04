package com.nitinsurana;

import org.apache.jena.lang.csv.CSV2RDF;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;

import java.io.InputStream;

public class ImportCSV {

    public static void main(String... strings) throws Exception {
        CSV2RDF.init();
        //load through manager:
        //Model m = RDFDataMgr.loadModel("test.csv") ;
        //classic way to load:
        Model m = ModelFactory.createDefaultModel();
        InputStream is = ImportCSV.class.getClassLoader().getResourceAsStream("data.csv");
        System.out.println(is);

        m.read(is, "http://example.com", "csv");
        m.setNsPrefix("test", "http://example.com#");
        m.write(System.out, "ttl");
    }
}

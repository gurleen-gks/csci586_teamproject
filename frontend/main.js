'use strict'
const SPARQL_ENDPOINT = 'http://localhost:3030/nov15_2/query';
const QUERY_PREFIX = "prefix ns2: <http://www.semanticweb.org/gurleenk/ontologies/2017/10/raw-ontology#>";

function getSubject(str) {
    let regex = new RegExp('#(\\w+)$');
    let subject = regex.exec(str);
    if (subject) {
        subject = subject[1];
    } else {
        subject = str;
    }
    return subject;
}

$(() => {
    $("#characterTags").select2({
        width: "200px"
    });
    $("#ageRating").select2({
        width: "200px"
    });

    $("#findCharacters").click(() => {
        let resultsTable = $('.age-character-query-container table.results tbody');
        let characterTag = $("#characterTags").val();
        let ageRating = $("#ageRating").val();
        $.ajax({
            url: SPARQL_ENDPOINT,
            method: 'post',
            data: {
                query: QUERY_PREFIX + " SELECT   ?characterName  ?loveCount " +
                " WHERE { " +
                "      ?subject ns2:hasCharacter ?object. " +
                " ?object ns2:hasName ?characterName; " +
                " ns2:hasTag \"" + characterTag + "\"; " +
                " ns2:hasLoveRank ?loveCount; " +
                " ns2:hasAgeRating ns2:" + ageRating + ". " +
                "  " +
                " } ORDER BY DESC (?loveCount) " +
                " LIMIT 10"
            }
        }).then(response => {
            console.log(response);
            response.results.bindings.forEach(o => {
                let subject = getSubject(o.characterName.value);
                let object = getSubject(o.loveCount.value);
                let $tr = $("<tr>");
                let $td_one = $("<td>", {
                    html: subject
                });
                let $td_two = $("<td>", {
                    html: 'nitin'
                });
                let $td_three = $("<td>", {
                    html: object
                });
                $tr.append($td_one);
                $tr.append($td_two);
                $tr.append($td_three);
                resultsTable.append($tr);
            });
        });
    });
});
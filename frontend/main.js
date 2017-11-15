'use strict'
const SPARQL_ENDPOINT = 'http://localhost:3030/new/query';

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
        $.ajax({
            url: SPARQL_ENDPOINT,
            method: 'post',
            data: {
                query: "SELECT ?subject ?predicate ?object " +
                "      WHERE { " +
                "       ?subject ?predicate ?object " +
                "} " +
                " LIMIT 25"
            }
        }).then(response => {
            console.log(response);
            response.results.bindings.forEach(o => {
                let subject = getSubject(o.subject.value);
                let object = getSubject(o.object.value);
                let $tr = $("<tr>");
                let $td_one = $("<td>", {
                    html: 'nitin'
                });
                let $td_two = $("<td>", {
                    html: 'nitin'
                });
                let $td_three = $("<td>", {
                    html: 'nitin'
                });
                $tr.append($td_one);
                $tr.append($td_two);
                $tr.append($td_three);
                resultsTable.append($tr);
            });
        });
    });
});
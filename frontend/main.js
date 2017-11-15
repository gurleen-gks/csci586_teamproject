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


function pinPlacesOnMap(places, map, geocoder, titles) {
    places.forEach(function (i, index) {
        var promise = new Promise((resolve, reject) => {
            geocoder.geocode({'address': i}, function (results, status) {
                if (status === 'OK') {
                    resolve(results[0].geometry.location);
                } else {
                    reject('Geocode was not successful for the following reason: ' + status);
                }
            });
        });
        promise.then(location => {
            map.setCenter(location);
            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: i
            });
            google.maps.event.addListener(marker, 'click', (function (marker) {
                return function () {
                    infowindow.setContent(titles[index]);
                    infowindow.open(map, marker);
                }
            })(marker));
        });
    });
}


$(() => {
    $("#characterTags").select2({
        width: "200px"
    });
    $("#ageRating").select2({
        width: "200px"
    });
    $("#selAnimeByLocations").select2({
        width: "200px"
    });

    $("#findAnimeByLocations").click(() => {
        var places = $("#selAnimeByLocations").val();
        $.ajax({
            url: SPARQL_ENDPOINT,
            method: 'post',
            data: {
                query: QUERY_PREFIX + " SELECT   ?characterName  ?loveCount " +
                " WHERE { " +
                "      ?subject ns2:hasCharacter ?object. " +
                " ?object ns2:hasName ?characterName; " +
                " ns2:hasTag \"" + places + "\"; " +
                " ns2:hasLoveRank ?loveCount; " +
                " ns2:hasAgeRating ns2:Location. " +
                "  " +
                " } ORDER BY DESC (?loveCount) " +
                " LIMIT 10"
            }
        }).then(response => {
            // response.results.bindings.forEach(o => {
            //     let subject = getSubject(o.subject.value);
            //     let object = getSubject(o.object.value);
                let places = ["New York", "Los Angeles", "Boston"];
                var myLatLng = {lat: -25.363, lng: 131.044};

                var map = new google.maps.Map(document.getElementById('mapLocation'), {
                    zoom: 4,
                    center: myLatLng
                });
                var geocoder = new google.maps.Geocoder();

                pinPlacesOnMap(places, map, geocoder, places);
            // });
        })
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
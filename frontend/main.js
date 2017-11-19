'use strict'
const SPARQL_ENDPOINT = 'http://localhost:3030/ds/query';
const QUERY_PREFIX = "prefix ns2: <http://www.semanticweb.org/gurleenk/ontologies/2017/10/raw-ontology#>";
const QUERY_PREFIX2 = "prefix ns1:<http://www.semanticweb.org/gurleenk/ontologies/2017/10/>";
const charImages = {
    "Kathy WHITE": "http://www.anime-planet.com/images/characters/kathy-white-128033.jpg?t=1498939238",
    "Arthur LYNCH":"http://www.anime-planet.com/images/characters/arthur-lynch-42441.jpg?t=1371719001",
    "Emelina ANDERSON":"http://www.anime-planet.com/images/characters/emelina-anderson-135829.jpg?t=1509294515",
    "Margitte":"http://www.anime-planet.com/images/characters/margitte-133415.jpg?t=1508587759",
    "Barbaros":"http://www.anime-planet.com/images/characters/barbaros-129656.jpg?t=1501344100",
    "Sakata":"http://www.anime-planet.com/images/characters/blank_char.gif",
    "Thomas":"http://www.anime-planet.com/images/characters/thomas-daphne-in-the-brilliant-blue-18217.jpg?t=1291420575",
    "Sakura":"http://www.anime-planet.com/images/characters/sakura-zokusei-48044.jpg?t=1362614815",
    "Oyakata":"http://www.anime-planet.com/images/characters/oyakata-66.jpg?t=1262949960",
    "Kotaro":"http://www.anime-planet.com/images/characters/kotaro-yowamushi-pedal-new-generation-127607.jpg?t=1498843322",
    "Kuma":"http://www.anime-planet.com/images/characters/kumata-shibatora-29054.jpg?t=1315246176"
}

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

function pingSinglePlaceOnMap(place, title, map, geocoder) {

    var promise = new Promise((resolve, reject) => {
        geocoder.geocode({'address': place}, function (results, status) {
            if (status === 'OK') {
                resolve(results[0].geometry.location);
            } else {
                reject('Geocode was not successful for the following reason: ' + status);
            }
        });
    });

    promise.then(location => {
        //After getting the latitude/longitude
        map.setCenter(location);
        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title
        });
        // google.maps.event.addListener(marker, 'click', (function (marker) {
        //     return function () {
        //
        //
        //     }
        // })(marker));
        infowindow.setContent(title);
        infowindow.open(map, marker);
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
        width: "400px"
    });

    $("#findAnimeByLocations").click(() => {
        var singlePlace = $("#selAnimeByLocations").val();
        $.ajax({
            url: SPARQL_ENDPOINT,
            method: 'post',
            data: {
                query: QUERY_PREFIX + " SELECT (AVG(?rating) AS ?animePlanetOverAllRating) ?animename ?location " +
                " WHERE{ " +
                " ?anime  ns2:hasName ?animename; " +
                "         ns2:hasReview ?animereview. " +
                " ?animereview ns2:hasOverallRating ?rating. " +
                " { " +
                " SELECT  DISTINCT ?location ?username ?animename " +
                "   WHERE { " +
                "   ?anime ns2:hasReview ?review; " +
                "          ns2:hasName   ?animename. " +
                "   ?review ns2:hasUser ?user. " +
                "   ?user ns2:hasLocation \"" + singlePlace + "\"; " +
                "           ns2:hasLocation  ?location; " +
                "           ns2:hasName      ?username. " +
                " } " +
                " } " +
                " } " +
                " GROUP BY ?animename ?location " +
                " ORDER BY DESC (?animePlanetOverAllRating)" +
                " LIMIT 1"
            }
        }).then(response => {
            response.results.bindings.forEach(o => {
                //     let subject = getSubject(o.subject.value);
                //     let object = getSubject(o.object.value);
                // let places = ["New York", "Los Angeles", "Boston"];
                var myLatLng = {lat: -25.363, lng: 131.044};

                var map = new google.maps.Map(document.getElementById('mapLocation'), {
                    zoom: 4,
                    center: myLatLng
                });
                var geocoder = new google.maps.Geocoder();

                // pinPlacesOnMap([singlePlace], map, geocoder, places);
                var title = o.animename.value + "    " + parseFloat(o.animePlanetOverAllRating.value).toFixed(2);
                pingSinglePlaceOnMap(singlePlace, title, map, geocoder);
            });
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
                query: QUERY_PREFIX + " SELECT DISTINCT  ?name ?loverank " +
                " WHERE { " +
                "      ?subject ns2:hasCharacter ?charactername; " +
                "               ns2:hasAgeRating ns2:"+ ageRating + ". "+
                "      ?charactername ns2:hasName ?name; " +
                "                     ns2:hasTag \"" + characterTag + "\"; " +
                "                     ns2:hasLoveRank ?loverank; " +
                " } ORDER BY DESC (?loverank) " +
                " LIMIT 5"
            }
        }).then(response => {
            resultsTable.empty()
            response.results.bindings.forEach(o => {
                let subject = getSubject(o.name.value);
                let object = getSubject(o.loverank.value);
                let imageUrl = charImages[subject];
                let $tr = $("<tr>");
                let $td_one = $("<td>", {
                    html: subject
                });
                let $td_two = $("<td>", {
                    html: "<img src='" + imageUrl + "' />"
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

    $("#findTop5").click(() => {
        let resultsTable = $('.staff-query-container table.results tbody');
        $.ajax({
            url: SPARQL_ENDPOINT,
            method: 'post',
            data: {
                query: QUERY_PREFIX + " SELECT  (AVG (?score) AS ?animeScore) ?producerName " +
                " WHERE { " +
                "      ?subject ns2:hasProducer ?object; " +
                "               ns2:hasScore ?score."+
                "                                   "+
                "       ?object ns2:hasName ?producerName ." +
                " } " +
                " GROUP BY(?producerName)"+
                "ORDER BY DESC(?animeScore) " +
                " LIMIT 5"
            }
        }).then(response => {
            resultsTable.empty()
            response.results.bindings.forEach(o => {
                let subject = getSubject(o.producerName.value);
                let object = getSubject(o.animeScore.value);
                let $tr = $("<tr>");
                let $td_one = $("<td>", {
                    html: subject
                });
                let $td_two = $("<td>", {
                    html: object
                });
                $tr.append($td_one);
                $tr.append($td_two);
                resultsTable.append($tr);
            });
        });
    });
    $("#findMostPopular").click(() => {
        let resultsTable = $('.broadcast-time-query-container table.results tbody');
        let broadcastDay = $("#broadcastDay").val();
        let broadcastTime = $("#broadcastTime").val();
        $.ajax({
            url: SPARQL_ENDPOINT,
            method: 'post',
            data: {
                query: QUERY_PREFIX + " SELECT  ?animename ?score ?broadcastday ?broadcasttime " +
                " WHERE { " +
                "      ?subject ns2:hasName ?animename;"+
                "               ns2:hasBroadcastTime \"" + broadcastTime + "\"; " +
                "               ns2:hasBroadcastTime ?broadcasttime;"+
                "               ns2:hasBroadcastDay \"" + broadcastDay + "\"; " +
                "               ns2:hasBroadcastDay ?broadcastday;"+
                "               ns2:hasScore ?score."+
                " FILTER NOT EXISTS {?subject  ns2:hasBroadcasttime \"unknown\"}  "+
                "}"+
                "ORDER BY DESC(?score) " +
                " LIMIT 5"
            }
        }).then(response => {
            resultsTable.empty()
            response.results.bindings.forEach(o => {
                let subject = getSubject(o.animename.value);
                let object = getSubject(o.score.value);
                let $tr = $("<tr>");
                let $td_one = $("<td>", {
                    html: subject
                });
                let $td_two = $("<td>", {
                    html: object
                });
                $tr.append($td_one);
                $tr.append($td_two);
                resultsTable.append($tr);
            });
        });
    });
    $("#findDeviation").click(() => {
        let resultsTable = $('.deviation-query-container table.results tbody');
        $.ajax({
            url: SPARQL_ENDPOINT,
            method: 'post',
            data: {
                query: QUERY_PREFIX +
                       QUERY_PREFIX2+
                " SELECT ?myAnimeScore (AVG(?rating) AS ?animePlanetOverAllRating) ((?myAnimeScore - ?animePlanetOverAllRating) AS ?deviation) ?name " +
                " WHERE { " +
                "      ?subject ns2:hasReview ?review;"+
                "               ns2:hasName ?name;" +
                "               ns2:hasScore ?myAnimeScore. " +

                "      ?review ns2:hasOverallRating ?rating.  "+
                "}"+
                "GROUP BY ?myAnimeScore ?name " +
                " ORDER BY DESC(?deviation)"+
                " LIMIT 5"
            }
        }).then(response => {
            resultsTable.empty()
            response.results.bindings.forEach(o => {
                let subject = getSubject(o.name.value);
                let object = getSubject(o.myAnimeScore.value);
                let object1 = getSubject(o.animePlanetOverAllRating.value);
                let object2 = getSubject(o.deviation.value);
                let $tr = $("<tr>");
                let $td_one = $("<td>", {
                    html: subject
                });
                let $td_two = $("<td>", {
                    html: object
                });
                let $td_three = $("<td>", {
                    html: object1
                });
                let $td_four = $("<td>", {
                    html: object2
                });
                $tr.append($td_one);
                $tr.append($td_two);
                $tr.append($td_three);
                $tr.append($td_four);
                resultsTable.append($tr);
            });
        });
    });
});
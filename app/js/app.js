var app = (function () {

    function loadInitForecast() {
        fetch('forecast.json')
            .then(validateResponse)
            .then(responseToJson)
            .then(compose)
            .catch(logError);
    }

    // core
    function compose(response) {
        console.log("need to compose", response);

        // city region
        $("#city-region").html(
            '<h1>' + response.location.name + ' <small>' + response.location.region + '</small></h1> <span>' + response.location.country + '</span>'
        );

        // current
        $("#current").html(
            '<h2>Current <small>' + response.current.condition.text + '</small></h2>' +
            '<span class=>' + moment(response.current.last_updated).format('dddd, DD MMM YYYY | hh:mm') + '</span> '
        );

        $("#current-icon").attr('src', response.current.condition.icon);
        $("#current-feels-like").html(
            '<p>' + response.current.temp_f + ' &deg;F or ' + response.current.temp_c + ' &deg;C</p>'
        );
        $("#current-wind").html(
            '<p>' + response.current.wind_mph + ' mph or ' + response.current.wind_kph + ' kph' + '</p>' +
            '<p>' + response.current.wind_degree + ' &deg;</p>' +
            '<p> Direction ' + response.current.wind_dir + '</p>'
        );
        $("#current-pressure").html(
            '<p>' + response.current.pressure_mb + ' mb or ' + response.current.pressure_in + ' in</p>'
        );

        $("#current-precip").html(
            '<p>' + response.current.precip_mm + ' mm or ' + response.current.precip_in + ' in</p>'
        );
        $("#current-humidity").html(
            '<p>' + response.current.humidity + ' %</p>'
        );
        $('#current-cloud').html(
            '<p>' + response.current.cloud + ' %</p>'
        );
        $('#current-visibility').html(
            '<p>' + response.current.vis_km + ' km or ' + response.current.vis_miles + ' miles</p>'
        );

        // current
        $.each(response.forecast.forecastday, function (i, o) {
            console.log(o);
            $("#today").html(
                '<h2>Today <small>' + o.day.condition.text + '</small></h2>' +
                '<span class=>' + moment(o.date).format('dddd, DD MMM YYYY') + '</span> <br />' +
                '<div class="row">' +
                '<div class="col-xs-3 text-center"><strong>Sunrise</strong><br />'+o.astro.sunrise+'</div>' +
                '<div class="col-xs-3 text-center"><strong>Sunset</strong><br />'+o.astro.sunset+'</div>' +
                '<div class="col-xs-3 text-center"><strong>Moonrise</strong><br />'+o.astro.moonrise+'</div>' +
                '<div class="col-xs-3 text-center"><strong>Moonset</strong><br />'+o.astro.moonset+'</div>' +
                '</div>'
            );

            $("#hours").html(
              '<div class="media">' +
              '</div>'
            );

        });


    }

    // utils
    function responseToJson(response) {
        return response.json();
    }

    function validateResponse(response) {
        if (response.ok) return response;
        throw response.getText();
    }

    function logError(err) {
        console.error(err);
    }

    function init() {
        loadInitForecast();
    }

    return {
        init: (init)
    };

})();

$(document).ready(function () {
    app.init();
});
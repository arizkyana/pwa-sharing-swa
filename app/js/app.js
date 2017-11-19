var url = 'http://api.apixu.com/v1/forecast.json?key=aa0411a6859c485780c04248170801&q=';
var app = (function () {

    function loadInitForecast(city) {
        if (!city) city = 'Bandung';

        showLoading();
        resetHours();
        fetch(url + city)
            .then(validateResponse)
            .then(responseToJson)
            .then(compose)
            .catch(logError);
    }

    // core
    function compose(response) {

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

            $("#today").html(
                '<h2>Today <small>' + o.day.condition.text + '</small></h2>' +
                '<span class=>' + moment(o.date).format('dddd, DD MMM YYYY') + '</span> <br />' +
                '<div class="row">' +
                '<div class="col-xs-3 text-center"><strong>Sunrise</strong><br />' + o.astro.sunrise + '</div>' +
                '<div class="col-xs-3 text-center"><strong>Sunset</strong><br />' + o.astro.sunset + '</div>' +
                '<div class="col-xs-3 text-center"><strong>Moonrise</strong><br />' + o.astro.moonrise + '</div>' +
                '<div class="col-xs-3 text-center"><strong>Moonset</strong><br />' + o.astro.moonset + '</div>' +
                '</div>'
            );


            $.each(o.hour, function (idx, hour) {
                $('#hours').append(
                    '<div class="media">' +
                    '<div class="media-left">' +
                    '<a href="">' +
                    '<img data-src="' + hour.condition.icon + '" src="' + hour.condition.icon + '" alt="" />' +
                    '</a>' +
                    '</div>' +
                    '<div class="media-body">' +
                    '<span class="pull-right" style="line-height: 3"><small>' + moment(hour.time).format('HH:mm a') + '</small></span>' +
                    '<h4>' + hour.condition.text + '</h4>' +
                    '<p> Chance of rain : ' + hour.chance_of_rain + ' %</p>' +
                    '</div>' +
                    '</div>'
                );
            });

        });

        hideLoading();


    }

    // utils
    function responseToJson(response) {
        return response.json();
    }

    function validateResponse(response) {
        if (response.ok) return response;
        throw response.getText();
    }

    function resetHours(){
        $("#hours").empty();
    }

    function logError(err) {
        console.error(err);
    }

    function init() {
        hideLoading();
        loadInitForecast();

    }

    // Public Functions
    function changeCity(){
        var city = $(this).val();
        loadInitForecast(city);
    }

    function showLoading(){
        $("#loading").show();
    }

    function hideLoading(){
        $("#loading").hide();
    }


    return {
        init: (init),
        changeCity: changeCity
    };

})();

$(document).ready(function () {

    app.init();

    $("#city").change(app.changeCity);
});
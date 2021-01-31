$(".searchBtn").on("click", function (event) {
    event.preventDefault();
    $(".weather-text").empty();
    $("#forecast").empty();
    $("#uvBtn").remove()

    var city = $(".search").val();
    console.log(city);

    var queryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=2d325a02be6346b80e081d792e1e2cb4"

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (result) {
        console.log(result);
        // City Name and Date
        var currentDate = moment().format('L');
        var cityName = $(".city-name").text(result.city.name + " (" + currentDate + ")");

        // Icon
        var weatherIcon = $(".wicon");
        var iconCode = result.list[0].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png"
        console.log(iconUrl);
        weatherIcon.attr("src", iconUrl);
        $(".card-body").append(weatherIcon);

        // Temperature
        var temperature = $("<p class='weather-text'>").text("Temperature: " + result.list[0].main.temp + "°F");
        $(".card-body").append(temperature);

        // Humidity
        var humidity = $("<p class='weather-text'>").text("Humidity: " + result.list[0].main.humidity + "%");
        $(".card-body").append(humidity);

        // Wind Speed
        var windSpeed = $("<p class='weather-text'>").text("Wind Speed: " + result.list[0].wind.speed + " MPH");
        $(".card-body").append(windSpeed);

        // UV Index
        var lat = result.city.coord.lat;
        var lon = result.city.coord.lon;
        var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=2d325a02be6346b80e081d792e1e2cb4";
        console.log(uvUrl);

        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function (response) {
            var uvIndex = $("<button class='btn bg-warning weather-text' id='uvBtn'>").text("UV Index: " + response.value);
            $(".card-body").append(uvIndex);

        });

        // Five-Day Forecast

        var list = result.list;
        console.log(list);

        for (var i = 0; i < list.length; i += 8) {



            var forecast = $("<div class='card bg-primary text-white' style='width: 10rem; margin: 8px'>");

            var foreDate = $("<p class='card-title'>").text(result.list[i].dt_txt.slice(0, 10));
            forecast.append(foreDate);



            var foreTemp = $("<p class='card-text'>").text("Temperature: " + result.list[i].main.temp + "°F");
            forecast.append(foreTemp);

            var cardIcons = result.list[i].weather[0].icon;
            var foreIcon = $("<img>");
            var foreIconUrl = "http://openweathermap.org/img/w/" + cardIcons + ".png";
            foreIcon.attr("src", foreIconUrl);
            foreIcon.attr("style", "height: 40px; width: 40px");
            forecast.append(foreIcon);

            var foreHumid = $("<p class='card-text'>").text("Humidity: " + result.list[i].main.humidity + "%")
            forecast.append(foreHumid);

            $("#forecast").append(forecast);
        };
        // Recent Searches
        var cityVal = city.trim();
        var searchArr = [];
        searchArr.push(cityVal);
        console.log(searchArr);
        localStorage.setItem('city', JSON.stringify(searchArr));

        recentSearch();
    })
    function recentSearch() {
        var searchHistory = JSON.parse(localStorage.getItem("city"));
        var recentBtn = $("<button type='submit' class='btn btn-outline-primary recent-button' style='width: 12rem'>").text(searchHistory);
        var historyDiv = $("<div>");
        historyDiv.append(recentBtn);
        $(".recent-search").prepend(recentBtn);
    }
    $(".recent-button").on('click', function (e) {
        e.preventDefault();
        console.log($(this).text());
        city = $(this).text();
        console.log(city);
    })
}) 
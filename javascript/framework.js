var today = new Date();
var cityFormEl = document.querySelector("#city-form");
var cityNameInputEl = document.querySelector("cityname");
var currentWeatherEl = document.querySelector('#current-weather');
var currentWeatherCardEl = document.querySelector("#current-weather-card")
var fiveDayCardEl = document.querySelector("#five-day-card");
var fiveDayEl = document.querySelector("#five-day-body");
var weatherStatusEl = document.querySelector('#weather-status');
var searchEl = document.querySelector('#search');
var historyButtonsEl = document.querySelector("#history-buttons")
var historyCardEl = document.querySelector("#history")
var trashEl = document.querySelector("#trash")
var searchHistoryArray = []


var formSubmitHandler = function (event) {
    event.preventDefault ();
    // city name coming from the input element 
    var cityname = cityNameInputEl.ariaValueMax.trim();

    // city name goes in local storage to make history buttons
    if (cityname) {
        searchHistoryArray.push(cityname); 
        localStorage.setItem("weatherSearch", JSON.stringify(searchHistoryArrary));
        var searchHistoryEl = document.createElement('button');
        searchHistoryEl.className = "btn";
        searchHistoryEl.setAttribute("data-city", cityname)
        searchHistoryEl.innerHTML = cityname;
        historyButtonsEl.appendChild(searchHistoryEl);
        historyCardEl.removeAttribute("style")
        getWeatherInfo(cityname);
        cityNameInputEl.value = "";
    }
    else {
        alert("enter a city name");
    }
}

// getting the weather information

var getWeatherInfo = function (cityname) {
    var apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=7c4a4befbfd432587f686fcf4848cf16"
    fetch(
        // use city name to find longitute and latitude 
        apiCityUrl
    )
        .then(function (cityResponse) {
            return cityResponse.json();
        })
        .then(functiom (cityResponse) ,{
            // variables for longitute and latitude of the city 
            console.log(cityResponse)
            var latitude = cityResponse.coord.lat;
            var longitude = cityResponse.coord. lon;

            // making variables for the cities name date and information for the header
            var city = cityResponse.name;
            var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
            var weatherIcon = cityResponse.weather[0].icon; 
            var weatherDescription = cityResponse.weather[0].description;
            
            // clear element to make room for new data
            currentWeatherEl.textContent = "";
            fiveDayEl.textContent =  "";

            // fixes the h2 element for the city and date
            weatherStatusEl.innerHTML = city + " (" + date + ") " + weatherIconLink; 

           // shows weather card
            currentWeatherCardEl.classList.remove("hidden");
            fiveDayCardEl.classlist.remove("hidden");

            // return a fetch request using latitude and longitude  form previous fetching
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=7c4a4befbfd432587f686fcf4848cf16');   
        }) 
        .then(function (response) {
            // gives it in JSON format
            return response.json(); 
        })
        .then(function(response) {
            console.log(response);
            // gives final display
            displayWeather(response);
        });
};

// shows the weather on the page 
var displayWeather = function (weather) {
    // to see if the Api gives data 
    if (weather.length === 0 ) {
        weatherContainerEl.textContent = "No weather data found.";
        return;
    }
    // to show the temperature 
    var temperature = document.createElement('p');
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    currentWeatherEl.appendChild(temperature);

    // to show the hummidity 
    var humidity = document.createElement('p');
    humidity.id = "humidity";
    humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.wind_speed.toFixed(1) + "MPH";
    currentWeatherEl.appendChild(windSpeed);

    // to show the UV 
    var uvIndex = document.createElement('p');
    var uvIndexValue = weather.current.uvi.toFixed(1);
    uvIndex.id = "uv-index"; 
    if (uvIndexValue >= 0) {
        uvIndex.className = "uv-index-green"
    }
    if (uvIndexValue >= 3){
        uvIndex.className = "uv-index-yellow"
    }
    if (uvIndexValue >=8) {
        uvIndex.className = "uv-index-red"
    }
    uvIndex.innerHTML = "<strong> UV Index:</strong> <span>" + uvIndexValue + "</span>";
    currentWeatherEl.appendChild(uvIndex); 

    //extended forcast information
    var forecastArray = weather.daily;

    // day "cards" for the extended forecast 
    for (let i = 0; i < forecastArray.length - 3; i++) {
        var date = (today.getMonth() + 1) + '/' + (today.getDate () + i + 1) + '/' + today.getFullYear();
        var weatherIcon = forecastArray[i].weather[0].icon;
        var weatherDescription = forecastArray[i].weather[0].description;
        var weatherIconLink = "<img src=assets/images/openweather.png" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title ='" + weatherDescription + "' />"
        var dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.innerHTML = "<p><strong>" + date + "</strong></p>" + 
            "<p>" + weatherIconLink + "</p>" +
            "<p><strong>Temp:</strong> " + forcastArray[i].temp.day.toFixed(1) + "°F</p>" + 
            "<p><strong>Humidity:</strong> " + forcastArry[i].humidity + "%</p>"

            fiveDayEl.appendChild(dayEl);
    }

}

// past weather searches by city 
var loadHistory = function () {
    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

    if (searchArray) {
        searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
        for (let i = 0; i < searchArray.length; i++) {
            var searchHistoryEl = document.createElement('button');
            searchHistoryEl.className = "btn";
            searchHistoryEl.setAttribute("data-city", searchArray[i])
            searchHistoryEl.innerHTML = searchArray[i];
            historyButtonsEl.appendChild(searchHistoryEl);
            historyCardEl.removeAttribute("style");
        }
    }
}

// using search history buttons search the weather 
var buttonClickHandler = function (event) {
    var cityname = event.target.getAttribute("data-city");
    if (cityname) {
        getWeatherInfo(cityname);

    }
}

// to clear the search history
var clearHistory = function (event) {
    localStorage.removeItem("weatherSearch");
    historyCardEl.setAttribute("style", "display: none");
}

cityFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler); 
trashEl.addEventListener("click", clearHistory);


loadHistory();
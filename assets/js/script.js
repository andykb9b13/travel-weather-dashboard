// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// Gt/Wd&f6A_P8g)4
// andyk47

// API key: a3b196b189c8e6852bde36ecc0a1be43

// 5-day/3-hour forecast call
// "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=a3b196b189c8e6852bde36ecc0a1be43"

// Direct Geocoding
// "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}"

// Latitude and Longitude
// "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}"

let citySearchButton = document.getElementById("city-search-button");
let citySearchArea = document.getElementById("city-search-area");
let citySearchInput = document.getElementById("city-search-input");
let cityDisplay = document.getElementById("city-display");
let tempDisplay = document.getElementById("temp-display");
let windDisplay = document.getElementById("wind-display");
let humidityDisplay = document.getElementById("humidity-display");
let day1 = document.getElementById("day-1");
let day2 = document.getElementById("day-2");
let day3 = document.getElementById("day-3");
let day4 = document.getElementById("day-4");
let day5 = document.getElementById("day-5");
let forecastDays = document.querySelectorAll(".forecast-day")

function getCityByName() {
    let newCityName = citySearchInput.value
    let requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + newCityName + ",US&limit=1&appid=a3b196b189c8e6852bde36ecc0a1be43"

    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            let newCityButton = document.createElement('button');
            newCityButton.innerText = data[0].name;
            newCityButton.addEventListener("click", getCityWeather)
            newCityButton.addEventListener("click", getFiveDayForecast)
            citySearchArea.appendChild(newCityButton);

            let cityLatitude = data[0].lat;
            let cityLongitude = data[0].lon;

            function getCityWeather() {
                console.log("I'm the city search", data)
                cityDisplay.innerText = data[0].name + ", " + data[0].state;
                let requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLatitude + "&lon=" + cityLongitude + "&units=imperial&appid=a3b196b189c8e6852bde36ecc0a1be43";
                fetch(requestUrl)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (data) {
                        console.log("I'm the weather search", data)
                        tempDisplay.innerText = "Temp: " + data.main.temp + "°";
                        windDisplay.innerText = "Wind: " + data.wind.speed + "mph";
                        humidityDisplay.innerText = "Humidity: " + data.main.humidity + "%";
                    })

            }
            function getFiveDayForecast() {
                let requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLatitude + "&lon=" + cityLongitude + "&units=imperial&appid=a3b196b189c8e6852bde36ecc0a1be43";
                fetch(requestUrl)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (data) {
                        console.log("I'm the 5 day forcast search", data);
                        let fiveDayArray = []
                        for (let i = 0; i < data.list.length; i += 8) {
                            fiveDayArray.push(data.list[i])
                        }
                        console.log(fiveDayArray)
                        for (let i = 0; i < forecastDays.length; i++) {
                            forecastDays[i].children[0].innerText = "Date: " + fiveDayArray[i].dt_txt;
                            forecastDays[i].children[1].innerText = "Temp: " + fiveDayArray[i].main.temp + "°";
                            forecastDays[i].children[2].innerText = "Wind: " + fiveDayArray[i].wind.speed + "mph";
                            forecastDays[i].children[3].innerText = "Humidity: " + fiveDayArray[i].main.humidity + "%";
                        }
                    })
            } getCityWeather()
            getFiveDayForecast()
        })

}
citySearchButton.addEventListener("click", getCityByName);

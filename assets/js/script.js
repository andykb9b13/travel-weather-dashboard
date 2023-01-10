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
let cityArea = document.getElementById("city-area");
let tempDisplay = document.getElementById("temp-display");
let windDisplay = document.getElementById("wind-display");
let humidityDisplay = document.getElementById("humidity-display");
let forecastDays = document.querySelectorAll(".forecast-day");
let cityStorage = [];

function reformatDate(date) {
    let newDate = date;
    let year = newDate.slice(0, 4);
    let month = newDate.slice(5, 7);
    let day = newDate.slice(8, 10);
    return month + "/" + day + "/" + year;
}

// TODO set local storage for city search buttons :(

function getCityByName() {

    let newCityName = citySearchInput.value;
    let requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + newCityName + ",US&limit=1&appid=a3b196b189c8e6852bde36ecc0a1be43"

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("I'm getCityByName", data);
            let newCityButton = document.createElement('button');
            newCityButton.innerText = data[0].name;



            newCityButton.addEventListener("click", getCityWeather);
            newCityButton.addEventListener("click", getFiveDayForecast);
            citySearchArea.appendChild(newCityButton);

            let cityLatitude = data[0].lat;
            let cityLongitude = data[0].lon;

            function getCityWeather() {
                console.log("I'm the city search", data)
                console.log("im the city name", data[0].name)
                cityStorage.push(data[0].name);
                localStorage.setItem("cityNames", JSON.stringify(cityStorage));
                let requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLatitude + "&lon=" + cityLongitude + "&units=imperial&appid=a3b196b189c8e6852bde36ecc0a1be43";
                fetch(requestUrl)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (data) {
                        console.log("I'm the weather search", data)
                        tempDisplay.innerText = "Temp: " + Math.floor(data.main.temp) + "°";
                        windDisplay.innerText = "Wind: " + Math.floor(data.wind.speed) + " mph";
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
                            fiveDayArray.push(data.list[i]);
                        }
                        cityDisplay.innerText = data.city.name + " " + reformatDate(fiveDayArray[0].dt_txt);
                        cityArea.children[1].children[0].setAttribute("src", "http://openweathermap.org/img/w/" + fiveDayArray[0].weather[0].icon + ".png")
                        console.log(fiveDayArray);
                        for (let i = 0; i < forecastDays.length; i++) {
                            forecastDays[i].children[0].innerText = "Date: " + reformatDate(fiveDayArray[i].dt_txt);
                            forecastDays[i].children[1].children[0].setAttribute("src", "http://openweathermap.org/img/w/" + fiveDayArray[i].weather[0].icon + ".png")
                            forecastDays[i].children[2].innerText = "Temp: " + Math.floor(fiveDayArray[i].main.temp) + "°";
                            forecastDays[i].children[3].innerText = "Wind: " + Math.floor(fiveDayArray[i].wind.speed) + " mph";
                            forecastDays[i].children[4].innerText = "Humidity: " + fiveDayArray[i].main.humidity + "%";
                        }
                    })
            } getCityWeather();
            getFiveDayForecast();
        })
    // cityStorage = JSON.parse(localStorage.getItem("cityNames"));
}
citySearchButton.addEventListener("click", getCityByName);

// function setCityStorage() {
//     cityNameStorage = JSON.parse(localStorage.getItem("cityNames"));
//     cityNameStorage.push(newCityButton.innerText);
//     localStorage.setItem("cityNames", JSON.stringify(cityNameStorage));
// }




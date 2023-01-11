/* ********************* API Information ****************************** */
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// API key: a3b196b189c8e6852bde36ecc0a1be43

// 5-day/3-hour forecast call
// "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=a3b196b189c8e6852bde36ecc0a1be43"

// Direct Geocoding
// "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}"

// Latitude and Longitude
// "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}"
// *************************************************************************

let citySearchButton = document.getElementById("city-search-button");
let citySearchArea = document.getElementById("city-search-area");
let citySearchInput = document.getElementById("city-search-input");
let citySearchList = document.getElementById("citySearchList");
let cityDisplay = document.getElementById("city-display");
let cityArea = document.getElementById("city-area");
let tempDisplay = document.getElementById("temp-display");
let windDisplay = document.getElementById("wind-display");
let humidityDisplay = document.getElementById("humidity-display");
let forecastDays = document.querySelectorAll(".forecast-day");
let cityStorage = [];
let coordinates = {
    name: "",
    latitude: "",
    longitude: ""
}

// Default display is for Durham, NC current conditions
function defaultDisplay() {
    let requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + "Durham" + ",US&limit=1&appid=a3b196b189c8e6852bde36ecc0a1be43"
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let CityName = data[0].name;
            let cityLatitude = data[0].lat;
            let cityLongitude = data[0].lon;
            coordinates = {
                name: CityName,
                latitude: cityLatitude,
                longitude: cityLongitude
            }
            getCityWeather(coordinates.latitude, coordinates.longitude);
            getFiveDayForecast(coordinates.latitude, coordinates.longitude);
        })
}

defaultDisplay()

// reformatDate() reformats the standard javascript date structure of YYYY-MM-DD to MM/DD/YYYY
function reformatDate(date) {
    let newDate = date;
    let year = newDate.slice(0, 4);
    let month = newDate.slice(5, 7);
    let day = newDate.slice(8, 10);
    return month + "/" + day + "/" + year;
}

// recallButtons() calls localStorage and returns the cityButtons created in previous sessions
recallButtons()

/* This function calls the openweathermap API, gathers name, longitude, and latitude of city,
sets it to localStorage, and creates an eventListener for recalling the weather
*/
function getCityByName() {
    let newCityName = citySearchInput.value;
    let requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + newCityName + ",US&limit=1&appid=a3b196b189c8e6852bde36ecc0a1be43"
    // call the API
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("I'm getCityByName", data);
            // create a button to display for the city
            let newCityButton = document.createElement('button');
            newCityButton.innerText = data[0].name;
            citySearchArea.appendChild(newCityButton);
            // store name, latitude, and longitude
            let CityName = data[0].name;
            let cityLatitude = data[0].lat;
            let cityLongitude = data[0].lon;
            coordinates = {
                name: CityName,
                latitude: cityLatitude,
                longitude: cityLongitude
            }
            // set localStorage for searched city
            cityStorage = JSON.parse(localStorage.getItem("cityNames")) || [];
            cityStorage.push(coordinates);
            console.log("I've been added to cityStorage by the search", cityStorage)
            localStorage.setItem("cityNames", JSON.stringify(cityStorage));
            // run the main weather display and 5-day forecast functions
            getCityWeather(coordinates.latitude, coordinates.longitude);
            getFiveDayForecast(coordinates.latitude, coordinates.longitude);
            // create event listener for recalling the weather when clicked on
            newCityButton.addEventListener("click", function getRecalledWeather() {
                getCityWeather(data[0].lat, data[0].lon);
                getFiveDayForecast(data[0].lat, data[0].lon);
            })


        })
}

/* This function accepts two parameters which will be used to get the weather using latitude and
longitude coordinates from getCityByName().
*/
function getCityWeather(latitude, longitude) {
    let requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=a3b196b189c8e6852bde36ecc0a1be43";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log("I'm the weather search", data)
            // display the weather in the main display
            tempDisplay.innerText = "Temp: " + Math.floor(data.main.temp) + "°";
            windDisplay.innerText = "Wind: " + Math.floor(data.wind.speed) + " mph";
            humidityDisplay.innerText = "Humidity: " + data.main.humidity + "%";
        })

}

// This function accepts two parameters which will be used to get the 5 day forecast of the city
function getFiveDayForecast(latitude, longitude) {
    let requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=a3b196b189c8e6852bde36ecc0a1be43";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log("I'm the 5 day forcast search", data);
            let fiveDayArray = []
            /* The data is returned in 3-hour increments from the API call so each 9th index is 24 hours
            later. These indexes are pushed to the array fiveDayArray.
            */
            for (let i = 0; i < data.list.length; i += 8) {
                fiveDayArray.push(data.list[i]);
            }
            // display the city name
            cityDisplay.innerText = data.city.name + " " + reformatDate(fiveDayArray[0].dt_txt);
            // display the icon for the CURRENT weather from the first index in fiveDayArray
            cityArea.children[1].children[0].setAttribute("src", "http://openweathermap.org/img/w/" + fiveDayArray[0].weather[0].icon + ".png")
            console.log(fiveDayArray);
            // iterate over fiveDayArray to display date, icon, temp, wind, and humidity for each 24hr period
            for (let i = 0; i < forecastDays.length; i++) {
                forecastDays[i].children[0].innerText = "Date: " + reformatDate(fiveDayArray[i].dt_txt);
                forecastDays[i].children[1].children[0].setAttribute("src", "http://openweathermap.org/img/w/" + fiveDayArray[i].weather[0].icon + ".png")
                forecastDays[i].children[2].innerText = "Temp: " + Math.floor(fiveDayArray[i].main.temp) + "°";
                forecastDays[i].children[3].innerText = "Wind: " + Math.floor(fiveDayArray[i].wind.speed) + " mph";
                forecastDays[i].children[4].innerText = "Humidity: " + fiveDayArray[i].main.humidity + "%";
            }
        })
}

// This executes a search when a user inputs in the search bar
citySearchButton.addEventListener("click", getCityByName);

// This function retrieves data from local storage and creates new buttons with event listeners for recalling the weather
function recallButtons() {
    let cityStorage = JSON.parse(localStorage.getItem("cityNames")) || [];
    console.log("I'm showing the cityStorage from recallButtons()", cityStorage);
    localStorage.setItem("cityNames", JSON.stringify(cityStorage))
    // iterate over each index in cityStorage in local storage
    for (let i = 0; i < cityStorage.length; i++) {
        let recalledCityButton = document.createElement('button');
        recalledCityButton.innerText = cityStorage[i].name;
        citySearchArea.appendChild(recalledCityButton);
        // add event listeners to each button created
        recalledCityButton.addEventListener("click", function getRecalledWeather() {
            getCityWeather(cityStorage[i].latitude, cityStorage[i].longitude);
            getFiveDayForecast(cityStorage[i].latitude, cityStorage[i].longitude);
        })
    }
}


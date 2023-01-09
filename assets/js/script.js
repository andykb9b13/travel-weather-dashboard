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

// function getCitybyLatLon() {
//     let requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=33.753746&lon=-84.386330&appid=a3b196b189c8e6852bde36ecc0a1be43";

//     fetch(requestUrl)
//         .then(function (response) {
//             return response.json()
//         })
//         .then(function (data) {
//             console.log(data)
//         })
// }

// citySearchButton.addEventListener("click", getCity)
let citySearchArea = document.getElementById("city-search-area");
let citySearchInput = document.getElementById("city-search-input");
let cityDisplay = document.getElementById("city-display");

function getCityByName() {
    let newCityName = citySearchInput.value
    let requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + newCityName + ",US&limit=1&appid=a3b196b189c8e6852bde36ecc0a1be43"

    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            let newCityButton = document.createElement('button');
            newCityButton.innerText = data[0].name;
            citySearchArea.appendChild(newCityButton);
            let cityLatitude = data[0].lat;
            let cityLongitude = data[0].lon;

            function getCityWeather() {
                let requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLatitude + "&lon=" + cityLongitude + "&appid=a3b196b189c8e6852bde36ecc0a1be43";
                fetch(requestUrl)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (data) {
                        console.log(data)
                        cityDisplay.innerText = data.name;

                    })
            } getCityWeather()
        })

}
citySearchButton.addEventListener("click", getCityByName)
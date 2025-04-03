const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        try {
            const { latitude, longitude } = await getCityCoordinates(city);
            const weatherData = await getWeatherData(latitude, longitude);
            displayWeatherInfo(city, weatherData);
        } catch (error) {
            console.error(error);
            displayError(error.message);
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getCityCoordinates(city) {
    const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    const response = await fetch(geoApiUrl);
    if (!response.ok) {
        throw new Error("Could not fetch city coordinates");
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }

    return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude
    };
}

// Function to get weather data from Open-Meteo
async function getWeatherData(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(city, data) {
    const { temperature, windspeed, weathercode } = data.current_weather;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const windDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `Temperature: ${temperature}°C`;
    windDisplay.textContent = `Wind Speed: ${windspeed} km/h`;
    descDisplay.textContent = `Condition: ${getWeatherDescription(weathercode)}`;

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    windDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(windDisplay);
    card.appendChild(descDisplay);
}

function displayError(message) {
    card.textContent = "";
    card.style.display = "flex";

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Fog 🌫",
        48: "Depositing Rime Fog ❄️",
        51: "Light Drizzle 🌧",
        53: "Moderate Drizzle 🌧",
        55: "Dense Drizzle 🌧",
        61: "Light Rain 🌦",
        63: "Moderate Rain 🌧",
        65: "Heavy Rain 🌧",
        71: "Light Snow 🌨",
        73: "Moderate Snow 🌨",
        75: "Heavy Snow 🌨",
        80: "Light Rain Showers 🌦",
        81: "Moderate Rain Showers 🌧",
        82: "Heavy Rain Showers 🌧",
        95: "Thunderstorm ⛈"
    };
    return weatherCodes[code] || "Unknown Weather 🌍";
}

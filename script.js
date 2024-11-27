const apiKey = "aa49fee36fe91308accdec9f4d628f73";

// Funkcja wywołująca zapytania do API
function getWeatherData(city) {
    if (city.trim() === "") {
        alert("Wprowadź miejscowość.");
        return;
    }

    getCurrentWeather(city);
    getForecast(city);
}

// Funkcja do pobrania bieżącej pogody za pomocą XMLHttpRequest
function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
        console.log("Odpowiedź odebrana"); // To pomoże sprawdzić, czy w ogóle mamy odpowiedź
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText); // Parsowanie odpowiedzi JSON
            console.log(data); // Wyświetlenie odpowiedzi w konsoli
            displayCurrentWeather(data); // Wywołanie funkcji do wyświetlenia pogody
        } else {
            console.log("Błąd: " + xhr.status); // Jeśli status nie jest 200, wyświetl błąd
        }
    };

    xhr.onerror = function () {
        console.log("Błąd połączenia z API");
    };

    xhr.send(); // Wysyłanie zapytania
}


// Funkcja do pobrania prognozy pogody za pomocą fetch
function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Nie udało się pobrać prognozy pogody.");
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => alert(error));
}

// Funkcja do wyświetlania bieżącej pogody
function displayCurrentWeather(data) {
    const weatherDiv = document.getElementById("currentWeather");

    // Pobieranie kodu ikony z API
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Wyświetlanie informacji o pogodzie z obrazkiem w kontenerze
    weatherDiv.innerHTML = `
        <h2>Obecna pogoda dla: ${data.name}</h2>
        <div class="weather-container">
            <img src="${iconUrl}" alt="Ikona pogody">
        </div>
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Opis: ${data.weather[0].description}</p>
        <p>Wilgotność: ${data.main.humidity}%</p>
        <p>Wiatr: ${data.wind.speed} m/s</p>
    `;
}

// Funkcja do wyświetlania prognozy pogody

function displayForecast(data) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "<h2>Prognoza pogody:</h2>";
    const forecastList = data.list.filter((_, index) => index % 8 === 0); // Co 8 interwałów (24 godziny)

    forecastList.forEach(forecast => {
        const iconCode = forecast.weather[0].icon; // Kod ikony z API
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL do ikony

        forecastDiv.innerHTML += `
            <div class="forecast-item">
                <strong>${new Date(forecast.dt_txt).toLocaleDateString()}</strong> - 
                Temperatura: ${forecast.main.temp}°C, 
                Opis: ${forecast.weather[0].description}
                <br>
                <img src="${iconUrl}" alt="Ikona pogody" style="width: 50px; height: 50px;">
            </div>
        `;
    });
    // Dodaj logowanie odpowiedzi do konsoli
    console.log(data); // To wyświetli pełną odpowiedź w konsoli
}

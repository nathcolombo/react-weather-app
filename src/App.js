import React, { useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import "./App.css";
import dayStorm from "./animations/day_storm.json";
import moonClear from "./animations/moon_clear.json";
import moonCloudy from "./animations/moon_cloudy.json";
import nightSnow from "./animations/night_snow.json";
import partlyCloudy from "./animations/partly_cloudy.json";
import rainyDay from "./animations/rainy_day.json";
import rainyNight from "./animations/rainy_night.json";
import snow from "./animations/snow.json";
import stormAnimation from "./animations/storm.json";
import sunny from "./animations/sunny.json";
import thunder from "./animations/thunder.json";
import windy from "./animations/windy.json";
import sunnySnow from "./animations/sunny_snow.json";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");

  const apiKey = process.env.REACT_APP_API_KEY;

  const getWeather = async () => {
    if (!city) {
      setError(
        language === "en"
          ? "Please enter a city name."
          : "Por favor, insira o nome de uma cidade."
      );
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=${language}`
      );
      setWeather(response.data);
      setError("");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError(
          language === "en"
            ? "Connection error. Please try again later."
            : "Erro de conexão. Por favor, tente novamente mais tarde."
        );
      }
      setWeather(null);
    }
  };

  const isItNight = (sunrise, sunset, timezone) => {
    const date = new Date();
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = utcTime + timezone * 1000;
    const sunriseTime = (sunrise + timezone) * 1000;
    const sunsetTime = (sunset + timezone) * 1000;

    return localTime < sunriseTime || localTime >= sunsetTime;
  };

  const getWeatherAnimation = (code) => {
    const isNight =
      weather &&
      isItNight(weather.sys.sunrise, weather.sys.sunset, weather.timezone);

    if (code >= 200 && code < 300) return isNight ? thunder : dayStorm;
    if (code >= 300 && code < 400) return isNight ? rainyNight : rainyDay;
    if (code >= 500 && code < 600) return isNight ? rainyNight : rainyDay;
    if (code >= 600 && code < 700) return isNight ? nightSnow : snow;
    if (code >= 700 && code < 800) return windy;
    if (code === 800) return isNight ? moonClear : sunny;
    if (code === 801 || code === 802)
      return isNight ? moonCloudy : partlyCloudy;
    if (code > 802 && code <= 804) return isNight ? moonCloudy : partlyCloudy;
    if (code === 601 && !isNight) return sunnySnow;

    return stormAnimation;
  };

  const translateDescription = (description, code) => {
    const translations = {
      200: { en: "light thunderstorm", pt: "trovoada leve" },
      202: { en: "heavy thunderstorm", pt: "trovoada forte" },
      300: { en: "light drizzle", pt: "garoa leve" },
      500: { en: "light rain", pt: "chuva leve" },
      600: { en: "light snow", pt: "neve leve" },
      601: { en: "snow with sunshine", pt: "neve com sol" },
      800: { en: "clear sky", pt: "céu limpo" },
      801: { en: "few clouds", pt: "poucas nuvens" },
      802: { en: "scattered clouds", pt: "nuvens dispersas" },
      804: { en: "overcast clouds", pt: "nublado" },
    };

    return translations[code] ? translations[code][language] : description;
  };

  return (
    <div className="app">
      <h1>
        {language === "en" ? "Weather in" : "Clima em"} {city}
      </h1>

      {weather && (
        <div className="card">
          <h2>{weather.main.temp} °C</h2>
          <p>
            {translateDescription(
              weather.weather[0].description,
              weather.weather[0].id
            )}
          </p>
          <div className="lottie-container">
            <Lottie
              animationData={getWeatherAnimation(weather.weather[0].id)}
              style={{ width: 150, height: 150, margin: "0 auto" }}
            />
          </div>
        </div>
      )}

      <div className="input-container">
        <div className="weather-info">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={language === "en" ? "Enter city" : "Digite a cidade"}
          />
          <button onClick={getWeather}>
            {language === "en" ? "Get Weather" : "Obter Clima"}
          </button>
        </div>

        <div className="language-select">
          <label htmlFor="language-select">Select Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ borderRadius: "20px" }}
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default App;

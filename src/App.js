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
import sunnySnow from "./animations/sunny_snow.json";
import sunny from "./animations/sunny.json";
import thunder from "./animations/thunder.json";
import windy from "./animations/windy.json";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");

  const apiKey = process.env.REACT_APP_API_KEY;

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
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
        setError("Erro de conexão. Tente novamente mais tarde.");
      }
      setWeather(null);
    }
  };

  const getWeatherAnimation = (code) => {
    const isNight = weather && weather.weather[0].icon.includes("n");

    if (code >= 200 && code < 300) return isNight ? thunder : dayStorm;
    if (code >= 300 && code < 400) return isNight ? rainyNight : rainyDay;
    if (code >= 500 && code < 600) return isNight ? rainyNight : rainyDay;
    if (code >= 600 && code < 700) {
      if (isNight) return nightSnow;
      if (code === 600 || code === 601) return sunnySnow;
      return snow;
    }
    if (code >= 700 && code < 800) return windy;
    if (code === 800) return isNight ? moonClear : sunny;
    if (code === 801 || code === 802)
      return isNight ? moonCloudy : partlyCloudy;
    if (code > 802 && code <= 804) return partlyCloudy;

    if (code >= 200 && code <= 232) return stormAnimation;

    return sunny;
  };

  const translateDescription = (code) => {
    const translations = {
      200: "tempestade com trovões leves",
      202: "tempestade forte com trovões",
      300: "chuvisco leve",
      500: "chuva leve",
      600: "neve leve",
      800: "céu limpo",
      801: "poucas nuvens",
      802: "nuvens dispersas",
      804: "nublado",
    };

    return translations[code] || "Clima desconhecido";
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
            {language === "en"
              ? weather.weather[0].description
              : translateDescription(weather.weather[0].id)}
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

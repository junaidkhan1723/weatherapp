const apiKey = "use your weather API key hrere";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".weatherSearch input");
const searchbtn = document.querySelector(".weatherSearch button");
const weatherIcon = document.querySelector(".weatherIcon");
const errorMsg = document.getElementById("error-msg");

document.addEventListener("DOMContentLoaded", () => {
  checkWeather("Dharmabad");
});

async function checkWeather(city) {
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    document.querySelector(".weather-condition").innerHTML =
      data.weather[0].main;
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "&degc";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/hr";
    document.querySelector(".country").innerHTML = "," + data.sys.country;

    if (data.weather[0].main === "Clouds") {
      weatherIcon.src =
        "https://png.pngtree.com/png-vector/20250111/ourmid/pngtree-partly-cloudy-day-illustration-png-image_15143227.png";
    } else if (data.weather[0].main === "Clear") {
      weatherIcon.src =
        "https://static-00.iconduck.com/assets.00/weather-clear-symbolic-icon-1023x1024-en2xc1qm.png";
    } else if (data.weather[0].main === "Rain") {
      weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/6142/6142570.png";
    } else if (data.weather[0].main === "Haze") {
      weatherIcon.src =
        "https://png.pngtree.com/png-vector/20220621/ourmid/pngtree-daytime-foggy-weather-clouds-illustration-png-image_5246770.png";
    } else if (data.weather[0].main === "Mist") {
      weatherIcon.src =
        "https://png.pngtree.com/png-vector/20220621/ourmid/pngtree-daytime-foggy-weather-clouds-illustration-png-image_5246770.png";
    } else if (data.weather[0].main === "Thunderstromes") {
      weatherIcon.src =
        "https://png.pngtree.com/png-vector/20210128/ourmid/pngtree-thunderstorm-rainy-weather-png-image_2849609.jpg";
    }

    errorMsg.style.display = "none";
  } catch (error) {
    errorMsg.style.display = "block";
  }
}

searchbtn.addEventListener("click", () => {
  if (searchBox.value.trim() !== "") {
    checkWeather(searchBox.value.trim());
  }
});

searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchbtn.click();
  }
});

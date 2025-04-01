// use this to prove your app has permission to access weather data
const apiKey = "9ba61d3ff6d4a459c33c1370ad3ef177";
const searchBtn = document.getElementById("searchBtn"); // The "Get Weather" button
const cityInput = document.getElementById("cityInput"); // Input box
const weatherResult = document.getElementById("weatherResult"); // Where weather info goes

// Listen for button click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeather(city);
  }
});

// 🔍 Fetch weather data for city
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    const temp = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    // 🌆 Fetch and apply city background
    await getCityImage(city);

    // 🎨 Reset any previous weather theme class
    document.body.className = "";

    // 🌤️ Weather-based styling
    if (description.includes("cloud")) {
      document.body.classList.add("cloudy");
    } else if (description.includes("rain")) {
      document.body.classList.add("rainy");
    } else if (description.includes("clear")) {
      document.body.classList.add("sunny");
    } else if (description.includes("snow")) {
      document.body.classList.add("snowy");
    } else {
      document.body.classList.add("default-bg");
    }

    // 📋 Render the weather info
    weatherResult.innerHTML = `
      <div class="weather-card">
        <h2>${city.charAt(0).toUpperCase() + city.slice(1)}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}" class="weather-icon"/>
        <p class="temp">${temp}°C</p>
        <p class="desc">${description}</p>
        <p>Feels like: ${data.main.feels_like}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind speed: ${data.wind.speed} m/s</p>
      </div>
    `;

  } catch (error) {
    weatherResult.innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
}

// 📸 Get a city background image from Pexels
async function getCityImage(city) {
  const res = await fetch(`https://api.pexels.com/v1/search?query=${city}&per_page=1`, {
    headers: {
      Authorization: "vpZKPucHOlvwRw66N7zf2m8qgBSXWObCJrdqQKrwDWcMuLcdx2ponGRz" // Replace this with your real API key!
    }
  });

  const data = await res.json();
  const photoUrl = data.photos[0]?.src?.landscape;

  if (photoUrl) {
    document.body.style.backgroundImage = `url("${photoUrl}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
  }
}

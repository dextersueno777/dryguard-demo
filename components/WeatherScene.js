const weatherImages = {
  sun: "/images/sunny.png",
  sunny: "/images/sunny.png",
  rain: "/images/rainy.png",
  rainy: "/images/rainy.png",
  breezy: "/images/breezy.png",
  breeze: "/images/breezy.png",
  cloudy: "/images/cloudy.png",
  cloud: "/images/cloudy.png"
};

const weatherLabels = {
  sunny: "☀️ Sunny",
  breezy: "💨 Breezy",
  cloudy: "☁️ Cloudy",
  rainy: "🌧 Rainy",
};

export default function WeatherScene({ weather, isCoverDeployed }) {
  const normalizedWeather = (weather || "sunny").toLowerCase().trim();

  return (
    <div className="weather-container">
      <div
        className="weather-bg"
        style={{
          backgroundImage: `url(${weatherImages[normalizedWeather] || "/images/sunny.png"})`
        }}
      ></div>

      {/* Overlay for readability */}
      <div className="weather-bg-overlay"></div>

      {/* Clothesline */}
      <img
        src="/images/clothesline.png"
        alt="Clothes"
        className="clothes-overlay"
        style={{ zIndex: 2 }}
      />

      {/* Cover */}
      {isCoverDeployed && (
        <img
          src="/images/cover.png"
          alt="Cover"
          className="clothes-overlay"
          style={{ zIndex: 3, opacity: 0.85, transition: "opacity 0.5s" }}
        />
      )}

      {/* Weather Label */}
      <div className="weather-label">
        {weatherLabels[normalizedWeather] || "☀️ Sunny"}
      </div>
    </div>
  );
}
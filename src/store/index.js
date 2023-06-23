import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

/**
@typedef {{
  cityName: string,
  longitude: number,
  latitude: number
}} LocationData

@typedef {{
  temperature: number,
  temperatureFeelsLike: number,
  temperatureMin: number,
  temperatureMax: number,
  pressure: number,
  humidity: number,
  windSpeed: number,
  clouds: number,
}} WeatherData

@typedef {{
  name: string,
  locationData: LocationData,
  weatherData: WeatherData,
}} CityData

@typedef {{
  cities: CityData[]
}} WeatherState
*/

const apiKey = 'd819007f78204d58d9aa6480cd97279d'

/**
 * Downloads a URL, converts its response to JSON
 * @param {string} url
 * @returns {object}
 */
async function fetchJSON(url) {
  return (await fetch(url)).json();
}

/**
 * Downloads city location data
 * @param {string} cityName
 * @returns {Promise<LocationData>}
 */
async function fetchLocationData(cityName) {
  const stateCode = "";
  const countryCode = "";
  const limit = 5;

  const data = await fetchJSON(
    `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`
  );
    
  return {
    cityName: data[0].local_names.ru,
    longitude: data[0].lon,
    latitude: data[0].lat,
  };
}

/**
 * Downloads weather data for given location
 * @param {LocationData} locationData
 * @returns {Promise<WeatherData>}
 */
async function fetchWeatherData(locationData) {
  const data = await fetchJSON(
    `https://api.openweathermap.org/data/2.5/weather`
    + `?lat=${locationData.latitude}`
    + `&lon=${locationData.longitude}`
    + `&appid=${apiKey}`
  );

  return {
    temperature: data.main.temp,
    temperatureFeelsLike: data.main.feels_like,
    temperatureMin: data.main.temp_min,
    temperatureMax: data.main.temp_max,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    clouds: data.clouds.all,
  };
}

/**
 * Downloads city data for given city name
 * @param {string} name 
 * @returns {Promise<CityData>}
 */

async function fetchCityData(name) {
  const locationData = await fetchLocationData(name);
  const weatherData = await fetchWeatherData(locationData);

  return {
    locationData,
    weatherData,
  };
}

export default new Vuex.Store({
  state: {
    cities: [],
  },
  mutations: {
    addCity(state, city) {
      state.cities.push(city);
    },
    deleteCity(state, city) {
      state.cities = state.cities.filter((c) => c !== city)
    },
    replaceCities(state, newCities) {
      state.cities = newCities;
    }
  },
  actions: {
    async requestCityByName(context, name) {
      context.commit('addCity', await fetchCityData(name));
    },
    async reloadWeather(context) {
      const newData = await Promise.all(context.state.cities.map(
        city => fetchCityData(city.locationData.cityName)
      ));
      context.commit('replaceCities', newData);
    }
  },
});
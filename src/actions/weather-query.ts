import { apiConfig } from "../config.js";

async function getLatAndLong(city: string): Promise<{ lat: string, lon: string }> {
    const URL = "https://nominatim.openstreetmap.org/search";
    const response = await fetch(`${URL}?q=${city}&format=json`, {
        method: "GET",
        mode: "cors",
        headers: {
            "User-Agent": "pipe-it",
        },
    });
    const body = await response.json();
    return {
        lat: body[0].lat,
        lon: body[0].lon
    }
}

export type WeatherQueryResult = {
    temperature: number;
    weather: string;
    windSpeed: number;
    snow: number;
}

export async function getWeather(city: string): Promise<WeatherQueryResult> {
    //! Convert the city into lat & lon
    const { lat, lon } = await getLatAndLong(city);

    //! Pass lat & lon to another API
    const URL = "https://api.weatherbit.io/v2.0/current";
    const response = await fetch(`${URL}?lat=${lat}&lon=${lon}&key=${apiConfig.externalApisKeys.weatherBit}`, {
        method: "GET",
        mode: "cors"
    });
    const body = await response.json();
    return {
        temperature: body.data[0].temp,
        weather: body.data[0].weather.description,
        windSpeed: body.data[0].wind_spd,
        snow: body.data[0].snow
    }
}
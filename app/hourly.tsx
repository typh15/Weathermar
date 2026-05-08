import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';

const update_interval = 1 ; // N minutes
    type WeatherInfo = {
        summary: string;
        icon: any;
};

const TestweatherIcons = {
  clear: require(                 "../assets/images/AiryWeatherIcons/clear.png"),
};


const weatherIcons = {
    clear: require(               "../assets/images/AiryWeatherIcons/clear.png"),
    mostlyClear: require(         "../assets/images/AiryWeatherIcons/mostly-clear.png"),
    partlyCloudy: require(        "../assets/images/AiryWeatherIcons/partly-cloudy.png"),
    overcast: require(            "../assets/images/AiryWeatherIcons/overcast.png"),
    fog: require(                 "../assets/images/AiryWeatherIcons/fog.png"),
    rimeFog: require(             "../assets/images/AiryWeatherIcons/rime-fog.png"),
    lightDrizzle: require(        "../assets/images/AiryWeatherIcons/light-drizzle.png"),
    moderateDrizzle: require(     "../assets/images/AiryWeatherIcons/moderate-drizzle.png"),
    denseDrizzle: require(        "../assets/images/AiryWeatherIcons/dense-drizzle.png"),
    lightFreezingDrizzle: require("../assets/images/AiryWeatherIcons/light-freezing-drizzle.png"),
    denseFreezingDrizzle: require("../assets/images/AiryWeatherIcons/dense-freezing-drizzle.png"),
    lightRain: require(           "../assets/images/AiryWeatherIcons/light-rain.png"),
    moderateRain: require(        "../assets/images/AiryWeatherIcons/moderate-rain.png"),
    heavyRain: require(           "../assets/images/AiryWeatherIcons/heavy-rain.png"),
    lightFreezingRain: require(   "../assets/images/AiryWeatherIcons/light-freezing-rain.png"),
    heavyFreezingRain: require(   "../assets/images/AiryWeatherIcons/heavy-freezing-rain.png"),
    slightSnowfall: require(      "../assets/images/AiryWeatherIcons/slight-snowfall.png"),
    moderateSnowfall: require(    "../assets/images/AiryWeatherIcons/moderate-snowfall.png"),
    heavySnowfall: require(       "../assets/images/AiryWeatherIcons/heavy-snowfall.png"),
    thunderstorm: require(        "../assets/images/AiryWeatherIcons/thunderstorm.png"),
    thunderstormWithHail: require("../assets/images/AiryWeatherIcons/thunderstorm-with-hail.png"),
};

const WEATHER_CODE_INFO: Record<number, WeatherInfo> = {
    0: { summary: "Clear sky", icon: weatherIcons.clear },

    1: { summary: "Mostly clear", icon: weatherIcons.mostlyClear },
    2: { summary: "Partly cloudy", icon: weatherIcons.partlyCloudy },
    3: { summary: "Overcast", icon: weatherIcons.overcast },

    45: { summary: "Foggy", icon: weatherIcons.fog },
    48: { summary: "Freezing fog", icon: weatherIcons.rimeFog },

    51: { summary: "Light drizzle", icon: weatherIcons.lightDrizzle },
    53: { summary: "Drizzle", icon: weatherIcons.moderateDrizzle },
    55: { summary: "Heavy drizzle", icon: weatherIcons.denseDrizzle },

    56: { summary: "Light freezing drizzle", icon: weatherIcons.lightFreezingDrizzle },
    57: { summary: "Heavy freezing drizzle", icon: weatherIcons.denseFreezingDrizzle },

    61: { summary: "Light rain", icon: weatherIcons.lightRain },
    63: { summary: "Rain", icon: weatherIcons.moderateRain },
    65: { summary: "Heavy rain", icon: weatherIcons.heavyRain },

    66: { summary: "Light freezing rain", icon: weatherIcons.lightFreezingRain },
    67: { summary: "Heavy freezing rain", icon: weatherIcons.heavyFreezingRain },

    71: { summary: "Light snow", icon: weatherIcons.slightSnowfall },
    73: { summary: "Snow", icon: weatherIcons.moderateSnowfall },
    75: { summary: "Heavy snow", icon: weatherIcons.heavySnowfall },

    77: { summary: "Snow grains", icon: weatherIcons.slightSnowfall },

    80: { summary: "Light rain showers", icon: weatherIcons.lightRain },
    81: { summary: "Rain showers", icon: weatherIcons.moderateRain },
    82: { summary: "Heavy rain showers", icon: weatherIcons.heavyRain },

    85: { summary: "Light snow showers", icon: weatherIcons.slightSnowfall },
    86: { summary: "Heavy snow showers", icon: weatherIcons.heavySnowfall },

    95: { summary: "Thunderstorm", icon: weatherIcons.thunderstorm },
    96: { summary: "Thunderstorm with light hail", icon: weatherIcons.thunderstormWithHail },
    99: { summary: "Thunderstorm with heavy hail", icon: weatherIcons.thunderstormWithHail },
};

function getWeatherInfo(code: number): WeatherInfo {
    return (
        WEATHER_CODE_INFO[code] ?? {
        summary: "Unknown weather",
        icon: weatherIcons.partlyCloudy,
        }
    );
}
const hourly_data_default = [
    { key: 1,  day: "Tuesday", date: "4/21/2025", time: "12:00 am", temp: 68, feelslike: 67, rainchance: 10, humidity: 78 , windspeed: 5, winddirection: "NE", weathercode: 1},
    { key: 2,  day: "Tuesday", date: "4/21/2025", time: "1:00 am",  temp: 67, feelslike: 66, rainchance: 8,  humidity: 80 , windspeed: 4, winddirection: "E", weathercode: 2},
    { key: 3,  day: "Tuesday", date: "4/21/2025", time: "2:00 am",  temp: 66, feelslike: 65, rainchance: 7,  humidity: 81 , windspeed: 3, winddirection: "S", weathercode: 3},
    { key: 4,  day: "Tuesday", date: "4/21/2025", time: "3:00 am",  temp: 65, feelslike: 64, rainchance: 6,  humidity: 83 , windspeed: 2, winddirection: "SW", weathercode: 4},
    { key: 5,  day: "Tuesday", date: "4/21/2025", time: "4:00 am",  temp: 65, feelslike: 64, rainchance: 6,  humidity: 84 , windspeed: 2, winddirection: "W", weathercode: 5},
    { key: 6,  day: "Tuesday", date: "4/21/2025", time: "5:00 am",  temp: 64, feelslike: 63, rainchance: 8,  humidity: 85 , windspeed: 3, winddirection: "NW", weathercode: 6},
    { key: 7,  day: "Tuesday", date: "4/21/2025", time: "6:00 am",  temp: 65, feelslike: 64, rainchance: 10, humidity: 82 , windspeed: 4, winddirection: "N", weathercode: 7},
    { key: 8,  day: "Tuesday", date: "4/21/2025", time: "7:00 am",  temp: 67, feelslike: 66, rainchance: 12, humidity: 80 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 9,  day: "Tuesday", date: "4/21/2025", time: "8:00 am",  temp: 70, feelslike: 70, rainchance: 14, humidity: 75 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 10, day: "Tuesday", date: "4/21/2025", time: "9:00 am",  temp: 73, feelslike: 74, rainchance: 16, humidity: 70 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 11, day: "Tuesday", date: "4/21/2025", time: "10:00 am", temp: 75, feelslike: 77, rainchance: 18, humidity: 66 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 12, day: "Tuesday", date: "4/21/2025", time: "11:00 am", temp: 77, feelslike: 79, rainchance: 20, humidity: 63 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 13, day: "Tuesday", date: "4/21/2025", time: "12:00 pm", temp: 79, feelslike: 81, rainchance: 22, humidity: 60 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 14, day: "Tuesday", date: "4/21/2025", time: "1:00 pm",  temp: 80, feelslike: 82, rainchance: 24, humidity: 58 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 15, day: "Tuesday", date: "4/21/2025", time: "2:00 pm",  temp: 81, feelslike: 83, rainchance: 26, humidity: 56 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 16, day: "Tuesday", date: "4/21/2025", time: "3:00 pm",  temp: 79, feelslike: 81, rainchance: 30, humidity: 57 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 17, day: "Tuesday", date: "4/21/2025", time: "4:00 pm",  temp: 78, feelslike: 80, rainchance: 34, humidity: 60 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 18, day: "Tuesday", date: "4/21/2025", time: "5:00 pm",  temp: 76, feelslike: 77, rainchance: 38, humidity: 64 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 19, day: "Tuesday", date: "4/21/2025", time: "6:00 pm",  temp: 74, feelslike: 75, rainchance: 35, humidity: 68 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 20, day: "Tuesday", date: "4/21/2025", time: "7:00 pm",  temp: 72, feelslike: 73, rainchance: 30, humidity: 72 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 21, day: "Tuesday", date: "4/21/2025", time: "8:00 pm",  temp: 71, feelslike: 71, rainchance: 24, humidity: 74 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 22, day: "Tuesday", date: "4/21/2025", time: "9:00 pm",  temp: 70, feelslike: 70, rainchance: 18, humidity: 76 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 23, day: "Tuesday", date: "4/21/2025", time: "10:00 pm", temp: 69, feelslike: 68, rainchance: 14, humidity: 77 , windspeed: 5, winddirection: "SE", weathercode: 8},
    { key: 24, day: "Tuesday", date: "4/21/2025", time: "11:00 pm", temp: 68, feelslike: 67, rainchance: 12, humidity: 78 , windspeed: 5, winddirection: "SE", weathercode: 8},
];


type HourlyProps = {
    day: string;
    date: string;
    time: string;
    temp: number;
    feelslike: number;
    rainchance: number;
    humidity: number;
    windspeed: number;
    winddirection: string;
    weathercode: number;
};

function HourlyRow({time, temp, feelslike, rainchance, humidity, windspeed, winddirection, weathercode }: HourlyProps) {
    return (
        <ThemedView style={hourlyStyles.rowCard}>
            <ThemedView style={hourlyStyles.leftColumn}>
                <ThemedText style={hourlyStyles.timeText}>
                    {time}
                </ThemedText>


                <Image source={WEATHER_CODE_INFO[weathercode].icon} style={hourlyStyles.icon} />

                <ThemedText style={hourlyStyles.tempText}>
                    {temp}{"\u00B0"}F
                </ThemedText>
            </ThemedView>

            <ThemedView style={hourlyStyles.rightColumn}>
                <ThemedText style={hourlyStyles.detailText}>
                    Feels Like: {feelslike}{"\u00B0"}F
                </ThemedText>

                <ThemedText style={hourlyStyles.detailText}>
                    Precip Chance: {rainchance}%
                </ThemedText>

                <ThemedText style={hourlyStyles.detailText}>
                    Humidity: {humidity}%
                </ThemedText>

                <ThemedText style={hourlyStyles.detailText}>
                    Wind: {windspeed} mph {winddirection}
                </ThemedText>

                <ThemedText style={hourlyStyles.detailText}>
                    Summary: {getWeatherInfo(weathercode).summary}
                </ThemedText>
            </ThemedView>
        </ThemedView>
    );
}



function LoadingHourlyRow() {
    return (
        <ThemedView style={hourlyStyles.rowCard}>
            <ThemedText style={hourlyStyles.tempText}>
                Loading...
            </ThemedText>
        </ThemedView>
    )
}

function ErrorHourlyRow() {
    return (
        <ThemedView style={hourlyStyles.rowCard}>
            <ThemedText style={hourlyStyles.tempText}>
                Error retrieving hourly data
            </ThemedText>
        </ThemedView>
    )
}


function formatHourlyData(rawData: any): 
    {   key: number; 
        day: string;
        date: string;
        time: string;
        temp: number;
        feelslike: number;
        rainchance: number;
        humidity: number; 
        windspeed: number;
        winddirection: string;
        weathercode: number;
    } [] 
    {
   return rawData.hourly.time.map((timestamp: string, index: number) => {
    const [datePart, timePart] = timestamp.split("T");
    const [year, month, dayNum] = datePart.split("-").map(Number);
    const localDate = new Date(year, month - 1, dayNum);

    return {
        key: index,
        day: localDate.toLocaleDateString("en-US", { weekday: "long" }),
        date: `${month}/${dayNum}/${year}`,
        time: timePart,
        temp: Math.round(rawData.hourly.temperature_2m[index]),
        feelslike: Math.round(rawData.hourly.apparent_temperature[index]),
        rainchance: rawData.hourly.precipitation_probability[index],
        humidity: Math.round(rawData.hourly.relative_humidity_2m[index]),
        windspeed: Math.round(rawData.hourly.wind_speed_10m[index]),
        winddirection: rawData.hourly.wind_direction_10m[index],
        weathercode: rawData.hourly.weather_code[index],
        };
    });
}

function formatHourTo12Hour(time24:any): string {
    const [hourString, minute] = time24.split(":");
    const hour24 = Number(hourString);

    const suffix = hour24 >= 12 ? "pm" : "am";

    let hour12 = hour24 % 12;

    if (hour12 === 0) {
        hour12 = 12;
    }

    return `${hour12}:${minute} ${suffix}`;
}
                

export default function HomeScreen() {
    const [HourlyData, setHourlyData] = useState(hourly_data_default);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { date } = useLocalSearchParams();
    const router = useRouter();
    
    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function fetchWeatherWithRetry(url: string, retries = 3) {
        let lastError: unknown;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return await response.json();
            } 

            catch (err) {
                lastError = err;
                console.log(`Fetch attempt ${attempt} failed`);

                if (attempt < retries) {
                    await sleep(250);
                }
            }
        }

        throw lastError;
    }

    const loadWeather = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const storedLat = await AsyncStorage.getItem('weatherLat');
            const storedLon = await AsyncStorage.getItem('weatherLon');
            const storedLocation = await AsyncStorage.getItem('weatherLocation');
            const latitude = storedLat ? parseFloat(storedLat) : 34.2257;
            const longitude = storedLon ? parseFloat(storedLon) : -77.9447;
            const location = storedLocation?.split(', ').slice(0, 2).join(', ') || "Wilmington, NC";

            const url =
                `https://api.open-meteo.com/v1/forecast` +
                `?latitude=${latitude}` +
                `&longitude=${longitude}` +
                `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,wind_speed_10m,wind_direction_10m,weather_code` +
                `&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,wind_speed_10m,wind_direction_10m,weather_code` +
                `&temperature_unit=fahrenheit` + 
                `&windspeed_unit=mph` +
                `&timezone=auto`;

            const rawData = await fetchWeatherWithRetry(url, 8);
            // const rawData = await response.json();
            
            const newHourlyData = formatHourlyData(rawData);

            // temporary: keep defaults for now until transform step
            setHourlyData(newHourlyData);
        } 

        catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error(err);
        } 

        finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadWeather();
        }, [loadWeather])
    );

    useEffect(() => {

        const intervalId = setInterval(() => {
            loadWeather();
        }, update_interval * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [loadWeather]);

    let forecastContent;

    const selectedDate = typeof date === 'string' ? date : "";


    const filteredHourlyData = HourlyData.filter((hourly) => hourly.date === selectedDate);

    const now = new Date();


    let displayHourlyData;

    if (selectedDate === new Date().toLocaleDateString("en-US")) {
        const currentHour = now.getHours();

        displayHourlyData = filteredHourlyData.filter((hourly) => {
            const hourlyHour = Number(hourly.time.split(":")[0]);
            return hourlyHour >= currentHour;
        });
    } else {
        displayHourlyData = filteredHourlyData;
    }

    const selectedDateLabel =
        displayHourlyData.length > 0
            ? (() => {
                const [month, day, year] = displayHourlyData[0].date.split("/").map(Number);
                const localDate = new Date(year, month - 1, day);
                return localDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                });
            })()
            : selectedDate;


    if (loading) {
        forecastContent = <LoadingHourlyRow />;
    } 

    else if (error !== "") {
        forecastContent = <ErrorHourlyRow />;
    } 

    else {
        forecastContent = displayHourlyData.map((hourly) => (
        <HourlyRow
            key={hourly.key}
            day={hourly.day}
            date={hourly.date}
            time={formatHourTo12Hour(hourly.time)}
            temp={hourly.temp}
            feelslike={hourly.feelslike}
            rainchance={hourly.rainchance}
            humidity={hourly.humidity}
            windspeed={hourly.windspeed}
            winddirection={hourly.winddirection}
            weathercode={hourly.weathercode}
        />
      ));
    }

    console.log("selectedDate =", selectedDate);
    console.log("first hourly date =", HourlyData[0]?.date);
    console.log("display count =", displayHourlyData.length);
    return (
        <ScrollView>
            <ThemedView style={screenstyles.screenstyle}>
                <Pressable onPress={() => router.back()}>
                    <ThemedView style={screenstyles.backbutton}>
                        <ThemedText style={screenstyles.backbuttontext}>
                            Back
                        </ThemedText>
                    </ThemedView>
                </Pressable>
                
                <ThemedText style={screenstyles.sectiontitle}>
                    Hourly Forecast for {selectedDateLabel}
                </ThemedText>

                {forecastContent}
                


            </ThemedView>

        </ScrollView>

      
    );
}


const screenstyles = StyleSheet.create({
    screenstyle: {
        padding: 12,
        borderColor: '#166d69',
        borderWidth: 4,
        margin: 20,
        marginTop: 40,
        flex: 1,
    },
    sectiontitle: {
        fontSize: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    backbutton: {
        backgroundColor: "#0e6955",
        borderColor: "#1fb47a",
        borderWidth: 3,
    },

    backbuttontext: {
        fontSize: 24,
        textAlign: 'center',
    },
});


const hourlyStyles = StyleSheet.create({
    rowCard: {
        flexDirection: "row",
        alignItems: "stretch",
        padding: 10,
        marginBottom: 12,
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: "#0e6955",
        borderColor: "#1fb47a",
        borderWidth: 3,
    },

    leftColumn: {
        width: 90,
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 10,
        borderRightColor: "#1fb47a",
        borderRightWidth: 2,
    },

    rightColumn: {
        flex: 1,
        paddingLeft: 10,
        justifyContent: "center",
    },

    timeText: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 8,
    },

    tempText: {
        fontSize: 24,
        textAlign: "center",
    },

    detailText: {
        fontSize: 16,
        marginBottom: 4,
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 8,
    },
});
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';




const forecast_data_default = [
  { key: 1, day: "Tuesday",   date: "4/21/2025", hightemp: 79, lowtemp: 66, rainchance: 21 },
  { key: 2, day: "Wednesday", date: "4/22/2025", hightemp: 75, lowtemp: 55, rainchance: 0 },
  { key: 3, day: "Thursday",  date: "4/23/2025", hightemp: 81, lowtemp: 62, rainchance: 35 },
  { key: 4, day: "Friday",    date: "4/24/2025", hightemp: 77, lowtemp: 70, rainchance: 48 },
  { key: 5, day: "Saturday",  date: "4/25/2025", hightemp: 84, lowtemp: 58, rainchance: 12 },
  { key: 6, day: "Sunday",    date: "4/26/2025", hightemp: 73, lowtemp: 64, rainchance: 67 },
  { key: 7, day: "Monday",    date: "4/27/2025", hightemp: 76, lowtemp: 60, rainchance: 18 }
];

type ForecastRowProps = {
    day: string;
    date: string;
    hightemp: number;
    lowtemp: number;
    rainchance: number;
};

function ForecastRow({ day, date, hightemp, lowtemp, rainchance }: ForecastRowProps) {
    return (
        <ThemedView style={weatherbox.weathercard}>
            <ThemedText style={weatherbox.daydatetext}>
                {day} - {date}
            </ThemedText>
            <ThemedText style={weatherbox.weatherdatatext}>
                Temp High/Low: {hightemp}{"\u00B0"}F / {lowtemp}{"\u00B0"}F
            </ThemedText>
            <ThemedText style={weatherbox.weatherdatatext}>
                Precip Chance: {rainchance}%
            </ThemedText>
        </ThemedView>
    )
}


function LoadingForecastRow() {
    return (
        <ThemedView style={weatherbox.weathercard}>
            <ThemedText style={weatherbox.daydatetext}>
                Loading...
            </ThemedText>
        </ThemedView>
    )
}

function ErrorForecastRow() {
    return (
        <ThemedView style={weatherbox.weathercard}>
            <ThemedText style={weatherbox.daydatetext}>
                Error retrieving forecast data
            </ThemedText>
        </ThemedView>
    )
}


const current_weather_data_default = {location: "Wilmington, NC", 
                                      day: "Monday",
                                      date: "4/20/2025", 
                                      time: "3:30pm", 
                                      currenttemp: 78, 
                                      feelslike: 80, 
                                      currentrainchance: 0, 
                                      currenthumidity: 75,
                                      overallrainchance: 20, 
                                      hightemp: 85, 
                                      lowtemp: 62}
                 

type CurrentWeatherDataTypes = {
    location: string; 
    day: string;
    date: string; 
    time: string;
    currenttemp: number;
    feelslike: number;
    currentrainchance: number;
    currenthumidity: number;
    overallrainchance: number;
    hightemp: number;
    lowtemp: number;
};

function CurrentWeatherSection({location, day, date, time, currenttemp, feelslike, 
                                currentrainchance, currenthumidity, overallrainchance, 
                                hightemp, lowtemp}: CurrentWeatherDataTypes) {
    return (
        <ThemedView style={todaybox.outertodaycard}>  

            <ThemedText style={todaybox.daydatetext}>
                {location}{"\n"}
                {time}, {day} - {date}
            </ThemedText>

            <ThemedView style={todaybox.innertodaycard}>
                <ThemedView style={todaybox.highlights}>

                    <ThemedText style={todaybox.temptext}>
                        {currenttemp}{"\u00B0"}F          
                    </ThemedText>

                    <ThemedView style={todaybox.highlightsinner}>
                        <ThemedText style={todaybox.detailstext}>
                            Feels Like: {feelslike}{"\u00B0"}F
                        </ThemedText>
                        <ThemedText style={todaybox.detailstext}>
                            Precip Chance: {currentrainchance}%
                        </ThemedText>
                    </ThemedView>

                </ThemedView>

                <ThemedView style={todaybox.details}>
                <ThemedText style={todaybox.smalltext}>Humidity: {currenthumidity}%</ThemedText>    
                <ThemedText style={todaybox.smalltext}>Overall Precip Chance: {overallrainchance}%</ThemedText>
                <ThemedText style={todaybox.smalltext}>Today&apos;s High/Low: {hightemp}{"\u00B0"}F / {lowtemp}{"\u00B0"}F</ThemedText>
                
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )
}

function LoadingCurrent() {
    return (
        <ThemedView style={todaybox.outertodaycard}>
            <ThemedText style={todaybox.daydatetext}>
                Loading...
            </ThemedText>
        </ThemedView>
    )
} 

function ErrorCurrent() {
    return (
        <ThemedView style={todaybox.outertodaycard}>
            <ThemedText style={todaybox.daydatetext}>
                Error retrieving current weather data
            </ThemedText>
        </ThemedView>
    )
}


export default function HomeScreen() {
    const [currentWeatherData, setCurrentWeatherData] = useState(current_weather_data_default);
    const [forecastData, setForecastData] = useState(forecast_data_default);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    useEffect(() => {
        async function loadWeather() {
            setLoading(true);
            setError("");

            try {
                const storedLat = await AsyncStorage.getItem('weatherLat');
                const storedLon = await AsyncStorage.getItem('weatherLon');
                const storedLocation = await AsyncStorage.getItem('weatherLocation');
                const latitude = storedLat ? parseFloat(storedLat) : 34.2257;
                const longitude = storedLon ? parseFloat(storedLon) : -77.9447;
                const location = storedLocation || "Wilmington, NC";

                const url =
                    `https://api.open-meteo.com/v1/forecast` +
                    `?latitude=${latitude}` +
                    `&longitude=${longitude}` +
                    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability` +
                    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
                    `&temperature_unit=fahrenheit` +
                    `&timezone=auto`;

                const rawData = await fetchWeatherWithRetry(url, 8);
                // const rawData = await response.json();
                console.log(rawData);
                const [year, month, day] = rawData.current.time.split("T")[0].split("-").map(Number);
                const localDate = new Date(year, month - 1, day);
                const newCurrentWeatherData = {   
                        location: location,
                        day: localDate.toLocaleDateString("en-US", { weekday: "long" }),
                        date: localDate.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }),
                        time: new Date(rawData.current.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase(),
                        currenttemp: Math.round(rawData.current.temperature_2m),
                        feelslike: Math.round(rawData.current.apparent_temperature),
                        currentrainchance: rawData.current.precipitation_probability,
                        currenthumidity: rawData.current.relative_humidity_2m,
                        overallrainchance: rawData.daily.precipitation_probability_max[0],
                        hightemp: Math.round(rawData.daily.temperature_2m_max[0]),
                        lowtemp: Math.round(rawData.daily.temperature_2m_min[0]),
                };
                
                const newForecastData = rawData.daily.time.slice(1).map((date: string, index: number) => {
                    const [year, month, dayNum] = date.split("-").map(Number);
                    const localDate = new Date(year, month - 1, dayNum);

                    return {
                        key: index,
                        day: localDate.toLocaleDateString("en-US", { weekday: "long" }),
                        date: `${month}/${dayNum}/${year}`,
                        hightemp: Math.round(rawData.daily.temperature_2m_max[index]),
                        lowtemp: Math.round(rawData.daily.temperature_2m_min[index]),
                        rainchance: rawData.daily.precipitation_probability_max[index],
                    };
                });


                // temporary: keep defaults for now until transform step
                setCurrentWeatherData(newCurrentWeatherData);
                setForecastData(newForecastData);
            } 



            catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
                console.error(err);
            } 


            finally {
                setLoading(false);
            }
        }
        loadWeather();
        const intervalId = setInterval(() => 
            {loadWeather();}, 1 * 60 * 1000);

        return () => clearInterval(intervalId);

    }, []);

    let currentContent;

    if (loading) {
        currentContent = <LoadingCurrent />;
    } 

    else if (error !== "") {
        currentContent = <ErrorCurrent />;
    } 

    else {
        currentContent = <CurrentWeatherSection location={currentWeatherData.location}
                                                day={currentWeatherData.day}
                                                date={currentWeatherData.date}
                                                time={currentWeatherData.time}
                                                currenttemp={currentWeatherData.currenttemp}
                                                feelslike={currentWeatherData.feelslike}
                                                currentrainchance={currentWeatherData.currentrainchance}
                                                currenthumidity={currentWeatherData.currenthumidity}
                                                overallrainchance={currentWeatherData.overallrainchance}
                                                hightemp={currentWeatherData.hightemp}
                                                lowtemp={currentWeatherData.lowtemp} />;
    }

    let forecastContent;

    if (loading) {
        forecastContent = <LoadingForecastRow />;
    } 

    else if (error !== "") {
        forecastContent = <ErrorForecastRow />;
    } 

    else {
        forecastContent = forecastData.map((forecast) => (
        <ForecastRow
            key={forecast.key}
            day={forecast.day}
            date={forecast.date}
            hightemp={forecast.hightemp}
            lowtemp={forecast.lowtemp}
            rainchance={forecast.rainchance}
        />
      ));
    }





    
    return (
        <ScrollView>
            <ThemedView style={screenstyles.screenstyle}>

                {currentContent}

                <ThemedText style={screenstyles.sectiontitle}>
                    7-Day Forecast
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
});

const todaybox = StyleSheet.create({

    outertodaycard: {
        padding: 0,
        gap: 0,
        marginBottom: 16,
        backgroundColor: '#0e6955',
        borderColor: '#1fb47a',
        borderWidth: 4,
        marginLeft:8,
        marginRight:8,
    },

    innertodaycard: {
        padding: 8,
        gap: 4,
        backgroundColor: '#0e6955',
        margin:0,
    },

    highlights: {
        padding: 4,
        gap: 2,
        backgroundColor: '#0e6955',
        borderColor: '#1fb47a',
        borderWidth: 4,
        margin:2,
        flexDirection: 'row',
    },

    highlightsinner: {
        padding: 4,
        gap: 2,
        backgroundColor: '#0e6955',
        margin:2,
    },

    details: {
        padding: 4,
        gap: 2,
        backgroundColor: '#0e6955',
        margin:2,
    },
    
    temptext: {
        fontSize:32,
        marginLeft: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    
    daydatetext: {
        fontSize:22,
        marginTop: 8,
        textAlign: 'center',
    },
    
    detailstext: {
        fontSize:16,
        marginLeft: 24,
        textAlign: 'center',
    },
    
    smalltext: {
        fontSize:18,
        marginLeft: 0,
        textAlign: 'center',
    },
});




const weatherbox = StyleSheet.create({

  weathercard: {
    padding: 8,
    gap: 4,
    marginBottom: 16,
    backgroundColor: '#306082',
    borderColor: '#5fcde4',
    borderWidth: 4,
    marginLeft:32,
    marginRight:32,
  },
  
  daydatetext: {
      fontSize:20,
      marginLeft: 0,
      textAlign: 'center',
  },

  weatherdatatext: {
      fontSize:17,
      textAlign: 'center',
  },

  loadingweatherdatatext: {
      fontSize:32,
      textAlign: 'center',
      fontStyle: 'italic',
  },
});

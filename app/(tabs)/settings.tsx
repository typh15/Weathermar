import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Suggestion = {
  display_name: string;
  lat: number;
  lon: number;
};

export default function TabTwoScreen() {
  const [location, setLocation] = useState<string>('Wilmington, NC');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem('weatherLocation');
      if (storedLocation) {
        setLocation(storedLocation);
      }
    } catch (error) {
      console.error('Failed to load location:', error);
    }
  };

  const saveLocation = async (loc: string, lat: number, lon: number) => {
    try {
      await AsyncStorage.setItem('weatherLocation', loc);
      await AsyncStorage.setItem('weatherLat', lat.toString());
      await AsyncStorage.setItem('weatherLon', lon.toString());
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`, {
        headers: {
          'User-Agent': 'WeatherMar/1.0',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const sugg = data.features.map((item: any) => ({
        display_name: item.properties.name + (item.properties.city ? ', ' + item.properties.city : '') + (item.properties.country ? ', ' + item.properties.country : ''),
        lat: item.geometry.coordinates[1],
        lon: item.geometry.coordinates[0],
      }));
      setSuggestions(sugg);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleTextChange = (text: string) => {
    setLocation(text);
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => fetchSuggestions(text), 500);
    setTimeoutId(id);
  };

  const selectSuggestion = (item: Suggestion) => {
    setLocation(item.display_name);
    saveLocation(item.display_name, item.lat, item.lon);
    setSuggestions([]);
  };

  return (
    <ScrollView>
        <ThemedView style={screenstyles.screenstyle}>
            <ThemedText style={screenstyles.sectiontitle}>
                Settings
            </ThemedText>

            <ThemedView style={locationStyles.locationCard}>
                <ThemedText style={locationStyles.locationText}>
                    Location
                </ThemedText>
                <TextInput
                    style={locationStyles.locationInput}
                    value={location}
                    onChangeText={handleTextChange}
                    placeholder="Enter location (e.g., City, State)"
                />
                {suggestions.length > 0 && (
                    <View style={locationStyles.suggestionsList}>
                        {suggestions.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => selectSuggestion(item)} style={locationStyles.suggestionItem}>
                                <ThemedText style={locationStyles.suggestionText}>{item.display_name}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ThemedView>
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


const locationStyles = StyleSheet.create({
  locationCard: {
    padding: 8,
    gap: 4,
    marginBottom: 16,
    backgroundColor: '#306082',
    borderColor: '#5fcde4',
    borderWidth: 4,
    marginLeft: 32,
    marginRight: 32,
  },
  locationText: {
    fontSize: 20,
    marginLeft: 0,
    textAlign: 'center',
  },
  locationInput: {
    fontSize: 17,
    textAlign: 'center',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 4,
  },
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    marginTop: 4,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionText: {
    fontSize: 16,
  },
});

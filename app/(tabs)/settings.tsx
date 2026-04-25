import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TabTwoScreen() {
  const [location, setLocation] = useState('Wilmington, NC');

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
                    onChangeText={setLocation}
                    placeholder="Enter location (e.g., City, State)"
                />
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
});

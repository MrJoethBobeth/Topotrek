import { MapView } from '@maplibre/maplibre-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Your Protomaps API Key
const PROTOMAPS_API_KEY = '471215cca48e7f87';

// Protomaps style URL. This style JSON uses a pmtiles source internally.
// You can try other styles like 'dark', 'light', 'day', 'night'
const protomapsStyleUrl = `https://api.protomaps.com/styles/v5/light/en.json?key=${PROTOMAPS_API_KEY}`;


const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        flex: 1,
        alignSelf: 'stretch',
    },
});

function App(): JSX.Element {
    return (
        <View style={styles.page}>
        <MapView style={styles.map} mapStyle={protomapsStyleUrl} />
    </View>
);
}

export default App;
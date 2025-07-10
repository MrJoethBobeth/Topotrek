import { MapView } from '@maplibre/maplibre-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as lightURL from './style.json';



// Protomaps style URL. This style JSON uses a pmtiles source internally.
// You can try other styles like 'dark', 'light', 'day', 'night'
const styleUrl = lightURL;


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
        <MapView style={styles.map} mapStyle={styleUrl} />
    </View>
);
}

export default App;
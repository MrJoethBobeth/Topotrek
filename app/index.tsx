import { MapView } from '@maplibre/maplibre-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const apiKey = '60c49849-cb48-4c6d-a3df-65f688ec8141';
const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apiKey}`;

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
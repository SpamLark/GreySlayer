import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getTotalPileValue, getTotalPileSoldValue, getTotalPileModels, getTotalCompletedPileModels } from '../../services/pileOfShameServices';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDatabase } from '../../services/database/DatabaseContext';

const PileStatistics = () => {

    const [pileValue, setPileValue] = useState(0);
    const [pileModels, setPileModels] = useState(0);
    const [totalSold, setTotalSold] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);
    const isFocused = useIsFocused();
    //const navigation = useNavigation();
    const db = useDatabase();

    // LIFECYCLE FUNCTIONS

    // Get pile value
    const getValue = async () => {
        try {
            const valueItem = (await getTotalPileValue(db));
            setPileValue(valueItem[0].pile_value);
        } catch (error) {
            console.log('Error while retrieving pile value:', error)
        }
    };

    // Get sold value
    const getSold = async () => {
        try {
            const soldValue = (await getTotalPileSoldValue(db));
            setTotalSold(soldValue[0].sold_value);
        } catch (error) {
            console.log('Error while retrieving sold value:', error)
        }
    };

    // Get number of models in pile
    const getNumModels = async () => {
        try {
            const numModels = (await getTotalPileModels(db));
            setPileModels(numModels[0].total_models);
        } catch (error) {
            console.log('Error while retrieving number of pile models :', error)
        }
    };

    // Get number of completed models
    const getNumCompleted = async () => {
        try {
            const numCompleted = (await getTotalCompletedPileModels(db));
            setTotalCompleted(numCompleted[0].complete_models)
        } catch (error) {
            console.log('Error while retrieving number of completed models :', error)
        }
    };

      // On focus, retrieve current data from the model_kits table
    useEffect(() => {
        if (isFocused) {
            getValue();
            getSold();
            getNumModels();
            getNumCompleted();
        }
    },[isFocused]);

    return (
        <View style={styles.container}>
            <Text>Current Pile value:</Text>
            <Text style={styles.bigText}>£{pileValue.toFixed(2)}</Text>
            <Text>Models in your Pile:</Text>
            <Text style={styles.bigText}>{pileModels}</Text> 
            <Text>Pile models completed:</Text>
            <Text style={styles.bigText}>{totalCompleted}</Text>
            <Text>Value of kits sold:</Text>
            <Text style={styles.bigText}>£{totalSold.toFixed(2)}</Text>
        </View>
    );
};

// STYLE
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0
    },
    bigText: {
        fontWeight: 'bold',
        fontSize: 30,
    },
    horizontalListContainer: {
      flexDirection: 'row',
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 2,
      marginHorizontal: 2,
      height: 50,
      padding: 10,
      borderWidth: 1
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0
    },
    flashlistContainer: {
      height: '70%'
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginVertical: 30,
      borderRadius: 5,
      backgroundColor: '#007BFF',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    }
});

export default PileStatistics;
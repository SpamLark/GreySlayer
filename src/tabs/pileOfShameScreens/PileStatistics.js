import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getTotalPileValue, getTotalPileSoldValue, getTotalPileModels, getTotalCompletedPileModels } from '../../services/pileOfShameServices';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDatabase } from '../../services/database/DatabaseContext';
import { Icon } from '@ui-kitten/components';

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
            <View style={styles.statContainer}>
            <Icon style={styles.helpIcon} name="percent-outline" height={50} width={50} fill="#271900" />
                <View style={styles.textContainer}>
                    <Text style={styles.labelText}>Current Pile value:</Text>
                    <Text style={styles.bigText}>£{pileValue.toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.statContainer}>
                <View style={[styles.textContainer, {alignItems:'flex-start'}]}>
                    <Text style={styles.labelText}>Models in your Pile:</Text>
                    <Text style={styles.bigText}>{pileModels}</Text>
                </View>
                <Icon style={styles.helpIcon} name="cube-outline" height={50} width={50} fill="#271900" />
            </View>
            <View style={styles.statContainer}>
                <Icon style={styles.helpIcon} name="color-palette-outline" height={50} width={50} fill="#271900" />
                <View style={styles.textContainer}>
                    <Text style={styles.labelText}>Pile models completed:</Text>
                    <Text style={styles.bigText}>{totalCompleted}</Text>
                </View>
            </View>
            <View style={styles.statContainer}>
                <View style={[styles.textContainer, {alignItems:'flex-start'}]}>
                    <Text style={styles.labelText}>Value of kits sold:</Text>
                    <Text style={styles.bigText}>£{totalSold.toFixed(2)}</Text>
                </View>
                <Icon style={styles.helpIcon} name="shopping-cart-outline" height={50} width={50} fill="#271900" />
            </View>
        </View>
    );
};

// STYLE
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingHorizontal: 20,
      marginTop: 0
    },
    statContainer: {
        //flex: 1,
        alignItems:'center',
        width: '100%',
        justifyContent: 'space-evenly',
        alignContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#ffdeaa',
        borderRadius: 10,
        flexDirection: 'row',
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        padding: 5
    },
    helpIcon: {
    },
    bigText: {
        fontSize: 50,
        fontFamily: 'agdasima-bold',
    },
    labelText: {
        fontFamily: 'agdasima-regular',
        fontSize: 30
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
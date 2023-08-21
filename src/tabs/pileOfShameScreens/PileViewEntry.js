import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../services/database/DatabaseContext';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { updatePileOfShameEntryStatus } from '../../services/pileOfShameServices';


const PileViewEntry = ({route}) => {

    // Extract the details of the item sent via the route prop
    const item = route.params.item;

    //Declare navigation to support stack navigation
    const navigation = useNavigation();

    // Use shared database connection
    const db = useDatabase();

    // Declare state variables for form fields
    const [kitName, setKitName] = useState(item.kit_name);
    const [numModels, setNumModels] = useState(item.num_models.toString());
    const [kitValue, setKitValue] = useState(item.kit_value.toString());

    // Call update service to change status of entry before navigating back to Pile Overview
    const handleStatusUpdate = async (statusId) => {
        try {
            await updatePileOfShameEntryStatus(db, item.kit_id, statusId);
            navigation.navigate('Pile Overview');
        } catch (error) {
            console.log('Error whilst updating database:', error)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text>Pile View</Text>
                    <Text>Model Kit Name</Text>
                    <TextInput
                        style={styles.input}
                        value={kitName}
                        onChangeText={setKitName}
                        readOnly={true}
                    />
                    <Text>Number of Models</Text>
                    <Text>{numModels}</Text>
                    <Slider
                        style={styles.slider}
                        value={numModels}
                        minimumValue={1}
                        maximumValue={30}
                        step={1}
                        onValueChange={(value) => setNumModels(value)}
                        disabled={true}
                    />
                    <Text>Kit Value</Text>
                    <TextInput 
                        style={styles.input}
                        value={kitValue}
                        onChangeText={setKitValue}
                        keyboardType='numeric'
                        readOnly={true}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => handleStatusUpdate(3)}
                    >
                        <Text style={styles.buttonText}>Sold</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => handleStatusUpdate(2)}
                    >
                        <Text style={styles.buttonText}>Completed</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0
    },
    formContainer: {
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 200
    },
    buttonContainer: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 0
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 30,
        marginHorizontal: 30,
        width: 120,
        borderRadius: 5,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    slider: {
        width: 200,
        height: 40,
    }
    });

export default PileViewEntry;
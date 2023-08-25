import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../services/database/DatabaseContext';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { updatePileOfShameEntryStatus } from '../../services/pileOfShameServices';
import { Icon } from '@ui-kitten/components';

const PileViewEntry = ({route}) => {

    // Extract the details of the item sent via the route prop
    const item = route.params;

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
                <View style={styles.helpBox}>
                    <Icon style={styles.helpIcon} name="bulb-outline" height={20} width={20} fill='#271900' />
                    <Text style={styles.basicText}>Use the buttons below to mark an entry as sold or complete.</Text>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>Model Kit Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setKitName}
                        value={kitName}
                        placeholder='Name of the kit'
                        readOnly={true}
                    />
                    </View>
                    <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>Number of Models:  {numModels}</Text>
                    <Text style={styles.questionText}></Text>
                    <Slider
                        style={styles.slider}
                        value={numModels}
                        minimumValue={1}
                        maximumValue={30}
                        step={1}
                        onValueChange={(value) => setNumModels(value)}
                        minimumTrackTintColor= '#bf0025'
                        maximumTrackTintColor= '#fffbff'
                        disabled={true}
                    />
                    </View>
                    <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>Kit Value</Text>
                    <TextInput 
                        style={styles.input}
                        onChangeText={setKitValue}
                        value={kitValue}
                        keyboardType='numeric'
                        readOnly={true}
                    />
                    </View>
                </View>
                <View style={styles.actionContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => handleStatusUpdate(3)}
                    >
                        <Text style={styles.buttonText}>SOLD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => handleStatusUpdate(2)}
                    >
                        <Text style={styles.buttonText}>COMPLETE</Text>
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
          //justifyContent: 'center',
          marginTop: 0
        },
        heading:{
          fontFamily: 'agdasima-bold',
          fontSize: 32,
          marginTop: 20,
          color: '#201a1a'
        },
        helpBox: {
          flex: 1,
          flexDirection:'row',
          backgroundColor: '#ffdeaa',
          justifyContent:'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          marginHorizontal: 50,
          // marginVertical: 20,
          borderRadius: 10,
          width: 300,
          marginTop: 20
          // height: 50
        },
        helpIcon: {
          marginHorizontal:10
        },
        basicText: {
          paddingHorizontal:15,
          fontFamily: 'agdasima-regular',
          fontSize: 18
        },
        formContainer: {
          flex: 5,
          backgroundColor: '#ffdad8',
          justifyContent:'space-evenly',
          alignItems: 'center',
          width: 300,
          borderRadius: 10,
          paddingHorizontal: 10,
          marginTop: 20,
        },
        questionContainer: {
          flex: 1,
          alignItems:'flex-start',
          width: '100%',
          justifyContent: 'space-evenly',
          paddingVertical: 10,
          paddingHorizontal: 5
        },
        questionText: {
          fontFamily: 'agdasima-regular',
          fontSize: 24,
          color: '#410006'
        },
        input: {
          height: 40,
          margin: 0,
          //borderWidth: 1,
          paddingHorizontal: 10,
          width: '100%',
          backgroundColor: '#fffbff',
          alignItems: 'center',
          borderRadius: 10,
          fontFamily: 'agdasima-regular',
          fontSize: 18
        },
        actionContainer: {
            flexDirection: 'row',
            width: '100%',
            height: '15%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        button: {
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginTop: 10,
          marginBottom: 20,
          borderRadius: 30,
          backgroundColor: '#bf0025',
          justifyContent: 'center',
          alignItems: 'center',
        },
        buttonText: {
          color: '#fff',
          fontSize: 20,
          margin:5,
          fontFamily:'agdasima-bold',
          justifyContent: 'center',
          alignItems: 'center',
        },
        slider: {
          height: 40,
          width: '100%'
        }
      });

export default PileViewEntry;
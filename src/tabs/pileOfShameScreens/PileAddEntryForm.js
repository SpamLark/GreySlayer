import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../services/database/DatabaseContext';
import Slider from '@react-native-community/slider';
import { insertNewPileOfShameEntry } from '../../services/pileOfShameServices';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@ui-kitten/components';


const PileAddEntryForm = () => {

  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variables for form fields
  const [kitName, setKitName] = useState('');
  const [numModels, setNumModels] = useState(1);
  const [kitValue, setKitValue] = useState('');

  const handleSubmit = async () => {
    try {
      await insertNewPileOfShameEntry(db, kitName, numModels, kitValue);
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
            <Text style={styles.basicText}>Use this form to add an entry to your pile of shame.</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Model Kit Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={setKitName}
                placeholder='Name of the kit'
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
              />
            </View>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Kit Value</Text>
              <TextInput 
                style={styles.input}
                onChangeText={setKitValue}
                keyboardType='numeric'
              />
            </View>
          </View>
          <TouchableOpacity 
            style={styles.button}
            onPress={()=> handleSubmit()}
          >
            <Icon name="save-outline" height={50} width={50} fill='#bf0025' />
          </TouchableOpacity>
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
      marginTop: 0,
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
      borderRadius: 10,
      fontFamily: 'agdasima-regular',
      fontSize: 18
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginTop: 10,
      marginBottom: 20,
      borderRadius: 5,
      backgroundColor: '#ffffff',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    slider: {
      height: 40,
      width: '100%'
    }
  });

  export default PileAddEntryForm;
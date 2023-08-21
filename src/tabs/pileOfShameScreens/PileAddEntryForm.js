import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../services/database/DatabaseContext';
import Slider from '@react-native-community/slider';
import { insertNewPileOfShameEntry } from '../../services/pileOfShameServices';
import { useNavigation } from '@react-navigation/native';


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
          <Text>Pile Entry Form</Text>
          <Text>Model Kit Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setKitName}
            placeholder='Name of the kit'
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
          />
          <Text>Kit Value</Text>
          <TextInput 
            style={styles.input}
            onChangeText={setKitValue}
            keyboardType='numeric'
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={()=> handleSubmit()}
          >
            <Text style={styles.buttonText}>Submit</Text>
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
      justifyContent: 'center',
      marginTop: 0
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: 200
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
    },
    slider: {
      width: 200,
      height: 40,
    }
  });

  export default PileAddEntryForm;
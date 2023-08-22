import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation } from '@react-navigation/native';
import { insertNewStep } from '../../services/paintLogServices';


const StepAddEntryForm = ({route}) => {

  // Extract parent recipe id from route parameters
  const recipeId = route.params;

  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variables for form fields
  const [stepDescription, setStepDescription] = useState('');
  const [paintName, setPaintName] = useState('');
  const [paintBrand, setPaintBrand] = useState('');


  const handleSubmit = async () => {
    try {
      await insertNewStep(db, stepDescription, paintName, paintBrand, recipeId);
      navigation.navigate('Steps', recipeId);
    } catch (error) {
      console.log('Error adding recipe to the database:', error)
    }
  }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text>Step Entry Form</Text>
          <Text>Step Description</Text>
          <TextInput
            style={styles.input}
            onChangeText={setStepDescription}
            placeholder='Step Description'
          />
          <Text>Paint Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPaintName}
            placeholder='Paint Name'
          />
          <Text>Paint Brand</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPaintBrand}
            placeholder='Paint Brand'
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

  export default StepAddEntryForm;
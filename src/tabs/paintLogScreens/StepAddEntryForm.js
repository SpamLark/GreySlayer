import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation } from '@react-navigation/native';
import { insertNewStep } from '../../services/paintLogServices';
import { Icon } from '@ui-kitten/components';


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
          <View style={styles.helpBox}>
            <Icon style={styles.helpIcon} name="bulb-outline" height={20} width={20} fill='#271900' />
            <Text style={styles.basicText}>Use this form to add steps to your recipe</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Step Description</Text>
              <TextInput
                style={styles.input}
                onChangeText={setStepDescription}
                placeholder='Step Description'
              />
            </View>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Paint Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPaintName}
                placeholder='Paint Name'
              />
            </View>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Paint Brand</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPaintBrand}
                placeholder='Paint Brand'
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

  export default StepAddEntryForm;
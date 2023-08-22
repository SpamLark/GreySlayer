import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation } from '@react-navigation/native';
import { insertNewModel } from '../../services/paintLogServices';


const ModelAddEntryForm = ({route}) => {

  const projectId = route.params;

  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variables for form fields
  const [modelName, setModelName] = useState('');

  const handleSubmit = async () => {
    try {
      console.log(route);
      await insertNewModel(db, modelName, projectId);
      navigation.navigate('Models', projectId);
    } catch (error) {
      console.log('Error adding model to the database:', error)
    }
  }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text>Model Entry Form</Text>
          <Text>Model Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setModelName}
            placeholder='Model Name'
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

  export default ModelAddEntryForm;
import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation } from '@react-navigation/native';
import { insertNewProject } from '../../services/paintLogServices';


const ProjectAddEntryForm = () => {

  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variables for form fields
  const [projectName, setProjectName] = useState('');
  const [modelRange, setModelRange] = useState('');

  const handleSubmit = async () => {
    try {
      await insertNewProject(db, projectName, modelRange);
      navigation.navigate('Projects');
    } catch (error) {
      console.log('Error adding project to the database:', error)
    }
  }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text>Project Entry Form</Text>
          <Text>Project Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setProjectName}
            placeholder='Project Name'
          />
          <Text>Model Range</Text>
          <TextInput
            style={styles.input}
            onChangeText={setModelRange}
            placeholder='Model Range'
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

  export default ProjectAddEntryForm;
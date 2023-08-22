import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllProjectModels } from '../../services/paintLogServices';


const Models = ({route}) => {

    // Extract the details of the project sent via the route prop
    const projectId = route.params;
    
    // Declare is focused to hold focus state of the screen
    const isFocused = useIsFocused();

    //Declare navigation to support stack navigation
    const navigation = useNavigation();

    // Use shared database connection
    const db = useDatabase();

    // Declare state variable to hold models
    const [models, setModels] = useState();

    // Used by FlashList of models to control display and behaviour
    const renderItem = ({item}) => { 
        const handlePress = () => {
              console.log('Item pressed:', item);
              navigation.navigate('Recipes', {item});
          }
          return (
              <TouchableOpacity onPress={handlePress}>
                <View style={styles.horizontalListContainer}>
                  <View>
                    <Text>{item.model_name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
          );
      };

    // Get models from the database for the project using project_id from route prop
    const getModels = async () => {
        try {
        setModels(await getAllProjectModels(db, projectId));
        } catch (error) {
        console.log('Error retrieving models:', error);
        }
    };

    // On focus, retrieve current data from the projects table
    useEffect(() => {
        if (isFocused) {
        getModels();
        }
    },[isFocused]);

    return (
        <View style={styles.container}>
          <View style={styles.flashlistContainer}>
            <FlashList 
                data={models}
                renderItem={renderItem}
                estimatedItemSize={200}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={()=> navigation.navigate('Add Model', projectId)}
            >
              <Text style={styles.buttonText}>Add Model</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      //alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0
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

export default Models;
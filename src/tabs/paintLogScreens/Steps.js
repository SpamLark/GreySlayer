import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllRecipeSteps, updateStepNumbers } from '../../services/paintLogServices';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Steps = ({route}) => {

    // Extract the details of the project sent via the route prop
    const item = route.params.item;
    
    // Declare is focused to hold focus state of the screen
    const isFocused = useIsFocused();

    //Declare navigation to support stack navigation
    const navigation = useNavigation();

    // Use shared database connection
    const db = useDatabase();

    // Declare state variable to hold models
    const [steps, setSteps] = useState([]);

    // Used by FlashList of projects to control display and behaviour
    const renderItem = ({item, drag, isActive}) => { 
        const handlePress = () => {
              console.log('Item pressed:', item);
              navigation.navigate('Steps', {item});
          }
          return (
            <ScaleDecorator>
              <TouchableOpacity 
                onPress={handlePress}
                onLongPress={drag}
                disabled={isActive}
              >
                <View style={styles.horizontalListContainer}>
                  <View>
                    <Text>{item.step_description} - {item.paint_name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScaleDecorator>
          );
      };

    // Handle drag end and commit new step order to the database
    const updateStepOrder = async (data) => {
        setSteps(data);
        try {
            await updateStepNumbers(db, data);
        } catch (error) {
            console.log('Error updating step order in the database: ', error);
        }
    }

    // Get steps from the database for the recipe using recipe_id from route prop
    const getSteps = async () => {
        try {
        setSteps(await getAllRecipeSteps(db, item.recipe_id));
        } catch (error) {
        console.log('Error retrieving steps:', error);
        }
    };

    // On focus, retrieve current data from the projects table
    useEffect(() => {
        if (isFocused) {
        getSteps();
        }
    },[isFocused]);

    return (
        <View style={styles.container}>
          <View style={styles.flashlistContainer}>
            <GestureHandlerRootView>
                <DraggableFlatList 
                    data={steps}
                    //onDragEnd={({data}) => {setSteps(data); console.log(steps); console.log(data)}}
                    onDragEnd={({data}) => updateStepOrder(data)}
                    keyExtractor={(item) => item.step_id}
                    renderItem={renderItem}
                    //estimatedItemSize={200} -- only usable on FlashList
                />
            </GestureHandlerRootView>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              //onPress={()=> navigation.navigate('Add Entry')}
            >
              <Text style={styles.buttonText}>Add Step</Text>
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

export default Steps;
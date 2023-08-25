import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllRecipeSteps, updateStepNumbers, deleteStep } from '../../services/paintLogServices';
import SwipeableItem from 'react-native-swipeable-item';
import DeleteUnderlay from '../../components/DeleteUnderlay';
import SlayerList from '../../components/SlayerList';
import { ScaleDecorator } from 'react-native-draggable-flatlist';

const Steps = ({route}) => {

  // Extract the details of the project sent via the route prop
  const recipeId = route.params;
  
  // Declare is focused to hold focus state of the screen
  const isFocused = useIsFocused();

  //Declare navigation to support stack navigation
  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variable to hold models
  const [steps, setSteps] = useState([]);

  //EVENT HANDLERS

  // Render step items
  const renderItem = ({item, drag, isActive}) => { 
    return (
      <ScaleDecorator>
        <SwipeableItem
          onChange={(state) => {
            console.log(state);
          }}
          renderUnderlayLeft={() => <DeleteUnderlay deleteItem={handleDelete} itemId={item.step_id}/>}
          snapPointsLeft={[150]}
        >
          <TouchableOpacity 
            onPress={() => handlePress(item)}
            onLongPress={drag}
            disabled={isActive}
          >
            <View style={styles.horizontalListContainer}>
              <View>
                <Text style={styles.listItem}>{item.step_description} - {item.paint_name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableItem>
      </ScaleDecorator>
    );
  };

  // Handle drag-and-drop re-ordering
  const updateStepOrder = async (data) => {
    console.log('Running update step order.')
    setSteps(data);
    try {
        await updateStepNumbers(db, data);
    } catch (error) {
        console.log('Error updating step order in the database: ', error);
    }
  };

    // Handle item presses
    const handlePress = (item) => {
      console.log('Item pressed:', item);
      //navigation.navigate('Steps', {item});
    }
  
    // Handle delete presses
    const handleDelete = async (db, stepId) => {
      try {
        await deleteStep(db, stepId);
        // After step is deleted successfully, get a fresh pull of steps
        await getSteps();
      } catch (error) {
        console.log('Error deleting step: ', error);
      }
    };

  // LIFECYCLE FUNCTIONS

  // Get steps from the database for the recipe using recipe_id
  const getSteps = async () => {
      try {
      setSteps(await getAllRecipeSteps(db, recipeId));
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

  // COMPONENT RETURN

  return (
    <SlayerList 
      data={steps}
      updateListOrder={updateStepOrder}
      keyExtractor={(item) => item.step_id}
      renderItem={renderItem}
      addForm={'Add Step'}
      parentId={recipeId}
      item={'Step'}
      statDisplay='none'
    />
  );
};

// STYLE

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0
  },
  listContainer: {
    flex: 9,
  },
  horizontalListContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#ffdad8',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 10,
    height: 50,
    padding: 10,
    borderRadius: 10
    //borderWidth: 1,
    //borderColor: 
  },
  listItem: {
    fontFamily: 'agdasima-regular',
    fontSize: 22,
    color: '#410006'
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 0
  },
  button: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    marginVertical: 5,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: '#cc0e2b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});

export default Steps;
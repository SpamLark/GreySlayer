import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllModelRecipes, deleteRecipe, updateRecipeNumbers } from '../../services/paintLogServices';
import SlayerList from '../../components/SlayerList';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem from 'react-native-swipeable-item';
import DeleteUnderlay from '../../components/DeleteUnderlay';


const Recipes = ({route}) => {

  // Extract the model id from the route parameters
  const modelId = route.params;
  
  // Declare is focused to hold focus state of the screen
  const isFocused = useIsFocused();

  //Declare navigation to support stack navigation
  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variable to hold models
  const [recipes, setRecipes] = useState([]);

  //EVENT HANDLERS

  // Render recipe items
  const renderItem = ({item, drag, isActive}) => { 
    return (
      <ScaleDecorator>
        <SwipeableItem
          onChange={(state) => {
            console.log(state);
          }}
          renderUnderlayLeft={() => <DeleteUnderlay deleteItem={handleDelete} itemId={item.recipe_id}/>}
          snapPointsLeft={[150]}
        >
          <TouchableOpacity 
            onPress={() => handlePress(item)}
            onLongPress={drag}
            disabled={isActive}
          >
            <View style={styles.horizontalListContainer}>
              <View>
                <Text style={styles.listItem}>{item.recipe_name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableItem>
      </ScaleDecorator>
    );
  };

  // Handle drag-and-drop re-ordering
  const updateRecipeOrder = async (data) => {
    console.log('Running update recipe order.')
    setRecipes(data);
    try {
        await updateRecipeNumbers(db, data);
    } catch (error) {
        console.log('Error updating recipe order in the database: ', error);
    }
  };

  // Handle item presses
  const handlePress = (item) => {
    console.log('Item pressed:', item);
    navigation.navigate('Steps', item.recipe_id);
  }
  
  // Handle delete presses
  const handleDelete = async (db, recipeId) => {
    try {
      await deleteRecipe(db, recipeId);
      // After recipe is deleted successfully, get a fresh pull of recipes
      await getRecipes();
    } catch (error) {
      console.log('Error deleting recipe: ', error);
    }
  };

  // LIFECYCLE FUNCTIONS

  // Get recipes from the database for the model using model_id from route prop
  const getRecipes = async () => {
    try {
      setRecipes(await getAllModelRecipes(db, modelId));
    } catch (error) {
      console.log('Error retrieving recipes:', error);
    }
  };

  // On focus, retrieve current data from the projects table
  useEffect(() => {
    if (isFocused) {
      getRecipes();
    }
  },[isFocused]);

  // COMPONENT RETURN

  return (
    <SlayerList 
      data={recipes}
      updateListOrder={updateRecipeOrder}
      keyExtractor={(item) => item.recipe_id}
      renderItem={renderItem}
      addForm={'Add Recipe'}
      parentId={modelId}
      item={'Recipe'}
      statDisplay='none'
    />
  );

}

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

export default Recipes;
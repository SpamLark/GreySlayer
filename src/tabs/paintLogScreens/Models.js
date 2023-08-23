import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllProjectModels, deleteModel, updateModelNumbers } from '../../services/paintLogServices';
import SlayerList from '../../components/SlayerList';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem from 'react-native-swipeable-item';
import DeleteUnderlay from '../../components/DeleteUnderlay';


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
  const [models, setModels] = useState([]);

  // EVENT HANDLERS

  // Render model items
  const renderItem = ({item, drag, isActive}) => { 
      // const handlePress = () => {
      //       console.log('Item pressed:', item);
      //       console.log(item.model_id);
      //       navigation.navigate('Recipes', item.model_id);
      //   }
    return (
      <ScaleDecorator>
        <SwipeableItem
          onChange={(state) => {
            console.log(state);
          }}
          renderUnderlayLeft={() => <DeleteUnderlay deleteItem={handleDelete} itemId={item.model_id}/>}
          snapPointsLeft={[150]}
        >
          <TouchableOpacity 
            onPress={() => handlePress(item)}
            onLongPress={drag}
            disabled={isActive}
          >
            <View style={styles.horizontalListContainer}>
              <View>
                <Text>{item.model_name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableItem>
      </ScaleDecorator>
    );
  };

  // Handle drag-and-drop re-ordering
  const updateModelOrder = async (data) => {
    console.log('Running update model order.')
    setModels(data);
    try {
        await updateModelNumbers(db, data);
    } catch (error) {
        console.log('Error updating model order in the database: ', error);
    }
  };

  // Handle item presses
  const handlePress = (item) => {
    console.log('Item pressed:', item);
    navigation.navigate('Recipes', item.model_id);
  }
  
  // Handle delete presses
  const handleDelete = async (db, modelId) => {
    try {
      await deleteModel(db, modelId);
      // After model is deleted successfully, get a fresh pull of models
      await getModels();
    } catch (error) {
      console.log('Error deleting models: ', error);
    }
  };

  //LIFECYCLE FUNCTIONS

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

  // COMPONENT RETURN

  return (
    <SlayerList 
      data={models}
      updateListOrder={updateModelOrder}
      keyExtractor={(item) => item.model_id}
      renderItem={renderItem}
      addForm={'Add Model'}
      parentId={projectId}
      item={'Model'}
    />
      // <View style={styles.container}>
      //   <View style={styles.flashlistContainer}>
      //     <FlashList 
      //         data={models}
      //         renderItem={renderItem}
      //         estimatedItemSize={200}
      //     />
      //   </View>
      //   <View style={styles.buttonContainer}>
      //     <TouchableOpacity 
      //       style={styles.button}
      //       onPress={()=> navigation.navigate('Add Model', projectId)}
      //     >
      //       <Text style={styles.buttonText}>Add Model</Text>
      //     </TouchableOpacity>
      //   </View>
      // </View>
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
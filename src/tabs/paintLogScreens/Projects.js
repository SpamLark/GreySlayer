import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllProjects, updateProjectNumbers, deleteProject } from '../../services/paintLogServices';
import SlayerList from '../../components/SlayerList';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem from 'react-native-swipeable-item';
import DeleteUnderlay from '../../components/DeleteUnderlay';


const Projects = () => {
    
  // Declare is focused to hold focus state of the screen
  const isFocused = useIsFocused();

  //Declare navigation to support stack navigation
  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variable to hold projects
  const [projects, setProjects] = useState([]);

  // EVENT HANDLERS

  // Render project items
  const renderItem = ({item, drag, isActive}) => { 
    return (
      <ScaleDecorator>
        <SwipeableItem
          onChange={(state) => {
            console.log(state);
          }}
          renderUnderlayLeft={() => <DeleteUnderlay deleteItem={handleDelete} itemId={item.project_id}/>}
          snapPointsLeft={[150]}
        >
          <TouchableOpacity 
            onPress={() => handlePress(item)}
            onLongPress={drag}
            disabled={isActive}
          >
            <View style={styles.horizontalListContainer}>
              <View>
                <Text>{item.project_name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableItem>
      </ScaleDecorator>
    );
  };

  // Handle drag-and-drop re-ordering
  const updateProjectOrder = async (data) => {
    setProjects(data);
    try {
        await updateProjectNumbers(db, data);
    } catch (error) {
        console.log('Error updating project order in the database: ', error);
    }
  };

  // Handle item presses
  const handlePress = (item) => {
    console.log('Item pressed:', item);
    navigation.navigate('Models', item.project_id);
  }
  
  // Handle delete presses
  const handleDelete = async (db, projectId) => {
    try {
      await deleteProject(db, projectId);
      // After project is deleted successfully, get a fresh pull of projects
      await getProjects();
    } catch (error) {
      console.log('Error deleting projects: ', error);
    }
  };

  // LIFECYCLE FUNCTIONS

  // Get projects from the database and put in state
  const getProjects = async () => {
      try {
        setProjects(await getAllProjects(db));
      } catch (error) {
        console.log('Error retrieving projects:', error);
      }
  };

  // On focus, retrieve current data from the projects table
  useEffect(() => {
    if (isFocused) {
      getProjects();
    }
  },[isFocused]);

  // COMPONENT RETURN

  return (
    <SlayerList 
      data={projects}
      updateListOrder={updateProjectOrder}
      keyExtractor={(item) => item.project_id}
      renderItem={renderItem}
      addForm={'Add Project'}
      //parentId={projectId}
      item={'Project'}
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

export default Projects;
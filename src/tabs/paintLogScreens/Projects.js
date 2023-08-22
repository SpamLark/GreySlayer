import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllProjects } from '../../services/paintLogServices';


const Projects = () => {
    
    // Declare is focused to hold focus state of the screen
    const isFocused = useIsFocused();

    //Declare navigation to support stack navigation
    const navigation = useNavigation();

    // Use shared database connection
    const db = useDatabase();

    // Declare state variable to hold projects
    const [projects, setProjects] = useState();

    // Used by FlashList of projects to control display and behaviour
    const renderItem = ({item}) => { 
        const handlePress = () => {
              console.log('Item pressed:', item);
              navigation.navigate('Models', item.project_id);
          }
          return (
              <TouchableOpacity onPress={handlePress}>
                <View style={styles.horizontalListContainer}>
                  <View>
                    <Text>{item.project_name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
          );
      };

    // Get projects from the database and put it in state
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

    return (
        <View style={styles.container}>
          <View style={styles.flashlistContainer}>
            <FlashList 
                data={projects}
                renderItem={renderItem}
                estimatedItemSize={200}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={()=> navigation.navigate('Add Project')}
            >
              <Text style={styles.buttonText}>Add Project</Text>
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

export default Projects;
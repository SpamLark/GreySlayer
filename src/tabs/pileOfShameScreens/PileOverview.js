import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import React, { useState, useEffect, useCallback } from 'react';
import { getAllCurrentPileOfShameEntries } from '../../services/pileOfShameServices';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';




const PileOverview = () => {

  // Declare is focused to hold focus state of the screen
  const isFocused = useIsFocused();

  //Declare navigation to support stack navigation
  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variable to hold current pile of shame items
  const [pileItems, setPileItems] = useState();

  const renderItem = ({item}) => { 
    
    const handlePress = () => {
          console.log('Item pressed:', item);
          navigation.navigate('View Entry', {item});
      }
      
      return (
          <TouchableOpacity onPress={handlePress}>
            <View style={styles.horizontalListContainer}>
              <View>
                <Text>{item.kit_name}</Text>
              </View>
              <View>
                <Text>£{(item.kit_value).toFixed(2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
      );
  };

  // Gets the current pile of shame entries from the database and puts it in state
  const getCurrentPile = async () => {
    try {
      setPileItems(await getAllCurrentPileOfShameEntries(db));
    } catch (error) {
      console.log('Error retrieving pile of shame entries:', error);
    }
  };

  // On focus, retrieve current data from the model_kits table
  useEffect(() => {
    if (isFocused) {
      getCurrentPile();
    }
  },[isFocused]);


    return (
      <View style={styles.container}>
        <View style={styles.flashlistContainer}>
          <FlashList 
              data={pileItems}
              renderItem={renderItem}
              estimatedItemSize={200}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={()=> navigation.navigate('Add Entry')}
          >
            <Text style={styles.buttonText}>Add Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

  export default PileOverview;
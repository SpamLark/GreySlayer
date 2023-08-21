import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import React, { useState, useEffect, useCallback } from 'react';
import { getAllCurrentPileOfShameEntries } from '../../services/pileOfShameServices';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation } from '@react-navigation/native';


const renderItem = ({item}) => { 
    const handlePress = () => {
        console.log('Item pressed:', item);
    }
    
    return (
        <TouchableOpacity onPress={handlePress}>
            <Text>{item.kit_name}</Text>
            <Text>{item.num_models}</Text>
            <Text>{item.kit_value}</Text>
        </TouchableOpacity>
    );
}

const PileOverview = () => {

  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variable to hold current pile of shame items
  const [pileItems, setPileItems] = useState();

  // On initial render, retrieve data from 
  useEffect(() => {
    (async () => {
      try {
        setPileItems(await getAllCurrentPileOfShameEntries(db));
      } catch (error) {
        console.log('Error retrieving pile of shame entries:', error);
      }
    })();
  },[]);


    return (
      <View style={styles.container}>
        <View style={styles.flashlistContainer}>
          <FlashList 
              data={pileItems}
              renderItem={renderItem}
              estimatedItemSize={200}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: 'gray' }} />}
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
    buttonContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0
    },
    flashlistContainer: {
      height: '70%',
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
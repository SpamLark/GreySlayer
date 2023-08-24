import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { getAllCurrentPileOfShameEntries, getTotalPileValue, deleteKit, updateKitNumbers } from '../../services/pileOfShameServices';
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import SlayerList from '../../components/SlayerList';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem from 'react-native-swipeable-item';
import DeleteUnderlay from '../../components/DeleteUnderlay';


const PileOverview = () => {

  // Declare is focused to hold focus state of the screen
  const isFocused = useIsFocused();

  //Declare navigation to support stack navigation
  const navigation = useNavigation();

  // Use shared database connection
  const db = useDatabase();

  // Declare state variable to hold current pile of shame items
  const [pileItems, setPileItems] = useState([]);

  // EVENT HANDLERS

  // Render model kit items
  const renderItem = ({item, drag, isActive}) => { 
    return (
      <ScaleDecorator>
        <SwipeableItem
          onChange={(state) => {
            console.log(state);
          }}
          renderUnderlayLeft={() => <DeleteUnderlay deleteItem={handleDelete} itemId={item.kit_id}/>}
          snapPointsLeft={[150]}
        >
          <TouchableOpacity 
            onPress={() => handlePress(item)}
            onLongPress={drag}
            disabled={isActive}
          >
            <View style={styles.horizontalListContainer}>
              <View>
                <Text style={styles.listItem}>{item.kit_name}</Text>
              </View>
              <View>
                <Text style={styles.listItem}>£{(item.kit_value).toFixed(2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableItem>
      </ScaleDecorator>
    );
  };

  // Handle drag-and-drop re-ordering
  const updatePileOrder = async (data) => {
    setPileItems(data);
    try {
        await updateKitNumbers(db, data);
    } catch (error) {
        console.log('Error updating kit order in the database: ', error);
    }
  };

  // Handle item presses
  const handlePress = (item) => {
    console.log('Item pressed:', item);
    navigation.navigate('View Entry', item);
  }
  
  // Handle delete presses
  const handleDelete = async (db, kitId) => {
    try {
      await deleteKit(db, kitId);
      // After kit is deleted successfully, get a fresh pull of kits
      await getCurrentPile();
    } catch (error) {
      console.log('Error deleting model kit: ', error);
    }
  };

  // LIFECYCLE FUNCTIONS

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

  // COMPONENT RETURN

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <SlayerList 
          data={pileItems}
          updateListOrder={updatePileOrder}
          keyExtractor={(item) => item.kit_id}
          renderItem={renderItem}
          addForm={'Add Entry'}
          //parentId={projectId}
          item={'ENTRY'}
          
        />
      </View>
    </View>
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
    backgroundColor: '#636363',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
    marginHorizontal: 2,
    height: 50,
    padding: 10,
    borderWidth: 1,
  },
  listItem: {
    fontFamily: 'agdasima-regular',
    fontSize: 22,
    color: '#fff'
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

export default PileOverview;
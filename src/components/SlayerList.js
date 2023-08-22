import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { useDatabase } from '../../services/database/DatabaseContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllRecipeSteps, updateStepNumbers } from '../../services/paintLogServices';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeableItem from 'react-native-swipeable-item';
import UnderlayLeft from '../../components/UnderlayLeft';

const SlayerList = ({data}, {keyExtractor}, {renderItem}, {addForm}, {parentId}, {item}) => {

return (
    <View style={styles.container}>
      <View style={styles.flashlistContainer}>
        <GestureHandlerRootView>
            <DraggableFlatList 
                data={data}
                onDragEnd={({data}) => updateStepOrder(data)}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                activationDistance={20}
            />
        </GestureHandlerRootView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={()=> navigation.navigate({addForm}, {parentId})}
        >
          <Text style={styles.buttonText}>Add {item}</Text>
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
    },
    underlayLeft: {
      flex: 1,
      backgroundColor: 'tomato',
      justifyContent: 'flex-end',
    },
  });

export default SlayerList;
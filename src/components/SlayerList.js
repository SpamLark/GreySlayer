import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from '@ui-kitten/components';

const SlayerList = ({data, keyExtractor, renderItem, addForm, parentId, item, updateListOrder, statDisplay}) => {

const navigation = useNavigation();

return (
    <View style={styles.container}>
      <View style={styles.flashlistContainer}>
        <GestureHandlerRootView>
            <DraggableFlatList 
                data={data}
                onDragEnd={({data}) => updateListOrder(data)}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                activationDistance={20}
            />
        </GestureHandlerRootView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={()=> navigation.navigate(addForm, parentId)}
        >
          <Text style={styles.buttonText}>ADD {item}</Text>
        </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statsButton, {display: statDisplay}]}
            onPress={()=> navigation.navigate('View Statistics')}
          >
            <Icon name="bar-chart-outline" height={30} width={30} fill='#fff' />
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
      backgroundColor: '#cc0e2b',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 2,
      marginHorizontal: 2,
      height: 50,
      padding: 10,
      borderWidth: 1
    },
    buttonContainer: {
      flex: 2,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,
      flexDirection: 'row'
    },
    flashlistContainer: {
      flex: 8,
      backgroundColor: '#fff',
      borderBottomWidth:1,
      borderTopWidth: 1,
      borderColor: '#8a8686'
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      //marginVertical: 20,
      borderRadius: 5,
      backgroundColor: '#cc0e2b',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statsButton: {
      paddingVertical: 2,
      paddingHorizontal: 2,
      //marginVertical: 20,
      borderRadius: 5,
      backgroundColor: '#cc0e2b',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText: {
      color: '#fff',
      fontSize: 24,
      marginHorizontal: 5,
      fontFamily: 'agdasima-bold'
    },
    underlayLeft: {
      flex: 1,
      backgroundColor: 'tomato',
      justifyContent: 'flex-end',
    },
  });

export default SlayerList;
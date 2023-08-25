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
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={()=> navigation.navigate(addForm, parentId)}
        >
          {/* <Text style={styles.buttonText}>ADD {item}</Text> */}
          <Icon name="plus-square-outline" height={50} width={50} fill='#bf0025' />
        </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, {display: statDisplay}]}
            onPress={()=> navigation.navigate('View Statistics')}
          >
            <Icon name="trending-up-outline" height={50} width={50} fill='#bf0025' />
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
    flashlistContainer: {
      flex: 8,
      backgroundColor: '#fff',
      // borderBottomWidth:1,
      // borderTopWidth: 1,
      borderColor: '#8a8686',
      paddingTop: 10
    },
    actionContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
    },
    button: {
      paddingVertical: 2,
      paddingHorizontal: 2,
      //marginVertical: 20,
      borderRadius: 10,
      backgroundColor: '#fff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 70,
      width: 70
    },
    statsButton: {
      paddingVertical: 2,
      paddingHorizontal: 2,
      //marginVertical: 20,
      borderRadius: 5,
      backgroundColor: '#fff',
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
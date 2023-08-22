import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const UnderlayLeft = () => {
return (
    <View style={[styles.horizontalListContainer, styles.underlayLeft]}>
    <TouchableOpacity onPress={() => console.log('DELETE STEP')}>
        <Text>DELETE</Text>
    </TouchableOpacity>
    </View>
);
};

export default UnderlayLeft;

const styles = StyleSheet.create({
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
underlayLeft: {
    flex: 1,
    backgroundColor: 'tomato',
    justifyContent: 'flex-end',
},
});
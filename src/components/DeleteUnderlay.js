import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDatabase } from '../services/database/DatabaseContext';

const DeleteUnderlay = ({deleteItem, itemId}) => {
    // Use shared database connection
    const db = useDatabase();

    return (
        <View style={[styles.horizontalListContainer, styles.underlayLeft]}>
        <TouchableOpacity onPress={() => deleteItem(db, itemId)}>
            <Text>DELETE</Text>
        </TouchableOpacity>
        </View>
    );
};

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

export default DeleteUnderlay;
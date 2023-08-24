import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDatabase } from '../services/database/DatabaseContext';

const DeleteUnderlay = ({deleteItem, itemId}) => {
    // Use shared database connection
    const db = useDatabase();

    return (
        <View style={[styles.horizontalListContainer, styles.underlayLeft]}>
        <TouchableOpacity onPress={() => deleteItem(db, itemId)}>
            <Text style={styles.deleteText}>DELETE</Text>
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
    marginVertical: 5,
    marginHorizontal: 10,
    height: 50,
    padding: 10,
    borderRadius: 10
},
underlayLeft: {
    flex: 1,
    backgroundColor: '#cc0e2b',
    justifyContent: 'flex-end',
},
deleteText: {
    fontFamily: 'agdasima-bold',
    color: '#fff',
    fontSize: 18
}
});

export default DeleteUnderlay;
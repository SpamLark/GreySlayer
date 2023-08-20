import {View, Text, StyleSheet} from 'react-native';
import React, { useState, useEffect } from 'react';
import { getAllCheckIns } from '../services/database';
import { useDatabase } from '../services/database/DatabaseContext';

const Tracker = () => {

  // Use shared database connection
  const db = useDatabase();

  // Declare state variable checkIns to hold array of checkIn dates
  const [checkIns, setCheckIns] = useState([]);

  // Retrieve checkIns from database on initial component load
  useEffect(() => {
    (async () => {
      try {
        const currentCheckIns = await getAllCheckIns(db);
        setCheckIns(currentCheckIns);
      } catch (error) {
        console.log('This is the error', error);
      }
    })();
  }, []);

  // Print every checkIn date to console when checkIns is updated
  useEffect(() => {
    checkIns.map((checkIn) => {
      console.log(checkIn.check_in_date);
    })
  }, [checkIns]);

  return (
    <View style={styles.container}>
      <Text>The Tracker</Text>
      {/* Iterate over check-ins and display each check-in in a text component on screen */}
      {checkIns.map((checkIn) => {
          return (<Text key={checkIn.check_in_id}>{checkIn.check_in_date}</Text>)
        })}
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0
},
});

export default Tracker;
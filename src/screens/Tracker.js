import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { getAllCheckIns } from '../services/database';
import { useDatabase } from '../services/database/DatabaseContext';
//import CalendarListScreen from '../components/CalendarListSceen';
import { CalendarList } from 'react-native-calendars';
import { insertCheckIn, deleteCheckIn, todaysDate } from '../services/database';

const Tracker = () => {

  // Use shared database connection
  const db = useDatabase();

  // Declare state variable checkIns to hold array of checkIn dates
  const [checkIns, setCheckIns] = useState([]);

  // Declare empty object to receive formatted markedDates for the calendar
  const [markedDates, setMarkedDates] = useState({});

  // Decalre current date for calendar focus using state to prevent calendar jumping when checkin is added / removed
  const [focusDate, _] = useState(new Date());

  // Define onDayPress behaviour
  const onDayPress = useCallback(async (day) => {
    // Check if pressed date has been checked in or not
    const dateHasCheckIn = checkIns.some(checkIn => checkIn.check_in_date === day.dateString);
      try {
          if (dateHasCheckIn) {
            console.log(day.dateString, 'is in the array of checkIns');
            await deleteCheckIn(db, day.dateString);
          }
          // Update the check-ins state after the delete operation
          const currentCheckIns = await getAllCheckIns(db);
          setCheckIns(currentCheckIns);
      } catch (error) {
        console.log(error)
      }
  }, [checkIns]);

  // Retrieve checkIns from database on initial component load
  useEffect(() => {
    (async () => {
      try {
        setCheckIns(await getAllCheckIns(db));
        //console.log(checkIns);
      } catch (error) {
        console.log('This is the error', error);
      }
    })();
  }, []);

  // Populate the markedDates object with the dates from checkIns whenever checkIns updates
  useEffect(() => {
    const newMarkedDates = {};
    checkIns.forEach((checkIn) => {
      newMarkedDates[checkIn.check_in_date] = {selected: true, marked: true, selectedColor: 'red'};
    });
    setMarkedDates(newMarkedDates)
  }, [checkIns]);

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        {/*It's really important to set current for the CalendarList so that it renders quickly and avoids looking janky*/}
          <CalendarList markedDates={markedDates} current={focusDate} onDayPress={onDayPress}/>
      </View>
      <TouchableOpacity 
            style={styles.button}
            onPress={
              async() => {
                try {
                await insertCheckIn(db, todaysDate());
                setCheckIns(await getAllCheckIns(db));
                } catch (error) {
                  console.log(error);
                }
              }
            }
        >
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
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
calendarContainer: {
  height: '60%'
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

export default Tracker;
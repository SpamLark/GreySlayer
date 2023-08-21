import {View, Text, StyleSheet, TouchableOpacity, Animated, Alert} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { getAllCheckIns } from '../services/checkInServices';
import { useDatabase } from '../services/database/DatabaseContext';
//import CalendarListScreen from '../components/CalendarListSceen';
import { CalendarList } from 'react-native-calendars';
import { insertCheckIn, deleteCheckIn, todaysDate } from '../services/checkInServices';

const Tracker = () => {

  // Use shared database connection
  const db = useDatabase();

  // Grab todays date using the helper function from services
  const today = todaysDate();

  // Declare state variable checkIns to hold array of checkIn dates
  const [checkIns, setCheckIns] = useState([]);

  // Declare empty object to receive formatted markedDates for the calendar display
  const [markedDates, setMarkedDates] = useState({});

  // Declare state variable to track whether user has checked in today
  const [checkedInToday, setCheckedInToday] = useState(false);

  // Show alert dialogue confirming delete
  const showDeleteAlert = (dateString) => {
    Alert.alert(
      'Delete Check-in',
      'Are you sure you want to delete this check-in: ' + dateString,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: async () => {
          // If user confirms deletion, attempt to delete the check-in
          await handleDelete(dateString);
        }}
      ],
      {cancelable: false}
    )
  }

  // Handle the deletion of check-in identified from a date string
  const handleDelete = async (dateString) => {
    // Attempt the deletion
    try {
      await deleteCheckIn(db, dateString);
      // Refresh check-ins with a fresh pull of check-in data
      setCheckIns(await getAllCheckIns(db));
      // If deleted value was today, set checkedInToday back to false to re-enable the check-in button
      if (dateString === today) {
        setCheckedInToday(false);
      }
    } catch (error) {
      console.log('Error whilst deleting checkin:', error);
    }
  };

  // Define onDayPress behaviour
  const onDayPress = useCallback(async (day) => {
    // Check if pressed date has been checked in or not
    const dateHasCheckIn = checkIns.some(checkIn => checkIn.check_in_date === day.dateString);
    // If the date has been checked in, start the delete sequence
    if (dateHasCheckIn) {
        showDeleteAlert(day.dateString);
      }
  }, [checkIns]);

  // Retrieve checkIns from database on initial component load
  useEffect(() => {
    (async () => {
      try {
        setCheckIns(await getAllCheckIns(db));
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
          <CalendarList markedDates={markedDates} current={today} onDayPress={onDayPress}/>
      </View>
      <View style={styles.container}>
        {!checkedInToday ? (
          <TouchableOpacity 
            style={styles.button}
            onPress={
              async() => {
                try {
                  await insertCheckIn(db, today);
                  setCheckIns(await getAllCheckIns(db));
                  setCheckedInToday(true);
                } catch (error) {
                  console.log(error);
                }
              }
            }
          >
            <Text style={styles.buttonText}>Check In</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text>Congratulations!</Text>
            <Text>You checked in today</Text>
          </>
        )
        }
      </View>
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
}
});

export default Tracker;
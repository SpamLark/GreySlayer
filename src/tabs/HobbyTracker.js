import {View, Text, StyleSheet, TouchableOpacity, Animated, Alert} from 'react-native';
import React, { useState, useEffect, useCallback, Component, } from 'react';
import { getAllCheckIns } from '../services/checkInServices';
import { useDatabase } from '../services/database/DatabaseContext';
//import CalendarListScreen from '../components/CalendarListSceen';
import { CalendarList } from 'react-native-calendars';
import { insertCheckIn, deleteCheckIn, todaysDate, getCurrentHobbyStreak } from '../services/checkInServices';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from '@ui-kitten/components';

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

  //Declare state variable to hold hobbystreak
  const [hobbyStreak, setHobbyStreak] = useState(0);

  // Declare is focused to hold focus state of the screen
  const isFocused = useIsFocused();

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

  const getStreak = async () => {
    try {
      const currentStreak = ((await getCurrentHobbyStreak(db))[0].MaxConsecutiveCount);
      setHobbyStreak(currentStreak);
    } catch (error) {
      console.log('Error obtaining current streak', error)
    }
  };

  // Retrieve checkIns and hobby streak from database on focus
  useEffect(() => {
    if (isFocused) {
      (async () => {
        try {
          setCheckIns(await getAllCheckIns(db));
        } catch (error) {
          console.log('Error retrieving check in data from database: ', error);
        }
      })();
    }
  }, [isFocused]);

  // Populate the markedDates object and hobby streak variable whenever checkIns updates
  useEffect(() => {
    const newMarkedDates = {};
    checkIns.forEach((checkIn) => {
      newMarkedDates[checkIn.check_in_date] = {selected: true, marked: true, selectedColor: '#cc0e2b'};
    });
    setMarkedDates(newMarkedDates);
    getStreak();
    const alreadyCheckedInToday = checkIns.some(checkIn => checkIn.check_in_date === today);
    if (alreadyCheckedInToday) {
      setCheckedInToday(true);
    };
  }, [checkIns]);

  const theme = {
    'stylesheet.day.basic': {
      text:{
        fontFamily: 'agdasima-regular',
        fontSize: 18,
      },
      todayText:{
        color:'#636363'
      }
    },
    'stylesheet.calendar.header': {
      dayHeader:{
        fontFamily: 'agdasima-bold',
        fontSize: 22,
      },
      monthText:{
        fontFamily: 'agdasima-bold',
        fontSize: 26
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        {/*It's really important to set current for the CalendarList so that it renders quickly and avoids looking janky*/}
          <CalendarList markedDates={markedDates} current={today} onDayPress={onDayPress} theme={theme} markingType={'custom'}/>
      </View>
      <View style={styles.actionContainer}>
        {!checkedInToday ? (
          <TouchableOpacity 
            style={styles.button}
            onPress={
                (async () => {
                  try {
                    await insertCheckIn(db, today);
                    await getStreak();
                    setCheckIns(await getAllCheckIns(db));
                  } catch (error) {
                    console.log(error);
                  }
                })
              }
          >
            <Icon name="checkmark-outline" fill='white' height={50} width={50}/>
          </TouchableOpacity>
        ) : (
          <>
            <Icon name="checkmark-circle-outline" height={40} width={40} fill='#8a8686' />
            <Text style={styles.congratulationsText}>Congratulations! Your current hobby streak is</Text>
            <Text style={styles.hobbyStreakText}>{hobbyStreak}</Text>
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
  flex: 8,
  borderBottomWidth:1,
  borderTopWidth: 1,
  borderColor: '#8a8686'
},
actionContainer: {
  flex: 2,
  alignItems: 'center',
  justifyContent: 'center',
},
button: {
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
congratulationsText: {
  fontFamily: 'agdasima-regular',
  fontSize:20,
},
hobbyStreakText: {
  fontFamily: 'agdasima-bold',
  fontSize: 28,
}
});

export default Tracker;
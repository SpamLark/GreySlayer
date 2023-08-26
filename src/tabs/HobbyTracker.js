import {View, Text, StyleSheet, TouchableOpacity, Animated, Alert, Button, Image, Modal, Pressable, TouchableWithoutFeedback} from 'react-native';
import React, { useState, useEffect, useCallback, Component, } from 'react';
import { getAllCheckIns } from '../services/checkInServices';
import { useDatabase } from '../services/database/DatabaseContext';
//import CalendarListScreen from '../components/CalendarListSceen';
import { CalendarList } from 'react-native-calendars';
import { insertCheckIn, deleteCheckIn, todaysDate, getCurrentHobbyStreak, insertImageUri } from '../services/checkInServices';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const Tracker = () => {

  // Use shared database connection
  const db = useDatabase();

  // Grab todays date using the helper function from services
  const today = todaysDate();

  // Declare state variable checkIns to hold array of checkIn objects
  const [checkIns, setCheckIns] = useState([]);

  // Declare empty object to receive formatted markedDates for the calendar display
  const [markedDates, setMarkedDates] = useState({});

  // Declare state variable to track whether user has checked in today
  const [checkedInToday, setCheckedInToday] = useState(false);

  // Declare state variable to hold hobbystreak
  const [hobbyStreak, setHobbyStreak] = useState(0);

  // Declare state for viewed photo
  const [viewImagePath, setViewImagePath] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  // Declare is focused to hold focus state of the screen
  const isFocused = useIsFocused();

  // EVENT HANDLERS

  // Check in image picker function
  const pickImage = async (photoDate) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUriParts = result.assets[0].uri.split('.');
      const extension = imageUriParts[imageUriParts.length - 1];
      const newImageName = `checkInImage_${Date.now()}.${extension}`;
      try {
        const fileUri = `${FileSystem.documentDirectory}${newImageName}`;
        console.log(fileUri);
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: fileUri,
        });
        await addImageUriToDatabase(fileUri, photoDate);
        setCheckIns(await getAllCheckIns(db));
      } catch (error) {
        console.log('Error copying image to file system', error);
      }

    }
  };

  // Helper function add image URI to check-ins table
  const addImageUriToDatabase = async (fileUri, photoDate) => {
    try {
      await insertImageUri(db, fileUri, photoDate);
    } catch (error) {
      console.log('Error adding file path to check in table', error);
    }
  }

  // Handle day press
  const onDayPress = (date) => {
    const datePressed = (date.dateString);
    const foundCheckIn = checkIns.find(checkIn => checkIn.check_in_date === datePressed);
    if(foundCheckIn && foundCheckIn.photo_path) {
      console.log(foundCheckIn.photo_path);
      setViewImagePath(foundCheckIn.photo_path)
      setModalVisible(true);
    }
    else if (foundCheckIn) {
      pickImage(datePressed);
    }
  }

  // Handle long day press
  const onDayLongPress = useCallback(async (day) => {
    // Check if pressed date has been checked in or not
    const dateHasCheckIn = checkIns.some(checkIn => checkIn.check_in_date === day.dateString);
    // If the date has been checked in, start the delete sequence
    if (dateHasCheckIn) {
        showDeleteAlert(day.dateString);
      }
  }, [checkIns]);

  // Show alert dialogue confirming delete of check-in
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

  // LIFECYCLE FUNCTIONS

  // Get hobby streak data
  const getStreak = async () => {
    try {
      const currentStreak = ((await getCurrentHobbyStreak(db))[0].MaxConsecutiveCount);
      setHobbyStreak(currentStreak);
    } catch (error) {
      console.log('Error obtaining current streak', error)
    }
  };

  // Retrieve checkIns on focus
  useEffect(() => {
    if (isFocused) {
      (async () => {
        try {
          setCheckIns(await getAllCheckIns(db));
          console.log(checkIns);
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
      if (checkIn.photo_path) {
        newMarkedDates[checkIn.check_in_date] = {selected: true, marked: true, selectedColor: '#cc0e2b'};
      } else {
        newMarkedDates[checkIn.check_in_date] = {selected: true, marked: false, selectedColor: '#cc0e2b'};
      }
      
    });
    setMarkedDates(newMarkedDates);
    getStreak();
    const alreadyCheckedInToday = checkIns.some(checkIn => checkIn.check_in_date === today);
    if (alreadyCheckedInToday) {
      setCheckedInToday(true);
    };
  }, [checkIns]);

  // COMPONENT RETURN

  return (
    
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        {/*It's really important to set current for the CalendarList so that it renders quickly and avoids looking janky*/}
          <CalendarList 
            markedDates={markedDates} 
            current={today} 
            onDayLongPress={onDayLongPress} 
            onDayPress={(date)=>onDayPress(date)} 
            theme={theme} 
            markingType={'custom'}
          />
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)} accessible={false}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Image source={{ uri: viewImagePath }} style={styles.checkInImage} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
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
              <Icon name="checkmark-square-2-outline" fill='#bf0025' height={50} width={50}/>
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

// STYLE

// Calendar Themeing
const theme = {
  backgroundColor: '#fffbff',
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
};

// Stylesheet
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
  borderColor: '#8a8686',
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
  borderRadius: 10,
  backgroundColor: '#fff',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: 70,
  width: 70
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
},
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 5,
},
modalView: {
  margin: 20,
  backgroundColor: '#857372',
  borderRadius: 15,
  padding: 15,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
checkInImage: {
  width: 320, 
  height: 320, 
  borderRadius: 15 
}
});

export default Tracker;
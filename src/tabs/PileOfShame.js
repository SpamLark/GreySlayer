import {View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PileOverview from './pileOfShameScreens/PileOverview';
import PileAddEntryForm from './pileOfShameScreens/PileAddEntryForm';
import PileViewEntry from './pileOfShameScreens/PileViewEntry';
import PileStatistics from './pileOfShameScreens/PileStatistics';

const Stack = createNativeStackNavigator();

const PileOfShame = () => {
  return (
    <Stack.Navigator
      options={{headerTintColor: '#cc0e2b'}}
    >
      <Stack.Screen 
        name="Pile Overview"
        component={PileOverview}
        options={{title:'Pile of Shame', headerShown: false}}
      />
      <Stack.Screen
        name="Add Entry"
        component={PileAddEntryForm}
        options={{title:'Add Pile Entry', headerTintColor: '#cc0e2b'}}
      />
      <Stack.Screen
        name="View Entry"
        component={PileViewEntry}
        options={{title:'View Pile Entry', headerTintColor: '#cc0e2b'}}
      />
      <Stack.Screen
        name="View Statistics"
        component={PileStatistics}
        options={{title:'View Pile Statistics', headerTintColor: '#cc0e2b'}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0
  }
});

export default PileOfShame;
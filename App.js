import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Tracker from './src/tabs/HobbyTracker';
import Shame from './src/tabs/PileOfShame';
import PaintLog from './src/tabs/PaintLog';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DatabaseProvider } from './src/services/database/DatabaseContext';
import createTables from './src/services/database/createTables';
import * as SQLite from 'expo-sqlite';
import { IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Icon } from '@ui-kitten/components';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';


const Tab = createBottomTabNavigator();

// Open database
const db = SQLite.openDatabase('greyslayer.db');
// Ensure foreign keys are enabled
db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
    console.log('Foreign keys turned on')
);

createTables(db);

export default function App() {
  const [fontsLoaded, fontSources] = useFonts({
    // The name you'll use in styles: the path to the font file
    'odachi': require('./assets/Odachi.ttf'),
    'agdasima-bold': require('./assets/Agdasima-Bold.ttf'),
    'agdasima-regular': require('./assets/Agdasima-Regular.ttf')
  });

  console.log('Fonts Loaded:', fontsLoaded);
  console.log('Loaded Fonts:', fontSources);

  if (!fontsLoaded) {
    return (<Text>Loading</Text>)
  }

  
  return (
    <>
    <IconRegistry icons={EvaIconsPack} />
    <DatabaseProvider>
      <NavigationContainer styles={styles.container}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#bf0025',
            tabBarInactiveTintColor: '#534342',
            tabBarLabelStyle: {
              //fontFamily: 'odachi',
              //fontSize: 18
              display: 'none'
            },
            headerTitleStyle: {
              fontFamily: 'agdasima-bold',
              fontSize: 36,
              color: '#fff'
            },
            headerStyle: {
              backgroundColor: '#bf0025'
            },
            tabBarStyle: {
              backgroundColor: '#f4dddc'
            }
          }}
        >
          <Tab.Screen 
            name="HOBBY TRACKER" 
            component={Tracker} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="calendar-outline" fill={color} style={{width: size, height: size}} />
              )
            }}
          />
          <Tab.Screen 
            name="PILE OF SHAME" 
            component={Shame}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="archive-outline" fill={color} style={{width: size, height: size}} />
              ),
            }}
          />         
          <Tab.Screen 
            name="PAINT LOG" 
            component={PaintLog}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="brush-outline" fill={color} style={{width: size, height: size}} />
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      {/* <StatusBar style="auto" /> */}
    </DatabaseProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

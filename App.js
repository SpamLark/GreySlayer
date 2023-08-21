import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Tracker from './src/screens/Tracker';
import Shame from './src/screens/Shame';
import PaintLog from './src/screens/PaintLog';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DatabaseProvider } from './src/services/database/DatabaseContext';
import createTables from './src/services/database/createTables';
import * as SQLite from 'expo-sqlite';

const Tab = createBottomTabNavigator();

// Open database
const db = SQLite.openDatabase('greyslayer.db');
// Ensure foreign keys are enabled
db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
    console.log('Foreign keys turned on')
);

createTables(db);

export default function App() {

  return (
    <DatabaseProvider>
      <NavigationContainer styles={styles.container}>
        <Tab.Navigator>
          <Tab.Screen name="Shame" component={Shame} />
          <Tab.Screen name="Tracker" component={Tracker} />
          <Tab.Screen name="Log" component={PaintLog} />
        </Tab.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
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

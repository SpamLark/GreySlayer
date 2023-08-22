import {View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Projects from './paintLogScreens/Projects';
import Models from './paintLogScreens/Models';
import Recipes from './paintLogScreens/Recipes';
import Steps from './paintLogScreens/Steps';

const Stack = createNativeStackNavigator();

const PaintLog = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Projects"
        component={Projects}
        options={{title:'Projects', headerShown: false}}
      />
      <Stack.Screen
        name="Models"
        component={Models}
        options={{title:'Models'}}
      />
      <Stack.Screen
        name="Recipes"
        component={Recipes}
        options={{title:'Recipes'}}
      />
      <Stack.Screen
        name="Steps"
        component={Steps}
        options={{title:'Steps'}}
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
  },
});

export default PaintLog;
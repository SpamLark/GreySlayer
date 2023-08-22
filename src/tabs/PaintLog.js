import {View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Projects from './paintLogScreens/Projects';
import Models from './paintLogScreens/Models';
import Recipes from './paintLogScreens/Recipes';
import Steps from './paintLogScreens/Steps';
import ProjectAddEntryForm from './paintLogScreens/ProjectAddEntryForm';
import ModelAddEntryForm from './paintLogScreens/ModelAddEntryForm';

const Stack = createNativeStackNavigator();

const PaintLog = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Projects"
        component={Projects}
        options={{title:'Projects'}}
      />
      <Stack.Screen
        name="Add Project"
        component={ProjectAddEntryForm}
        options={{title:'Add New Project'}}
      />
      <Stack.Screen
        name="Models"
        component={Models}
        options={{title:'Models'}}
      />
      <Stack.Screen
        name="Add Model"
        component={ModelAddEntryForm}
        options={{title:'Add New Model'}}
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
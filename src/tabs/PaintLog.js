import {View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Projects from './paintLogScreens/Projects';
import Models from './paintLogScreens/Models';
import Recipes from './paintLogScreens/Recipes';
import Steps from './paintLogScreens/Steps';
import ProjectAddEntryForm from './paintLogScreens/ProjectAddEntryForm';
import ModelAddEntryForm from './paintLogScreens/ModelAddEntryForm';
import RecipeAddEntryForm from './paintLogScreens/RecipeAddEntryForm';
import StepAddEntryForm from './paintLogScreens/StepAddEntryForm';

const Stack = createNativeStackNavigator();

const PaintLog = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Projects"
        component={Projects}
        options={{
          title:'Projects',
          headerTintColor: '#cc0e2b', 
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'agdasima-bold',
            fontSize: 20
          }
        }}
      />
      <Stack.Screen
        name="Add Project"
        component={ProjectAddEntryForm}
        options={{
          title:'Add New Project',
          headerTintColor: '#cc0e2b', 
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'agdasima-bold',
            fontSize: 20
          }
        }}
      />
      <Stack.Screen
        name="Models"
        component={Models}
        options={{
          title:'Models',
          headerTintColor: '#cc0e2b', 
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'agdasima-bold',
            fontSize: 20
          }
        }}
      />
      <Stack.Screen
        name="Add Model"
        component={ModelAddEntryForm}
        options={{
          title:'Add New Model',
          headerTintColor: '#cc0e2b', 
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'agdasima-bold',
            fontSize: 20
          }
        }}
      />
      <Stack.Screen
        name="Recipes"
        component={Recipes}
        options={{
          title:'Recipes',
          headerTintColor: '#cc0e2b', 
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'agdasima-bold',
            fontSize: 20
          }
        }}
      />
      <Stack.Screen
        name="Add Recipe"
        component={RecipeAddEntryForm}
        options={{
          title:'Add New Recipe',
          headerTintColor: '#cc0e2b', 
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'agdasima-bold',
            fontSize: 20
          }
        }}
      />
      <Stack.Screen
        name="Steps"
        component={Steps}
        options={{
          title:'Steps',
          headerTintColor: '#cc0e2b', 
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'agdasima-bold',
            fontSize: 20
          }
        }}
      />
      <Stack.Screen
        name="Add Step"
        component={StepAddEntryForm}
        options={{
          title:'Add New Step',
          headerTintColor: '#cc0e2b', 
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'agdasima-bold',
            fontSize: 20
          }
        }}
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
import {View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox} from 'react-native';

const PaintLog = ({projects}) => {
    return (
      <View style={styles.container}>
        <Text>The Paint Log</Text>
        <Text>{projects}</Text>
      </View>
    )
  }

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
import {View, Text, Image, ScrollView, TextInput, StyleSheet, LogBox} from 'react-native';

const Shame = () => {
    return (
      <View style={styles.container}>
        <Text>The Shame</Text>
      </View>
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

  export default Shame;
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import KeyboardAvoidingTextInput from './FlexibleTextComponent';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{marginTop: 80}}>Here's an example of keyboard-aware text inputs!</Text>
      <Image source={require('./assets/icon.png')} style={{width: Dimensions.get("screen").width - 100, height: Dimensions.get("screen").width - 150, marginTop: 20}} />
      <KeyboardAvoidingTextInput placeholder={"first one"} style={styles.textField} />
      <KeyboardAvoidingTextInput placeholder={"second one"} style={styles.textField} />
      <KeyboardAvoidingTextInput placeholder={"third one"} style={styles.textField} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'flex-start',
  },
  textField: {
    width: Dimensions.get("screen").width - 100,
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    marginTop: 20,
    paddingLeft: 10,
    backgroundColor: "white",
  }
});

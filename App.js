import { StyleSheet, Text, View, StatusBar } from 'react-native';
import MusicPlayer from './components/MusicPlayer.jsx'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MusicPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
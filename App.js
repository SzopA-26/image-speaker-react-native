import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Home from './components/Home';
import Menu from './components/Menu';

export default App = () => {
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.container]}>
        <Home/>
      </View>
      <View style={[styles.menu]}>
        <Menu/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 8,
    padding: 20,
    justifyContent: 'space-around',
  },
  menu: {
    flex: 1
  },
})
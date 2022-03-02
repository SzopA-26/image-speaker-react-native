import React from 'react'
import { 
  StyleSheet,
  SafeAreaView,
  View,
  Text 
} from 'react-native'
import { COLOR, SIZE } from '../assets/properties';
import Menu from './Menu'

export default List = ({ navigation }) => {
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.container]}>
        <Text style={[styles.header]}>
            ImageSpeaker
        </Text>
      </View>
      <View style={[styles.menu]}>
        <Menu navigation={navigation}/>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    padding: 20,
  },
  menu: {
    flex: 1
  },
  header: {
    fontSize: SIZE.HEADER,
    color: COLOR.MAIN_TEXT_COLOR,
    fontWeight: 'bold',
    marginVertical: '5%'
  },
})
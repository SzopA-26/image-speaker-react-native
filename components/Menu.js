import React from 'react'
import {
   StyleSheet,
   Text,
   Touchable,
   TouchableOpacity,
   View,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { COLOR, SIZE } from '../assets/properties';

export default Menu = () => {
  return (
      <>
         <Divider width={2.5} color={COLOR.MAIN_TEXT_COLOR}/>
         <View style={[styles.menubar]}>
            <TouchableOpacity>
               <Icon name='home' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('hi')}>
               <Icon name='add-circle' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
            <TouchableOpacity>
               <Icon name='video-library' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
         </View>
      </>
  )
}

const styles = StyleSheet.create({
   menubar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: '5%'
   }
})
import React, { useState } from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   Pressable,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { COLOR, SIZE, STYLES } from '../../assets/properties';
import Container from '../Container';

export default Home = ({ navigation }) => {
   const [content, setContent] = useState('Example Document')

   const [centerBtn, setCenterBtn] = useState('play-arrow')
   const [rightBtn, setRightBtn] = useState('skip-next')
   const [leftBtn, setLeftBtn] = useState('skip-next')

   const centerBtnOnPress = () => {
      if (centerBtn === 'play-arrow') {
         setCenterBtn('pause')
         setRightBtn('fast-forward')
         setLeftBtn('fast-forward')
      } else {
         setCenterBtn('play-arrow')
         setRightBtn('skip-next')
         setLeftBtn('skip-next')
      }
   }

   return (
      <Container navigator={navigation}>
         <Text style={STYLES.HEADER}>
            ImageSpeaker
         </Text>
         <View style={styles.panel}>
            <View style={styles.content_block}>
               <Text style={styles.content_text} numberOfLines={1}>
                  {content}
               </Text>
            </View>

            <View style={{height: '16%', backgroundColor: COLOR.CONTROL_BTN_BGC}}></View>

            <View style={[styles.control_panel]}>
               <TouchableOpacity style={[styles.control_btn, {transform: [{rotateY: '180deg'}]}]} >
                  <Icon name={leftBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
               <TouchableOpacity style={styles.control_btn} onPress={centerBtnOnPress}>
                  <Icon name={centerBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
               <TouchableOpacity style={styles.control_btn} >
                  <Icon name={rightBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
            </View>

            <Pressable style={({ pressed }) => [
               {
                  height: '20%',
                  backgroundColor: pressed ? COLOR.MIC_BTN_BGC : COLOR.MAIN_TEXT_COLOR,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
               }
            ]}>
               <Icon name='mic' color={COLOR.SEC_TEXT_COLOR} size={SIZE.MIC_ICON}/>
            </Pressable>
         </View>
      </Container>
   );
};
 
const styles = StyleSheet.create({
   panel: {
      justifyContent: 'space-around',
      flex: 1, 
      paddingBottom: '5%',
   },
   content_block: {
      backgroundColor: COLOR.CONTEXT_BGC,
      borderRadius: 8,
   },
   content_text: {
      color: COLOR.MAIN_TEXT_COLOR,
      fontSize: SIZE.CONTEXT,
      fontWeight: 'bold',
      paddingHorizontal: '5%',
      paddingVertical: '5%',
   },
   control_panel: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      height: '15%',
   },
   control_btn: {
      color: COLOR.MAIN_TEXT_COLOR,
      backgroundColor: COLOR.CONTROL_BTN_BGC,
      width: '30%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
   },
});
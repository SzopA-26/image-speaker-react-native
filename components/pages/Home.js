import React, { useState } from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity
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
               <TouchableOpacity style={[styles.control_btn]} onPress={centerBtnOnPress}>
                  <Icon name={centerBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.control_btn]} >
                  <Icon name={rightBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.mic_btn]}>
               <Icon name='mic' color={COLOR.SEC_TEXT_COLOR} size={SIZE.MIC_ICON}/>
            </TouchableOpacity>
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
      backgroundColor: COLOR.CONTEXT_BGC
   },
   content_text: {
      color: COLOR.MAIN_TEXT_COLOR,
      fontSize: SIZE.CONTEXT,
      fontWeight: 'bold',
      paddingHorizontal: 15,
      paddingVertical: 15,
   },
   control_panel: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '100%', 
      height: '15%',
   },
   control_btn: {
      color: COLOR.MAIN_TEXT_COLOR,
      backgroundColor: COLOR.CONTROL_BTN_BGC,
      width: '30%',
      justifyContent: 'center',
      alignItems: 'center'
   },
   mic_btn: {
      height: '20%',
      backgroundColor: COLOR.MIC_BTN_BGC,
      justifyContent: 'center',
      alignItems: 'center'
   },
});
import React, { useState, useEffect } from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   Pressable,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { COLOR, SIZE, STYLES, DATABASE_NAME, TABLE_NAME } from '../assets/properties';
import Container from './components/Container';

import { useSelector, useDispatch } from 'react-redux';
import { nextDoc, previousDoc, setCurrentDoc, setDocs } from '../services/redux/actions';

import { db } from '../App'

export default Home = ({ navigation }) => {
   const docs = useSelector(state => state.docs)
   const currentDoc = useSelector(state => state.currentDoc)
   const dispatch = useDispatch()

   const [playerState, setPlayerState] = useState(-1)
   const [centerBtn, setCenterBtn] = useState('play-arrow')
   const [rightBtn, setRightBtn] = useState('skip-next')
   const [leftBtn, setLeftBtn] = useState('skip-next')

   const centerBtnOnPress = (playerState) => {
      setPlayerState(playerState)

      // play
      if (playerState > 0) {
         setCenterBtn('pause')
         setRightBtn('fast-forward')
         setLeftBtn('fast-forward')
      } 
      // pause
      else {
         setCenterBtn('play-arrow')
         setRightBtn('skip-next')
         setLeftBtn('skip-next')
      }
   }

   const rightBtnOnPress = () => {
      // forward
      if (playerState > 0) {
         alert('forward pressed !')
      }
      // next
      else {
         dispatch(nextDoc())
      }
   }

   const leftBtnOnPress = () => {
      // backward
      if (playerState > 0) {
         alert('backward pressed !')
      }
      // previous
      else {
         dispatch(previousDoc())
      }
   }

   const findById = (id) => {
      for (let i=0; i<docs.length; i++) {
         if (id === docs[i].id) {
            return docs[i]
         }
      }
      return {
         name: 'Documents not found.'
      }
   }

   const setupData = () => {
      db.transaction((tx) => {
         tx.executeSql(
            "SELECT * FROM " + TABLE_NAME + ";",
            [],
            (tx, result) => {
               const documents = []
               for (let i=0; i<result.rows.length; i++) {
                  console.log('setup ' + JSON.stringify(result.rows.item(i)));
                  documents[i] = result.rows.item(i)
                  dispatch(setDocs(documents))
               }
            }
         )
      })
    }

   useEffect(() => {
      setupData()
   }, [])

   return (
      <Container navigator={navigation}>
         <Text style={STYLES.HEADER}>
            ImageSpeaker
         </Text>
         <View style={styles.panel}>
            <View style={styles.document_block}>
               <Text style={styles.document_text} numberOfLines={1}>
                  {JSON.stringify(findById(currentDoc))}
               </Text>
            </View>

            <View style={{height: '16%', backgroundColor: COLOR.CONTROL_BTN_BGC}}>
               <Text>player state : {playerState}</Text>
               <Text>
                  {JSON.stringify(findById(currentDoc))}
               </Text>
            </View>

            <View style={[styles.control_panel]}>
               <TouchableOpacity style={[styles.control_btn, {transform: [{rotateY: '180deg'}]}]} onPress={leftBtnOnPress}>
                  <Icon name={leftBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
               <TouchableOpacity style={styles.control_btn} onPress={() => centerBtnOnPress(playerState * -1)}>
                  <Icon name={centerBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
               <TouchableOpacity style={styles.control_btn} onPress={rightBtnOnPress}>
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
   document_block: {
      backgroundColor: COLOR.DOCUMENT_BGC,
      borderRadius: 8,
   },
   document_text: {
      color: COLOR.MAIN_TEXT_COLOR,
      fontSize: SIZE.DOCUMENT,
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
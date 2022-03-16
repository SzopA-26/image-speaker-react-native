import React, { useState, useEffect } from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   Pressable,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import { COLOR, SIZE, STYLES, DATABASE_NAME, TABLE_NAME } from '../assets/properties';
import Container from './components/Container';

import { useSelector, useDispatch } from 'react-redux';
import { nextDoc, previousDoc, setCurrentDoc, setDocs } from '../services/redux/actions';
import SoundPlayer from 'react-native-sound-player'

import { db } from '../App'

export default Home = ({ navigation }) => {
   const docs = useSelector(state => state.docs)
   const currentDoc = useSelector(state => state.currentDoc)
   const dispatch = useDispatch()

   const [playerState, setPlayerState] = useState(0)
   const [centerBtn, setCenterBtn] = useState('play-arrow')
   const [rightBtn, setRightBtn] = useState('skip-next')
   const [leftBtn, setLeftBtn] = useState('skip-next')

   const [currentTime, setCurrentTime] = useState(0)
   const [duration, setDuration] = useState(0)
   const [intervalID, setIntervalID] = useState(0)

   const setupData = async () => {
      await db.transaction((tx) => {
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

   const loadSound = (name, type) => {
      SoundPlayer.loadSoundFile(name, type)
      getInfo()
   }

   const playSound = () => {
      try {
         SoundPlayer.play()
         SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            stopPlayer()
         })
      } 
      catch (e) {
         alert('Cannot play the file.')
         console.log('cannot play the song file', e)
      }
   }
  
   const getInfo = async () => {
      try {
         const info = await SoundPlayer.getInfo()
         setCurrentTime(info.currentTime)
         setDuration(info.duration)
      } 
      catch (e) {
         console.log('There is no song playing', e)
      }
   }

   const stopPlayer = () => {
      setCenterBtn('play-arrow')
      setRightBtn('skip-next')
      setLeftBtn('skip-next')
      setPlayerState(0)
      setCurrentTime(0)
      SoundPlayer.seek(0)
      SoundPlayer.stop()
      window.clearInterval(intervalID)
   }

   useEffect(() => {
      setupData()
      loadSound('test', 'mp3')
   }, [])

   const centerBtnOnPress = (playerState) => {
      setPlayerState(playerState)

      // pause
      if (playerState % 2 === 0) {
         setCenterBtn('play-arrow')
         setRightBtn('skip-next')
         setLeftBtn('skip-next')
         SoundPlayer.pause()
         window.clearInterval(intervalID)
      } 
      else {
         setCenterBtn('pause')
         setRightBtn('fast-forward')
         setLeftBtn('fast-forward')
         setIntervalID(window.setInterval(() => {
            getInfo()
         }, 1000))
         // play
         if (playerState === 1) {
            playSound()
         } 
         // resume
         else {
            SoundPlayer.resume()
         }
      }
   }

   const rightBtnOnPress = () => {
      // next
      if (playerState % 2 === 0) {
         dispatch(nextDoc())
         stopPlayer()
      }
      // forward
      else {
         if (currentTime + 10 > duration) {
            stopPlayer()
            return
         }
         SoundPlayer.seek(currentTime + 10)
         setCurrentTime(currentTime + 10 >= duration ? 0 : currentTime + 10)
      }
   }

   const leftBtnOnPress = () => {
      // previous
      if (playerState % 2 === 0) {
         dispatch(previousDoc())
         stopPlayer()
         loadSound('test', 'mp3')
      }
      // backward
      else {
         SoundPlayer.seek(currentTime - 10)
         setCurrentTime(currentTime <= 10 ? 0 : currentTime - 10)
      }
   }

   const findById = (docs, id) => {
      for (let i=0; i<docs.length; i++) {
         if (id === docs[i].id) {
            return docs[i]
         }
      }
      return {
         name: 'Documents not found.'
      }
   }

   const timeFormatterMMSS = (sec) => {
      sec = Math.round(sec)
      let minutes = Math.floor(sec / 60)
      let seconds = sec - (minutes * 60)

      if (minutes < 10) {minutes = '0' + minutes}
      if (seconds < 10) {seconds = '0' + seconds}
      return minutes + ':' + seconds
   }

   return (
      <Container navigator={navigation}>
         <Text style={STYLES.HEADER}>
            ImageSpeaker
         </Text>
         <View style={styles.panel}>
            <View style={styles.document_block}>
               <Text style={styles.document_text} numberOfLines={1}>
                  {findById(docs, currentDoc).name}
               </Text>
            </View>

            <View style={styles.progress_bar}>
               <Slider
                  style={{width: '100%', height: 40}}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor={COLOR.MAIN_TEXT_COLOR}
                  maximumTrackTintColor={COLOR.CONTROL_BTN_BGC}
                  value={duration === 0 ? 0 : currentTime / duration}
                  onValueChange={(value) => {
                     SoundPlayer.seek(value * duration)
                     setCurrentTime(value * duration)
                  }}
               />
               <View style={styles.timer_line}>
                  <Text style={styles.timer_text}>{timeFormatterMMSS(currentTime)}</Text>
                  <Text style={styles.timer_text}>{timeFormatterMMSS(duration)}</Text>
               </View>
            </View>

            <View style={styles.control_panel}>
               <TouchableOpacity style={[styles.control_btn, {transform: [{rotateY: '180deg'}]}]} onPress={leftBtnOnPress}>
                  <Icon name={leftBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
               <TouchableOpacity style={styles.control_btn} onPress={() => centerBtnOnPress(playerState + 1)}>
                  <Icon name={centerBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
               <TouchableOpacity style={styles.control_btn} onPress={rightBtnOnPress}>
                  <Icon name={rightBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
            </View>

            <Pressable style={({ pressed }) => [
               {
                  backgroundColor: pressed ? COLOR.MIC_BTN_BGC : COLOR.MAIN_TEXT_COLOR,
                  height: '30%',
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
   progress_bar: {
      flexDirection: 'column',
      justifyContent: 'center',
   },
   timer_line: {
      marginTop: '2.5%',
      marginHorizontal: '2%',
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   timer_text: {
      color: COLOR.MAIN_TEXT_COLOR,
      fontSize: SIZE.ITEM,
      fontWeight: 'bold',
   }, 
});
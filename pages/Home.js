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
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { COLOR, SIZE, STYLES, TABLE_NAME, SERVER } from '../assets/properties';
import Container from './components/Container';

import { useSelector, useDispatch } from 'react-redux';
import { nextDoc, previousDoc, setCurrentDoc, setDocs, switchDoc } from '../services/redux/actions';
import SoundPlayer from 'react-native-sound-player';
import SoundRecorder from 'react-native-sound-recorder';

import { db } from '../App'
import axios from 'axios';

const RNFS = require('react-native-fs')

export default Home = ({ navigation }) => {
   const docs = useSelector(state => state.docs)
   const currentDoc = useSelector(state => state.currentDoc)
   const switched = useSelector(state => state.switchDoc)
   const dispatch = useDispatch()

   const [loader, setLoader] = useState(true)

   const [playerState, setPlayerState] = useState(0)
   const [enablePlayer, setEnablePlayer] = useState(false)
   const [centerBtn, setCenterBtn] = useState('play-arrow')
   const [rightBtn, setRightBtn] = useState('skip-next')
   const [leftBtn, setLeftBtn] = useState('skip-next')

   const [currentTime, setCurrentTime] = useState(0)
   const [duration, setDuration] = useState(0)
   const [intervalID, setIntervalID] = useState(0)


   SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      stopPlayer()
   })

   const setupData = async () => {
      await db.transaction((tx) => {
         tx.executeSql(
            "SELECT * FROM " + TABLE_NAME + ";",
            [],
            (tx, result) => {
               const documents = []
               for (let i=0; i<result.rows.length; i++) {
                  console.log('setup ' + result.rows.item(i).id + " " + result.rows.item(i).name + ' url=' + result.rows.item(i).url)
                  documents[i] = result.rows.item(i)
                  if (i === result.rows.length - 1) {
                     dispatch(setDocs(documents))
                     loadSound(result.rows.item(currentDoc).url)
                     console.log(result.rows.item(currentDoc).url);
                  }
               }
            }
         )
      })
      axios.get(SERVER)
      .then((res) => {
         console.log('Server status', res.status)
         setLoader(false)
      })
      .catch((err) => {
         console.log(err)
         alert('Cannot connect to server.')
         setLoader(true)
      })
   }

   const loadSound = (url) => {
      SoundPlayer.loadUrl(url)
      getInfo()
   }

   const playSound = (url='') => {
      try {
         if (url === '') {
            SoundPlayer.play()
         }
         else {
            SoundPlayer.playUrl(url)
         }
      }
      catch (e) {
         alert('Cannot play this file.')
         console.log('cannot play this file.', e)
      }
   }
  
   const getInfo = async () => {
      try {
         const info = await SoundPlayer.getInfo()
         setCurrentTime(info.currentTime)
         setDuration(info.duration)
         setEnablePlayer(true)
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
   }, [])

   useEffect(() => {
      if (docs.length === 0) return
      if (currentDoc >= docs.length) return
      if (docs[currentDoc].url === '') {
         stopPlayer()
      }
      else if (switched > 0 && !loader) {
         centerBtnOnPress(1, docs[currentDoc].url)
         playSound(docs[currentDoc].url)
         getInfo()
      } 
      else if (switched > 0 && loader) {
         alert('Cannot connect to server.')
      }
   }, [switched])

   const centerBtnOnPress = (playerState, url='') => {
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
            url === '' ? playSound() : playSound(url)
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
         loadSound(docs[currentDoc === docs.length-1 ? 0 : currentDoc+1].url)
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
         loadSound(docs[currentDoc === 0 ? docs.length-1 : currentDoc-1].url)
      }
      // backward
      else {
         SoundPlayer.seek(currentTime <= 10 ? 0 : currentTime - 10)
         setCurrentTime(currentTime <= 10 ? 0 : currentTime - 10)
      }
   }

   const micPressIn = () => {
      SoundRecorder.start(SoundRecorder.PATH_CACHE + '/test.mp4')
      .then(() => {
         console.log('started recording');
      });
   }

   const micPressOut =  () => {
      setLoader(true)
      SoundRecorder.stop()
      .then(async (result) => {
         console.log('stopped recording');
         if (docs.length === 0) {
            setLoader(false)
            alert('There is no audio in the list.')
            return
         }
         const base64 =  await RNFS.readFile(result.path, 'base64')
         axios.post(SERVER + '/command', {
            base64: base64
         }).then((res) => {
            setLoader(false)
            console.log('voice command:', res.data);
            if (res.data === '') {
               alert('Invalid command.')
               return
            }
            const index = findIndexByWord(res.data)
            if (index === -1) {
               alert('"' + res.data + '" audios not found.')
               return
            }
            dispatch(setCurrentDoc(findIndexByWord(res.data)))
            dispatch(switchDoc())
         }).catch((err) => {
            console.log(err)
            setLoader(false)
            alert(err)
         })
      });
   }

   const findIndexByWord = (word) => {
      word = word.toLowerCase()
      for (let i=0; i<docs.length; i++) {
         if (docs[i].name.toLowerCase().includes(word)) {
            return i
         }
      } return -1
   }

   const timeFormatterMMSS = (sec) => {
      sec = Math.round(sec)
      let minutes = Math.floor(sec / 60)
      let seconds = sec - (minutes * 60)

      if (minutes < 10) {minutes = '0' + minutes}
      if (seconds < 10) {seconds = '0' + seconds}
      return minutes + ':' + seconds
   }

   const getMinFromFormat = (format) => {
      return Number.parseInt(format.split(':')[0])
   }

   const getSecFromFormat = (format) => {
      return Number.parseInt(format.split(':')[1])
   }

   return (
      <Container navigator={navigation}>
         {loader && 
            <Spinner
               visible={true}
               textContent={'Loading...'}
               textStyle={STYLES.SPINNER}
            />
         }
         <Text style={STYLES.HEADER} accessible={true} accessibilityLabel='Image Speaker' accessibilityRole='header'>
            ImageSpeaker
         </Text>
         <View style={styles.panel}>
            <View style={styles.document_block} accessible={true} accessibilityLabel={docs[currentDoc]?.name}>
               <Text style={styles.document_text} numberOfLines={1}>
                  {docs[currentDoc]?.name} {docs.length === 0 ? 'There is no audio in the list.' : ''}
               </Text>
            </View>
            <View style={styles.progress_bar}>
               <Slider
                  style={{width: '100%', height: 40}}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor={COLOR.MAIN_TEXT_COLOR}
                  maximumTrackTintColor={COLOR.CONTROL_BTN_BGC}
                  disabled={docs.length === 0}
                  value={duration === 0 ? 0 : currentTime / duration}
                  onValueChange={(value) => {
                     SoundPlayer.seek(value * duration)
                     setCurrentTime(value * duration)
                  }}
               />
               { docs.length === 0 ? 
                  <View style={{alignItems: 'center'}}><Text></Text></View> 
                  :
                  <View style={styles.timer_line}>
                     <Text style={styles.timer_text}
                        accessible={true} 
                        accessibilityLabel={
                           getMinFromFormat(timeFormatterMMSS(currentTime)) + ' minute ' +
                           getSecFromFormat(timeFormatterMMSS(currentTime)) + ' second'
                        } 
                     >
                        {timeFormatterMMSS(currentTime)}
                     </Text>
                     <Text style={styles.timer_text}
                        accessible={true} 
                        accessibilityLabel={
                           getMinFromFormat(timeFormatterMMSS(duration)) + ' minute ' +
                           getSecFromFormat(timeFormatterMMSS(duration)) + ' second'
                        } 
                     >
                        {timeFormatterMMSS(duration)}
                     </Text>
                  </View>
               }
            </View>

            <View style={styles.control_panel}>
               <TouchableOpacity 
                  accessible={true} 
                  accessibilityRole='button'
                  accessibilityLabel={playerState % 2 === 0 ? 'Go to previous audio file' : 'Backward 10 second'}
                  disabled={loader} style={[styles.control_btn, {transform: [{rotateY: '180deg'}]}]} onPress={leftBtnOnPress}>
                  <Icon name={leftBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
               <TouchableOpacity 
                  accessible={true}
                  accessibilityRole='button'
                  accessibilityLabel={playerState % 2 === 0 ? 'pause button' : 'play button'}
                  disabled={loader || !enablePlayer} style={styles.control_btn} onPress={() => {
                     const doc = docs[currentDoc]
                     if (!doc.url || doc.url === '') {
                        alert('File not found.')
                     }
                     else {
                        centerBtnOnPress(playerState + 1)
                     }
                  }}
               >
                  <Icon name={centerBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
               <TouchableOpacity 
                  accessible={true} 
                  accessibilityRole='button'
                  accessibilityLabel={playerState % 2 === 0 ? 'Go to next audio file' : 'Forward 10 second'}
                  disabled={loader} style={styles.control_btn} onPress={rightBtnOnPress}>
                  <Icon name={rightBtn} color={COLOR.MAIN_TEXT_COLOR} size={SIZE.CONTROL_ICON}/>
               </TouchableOpacity>
            </View>

            <Pressable 
               accessible={true} 
               accessibilityRole='button'
               accessibilityLabel='microphone button'
               disabled={loader}
               style={({ pressed }) => [
                  {
                     backgroundColor: pressed ? COLOR.MIC_BTN_BGC : COLOR.MAIN_TEXT_COLOR,
                     height: '30%',
                     justifyContent: 'center',
                     alignItems: 'center',
                     borderRadius: 8,
                  }
               ]}

               onPressIn={micPressIn}
               onPressOut={micPressOut}
            >
               <Icon name='mic' color={COLOR.SEC_TEXT_COLOR} size={SIZE.MIC_ICON}/>
            </Pressable>
         </View>
      </Container>
   )
}

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
})
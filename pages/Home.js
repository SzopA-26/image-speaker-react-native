import React, { useState, useEffect } from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   Pressable,
   Alert,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Switch } from 'react-native-switch';
import Slider from '@react-native-community/slider';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { COLOR, SIZE, STYLES, TABLE_NAME, SERVER, SPEAK } from '../assets/properties';
import Container from './components/Container';

import { useSelector, useDispatch } from 'react-redux';
import { nextDoc, previousDoc, setCurrentDoc, setDocs, switchDoc } from '../services/redux/actions';
import SoundPlayer from 'react-native-sound-player';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

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

   const [voiceResults, setVoiceResults] = useState('')
   const [voiceLanguage, setVoiceLanguage] = useState('EN')
   const [micDisabled, setMicDisabled] = useState(false)
   const [searchCount, setSearchCount] = useState(0)

   const changeLanguage = (value) => {
      setVoiceResults('')
      if (value) {
         setVoiceLanguage('EN')
         Tts.setDefaultLanguage('en-US')
         Tts.setDefaultRate(0.4)
      } else {
         setVoiceLanguage('TH')
         Tts.setDefaultLanguage('th-TH')
         Tts.setDefaultRate(0.5)
      }
   }

   const onSpeechStart = () => {
      setVoiceResults('')
      console.log('onSpeechStart');
   }

   const onSpeechEnd = () => {
      console.log('onSpeechEnd')
      // setSearchCount(searchCount + 1)
   }

   const onSpeechResults = (e) => {
      setVoiceResults(e.value[0])
      console.log('onSpeechResults: ', e.value[0])
   }

   const onSpeechError = (e) => {
      console.error(e.error)
   }

   const search = (word) => {
      console.log('search', word)
      if (word === '') return
      const audios = findAudiosByWord(word)
      if (audios.length === 0) {
         console.log('"' + word + '" audios not found.')
         if (voiceLanguage === 'EN') {
            Tts.speak(SPEAK.AUDIOS_NOT_FOUND.EN)
         } else {
            Tts.speak(SPEAK.AUDIOS_NOT_FOUND.TH)
         }
         return
      }
      if (audios.length === 1) {
         dispatch(setCurrentDoc(findIndexById(audios[0].id)))
         dispatch(switchDoc())
      }
      else {
         if (voiceLanguage === 'EN') {
            Tts.speak(SPEAK.AUDIOS_FOUND.EN(audios.length))
         } else {
            Tts.speak(SPEAK.AUDIOS_FOUND.TH(audios.length))
         }
         for (let i=0; i<audios.length; i++) {
            Tts.speak(''+(i+1))
            Tts.speak(audios[i].name)
         }
      }
   }

   SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      stopPlayer()
   })
   Tts.addEventListener('tts-start', () => {setMicDisabled(true)})
   Tts.addEventListener('tts-progress', () => {})
   Tts.addEventListener('tts-finish', () => {setMicDisabled(false)})

   const setupData = async () => {
      setSearchCount(searchCount + 1)
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
         Alert.alert('Something Wrong !', 'Cannot connect to a server.', [{text: 'Try Again'}]);
         setLoader(false)
         // setTimeout(() => {
         //    setupData()
         // }, 10000)
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
      Voice.onSpeechStart = onSpeechStart
      Voice.onSpeechEnd = onSpeechEnd
      Voice.onSpeechPartialResults = onSpeechResults
      Voice.onSpeechError = onSpeechError
      Tts.setDefaultLanguage('en-US')
      Tts.setDefaultRate(0.4)
      Tts.setDucking(true)
      Tts.setIgnoreSilentSwitch('obey')
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

   useEffect(() => {
      search(voiceResults)
   }, [searchCount])

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

   const micPressIn = async () => {
      if (playerState % 2 !== 0) {
         centerBtnOnPress(playerState + 1)
      }
      const lang = voiceLanguage === 'EN' ? 'en-GB' : voiceLanguage === 'TH' ? 'th-TH' : ''
      try {
         await Voice.start(lang)
      } catch (e) {
         console.log(e);
      }
   }

   const micPressOut = async () => {
      setSearchCount(searchCount + 1)
      try {
         await Voice.stop()
      } catch (e) {
         console.log(e);
      }
   }

   const findIndexById = (id) => {
      for (let i=0; i<docs.length; i++) {
         if (docs[i].id === id) {
            return i
         }
      } return -1
   }

   const findAudiosByWord = (word) => {
      return docs.filter((doc) => doc.name.toLowerCase().includes(word.toLowerCase()))
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
         <View style={styles.header}>
            <Text style={STYLES.HEADER} accessible={true} accessibilityLabel='Image Speaker' accessibilityRole='header'>
               ImageSpeaker
            </Text>
            <View style={styles.switch}>
               <Switch
               accessible={true}
               accessibilityLabel={`switch to ${voiceLanguage === 'EN' ? 'thai' : 'english'} language.`}
                  value={voiceLanguage === 'EN'}
                  disabled={false}
                  onValueChange={(value) => changeLanguage(value)}
                  activeText={'EN'}
                  inActiveText={'TH'}
                  circleBorderWidth={2}
                  backgroundActive={COLOR.MAIN_TEXT_COLOR}
                  backgroundInactive={COLOR.MAIN_TEXT_COLOR}
                  circleActiveColor={COLOR.CONTROL_BTN_BGC}
                  circleInActiveColor={COLOR.CONTROL_BTN_BGC}
                  // changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                  // innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                  // switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                  // switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                  // switchBorderRadius={30} 
                  switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch

               />
            </View>
         </View>
         <View style={styles.panel}>
            <View style={styles.document_block} accessible={true} accessibilityLabel={docs[currentDoc]?.name + ' audio file.'}>
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
               disabled={loader && micDisabled}
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
   header: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
   },
   switch: {
      justifyContent: 'center',
      marginLeft: '12%'
   },
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
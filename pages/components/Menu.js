import React, {useRef, useState} from 'react'
import {
   StyleSheet,
   TouchableOpacity,
   View,
   Platform,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { COLOR, SERVER, SIZE, TABLE_NAME } from '../../assets/properties';

import ActionSheet from "react-native-actionsheet";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { db, insertToTable } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { setDocs, setCurrentDoc, switchDoc } from '../../services/redux/actions';

const RNFS = require('react-native-fs')

const docPicker = async () => {
   try {
      const res = await DocumentPicker.pick({
         type: [DocumentPicker.types.images, DocumentPicker.types.pdf]
      })
      return res
   }
   catch (err) {
      if (DocumentPicker.isCancel(err)) {
         // User cancelled the picker
      } else throw err
      return null
   } 
}

export default Menu = ({ navigator }) => {
   const items = useSelector(state => state.docs)
   const currentDoc = useSelector(state => state.currentDoc)
   const dispatch = useDispatch()

   const [loading, setLoading] = useState(false)

   const actionSheet = useRef()
   const optionArray = [
      'Take Photo', 'Choose From Library', 'PDF File', 'Cancel'
   ]
   const showActionSheet = () => {
      actionSheet.current.show()
   }

   const setupData = (url) => {      
      return new Promise((resolve, reject) => {
         db.transaction((tx) => {
            tx.executeSql(
               "SELECT * FROM " + TABLE_NAME + ";",
               [],
               (tx, result) => {
                  const documents = []
                  for (let i=0; i<result.rows.length; i++) {
                     console.log('setup ' + result.rows.item(i).id + " " + result.rows.item(i).name + ' url=' + result.rows.item(i).url)
                     documents[i] = result.rows.item(i)
                     if (result.rows.item(i).url === url) {
                        console.log('set current');
                        dispatch(setCurrentDoc(i))
                     }
                     if (i === result.rows.length - 1) {
                        dispatch(setDocs(documents))
                        dispatch(switchDoc())
                        resolve('SETUP SUCCESS')
                     }
                  }
               }
            )
         })
      })
   }

   const findIndexByUrl = (url) => {
      for (let i=0; i<items.length; i++) {
         if (items[i].url === url) {
            return i
         }
      }
      return -1
   }

   return (
      <>
         {loading && 
            <Spinner
               visible={true}
               textContent={'Loading...'}
               textStyle={styles.spinnerText}
            />
         }
         <Divider width={2.5} color={COLOR.MAIN_TEXT_COLOR}/>
         <View style={[styles.menubar]}>
            <TouchableOpacity 
               accessible={true}
               accessibilityRole='button'
               accessibilityLabel='home menu'
               accessibilityHint='navigate to home screen'
               onPress={() => navigator.navigate('Home')}>
               <Icon name='home' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
            <TouchableOpacity 
               accessible={true}
               accessibilityRole='button'
               accessibilityLabel='upload button'
               accessibilityHint='upload document or image for convert into audio file'
               onPress={showActionSheet}>
               <Icon name='add-circle' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
            <TouchableOpacity 
               accessible={true}
               accessibilityRole='button'
               accessibilityLabel='list menu'
               accessibilityHint='navigate to list screen'
               onPress={() => navigator.navigate('List')}>
               <Icon name='video-library' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
         </View>

         <ActionSheet
            ref={actionSheet}
            title={'Select an Image or PDF File.'}
            options={optionArray}
            cancelButtonIndex={3}
            onPress={ async (index) => {
               let res = null
               if (index === 0) res = await launchCamera()
               else if (index === 1) res = await launchImageLibrary()
               else if (index === 2) res = await docPicker()
               setLoading(true)
               if (res.errorCode || res.didCancel) {
                  if (res.errorCode) alert(res.errorCode)
                  setLoading(false)
                  return
               }
               const data = index === 2 ? res[0] : res.assets[0]
               const name = index === 2 ? data.name : data.fileName
               const base64 = await RNFS.readFile(data.uri, 'base64')
               const path = index === 2 ? '/pdf' : '/image'
               axios.post(
                  SERVER + path, 
                  {
                     name: Date.now() + '-' + name,
                     base64: base64
                  }
               ).then(async (res) => {
                  const url = `${SERVER}/audio/${res.data.name}`
                  await insertToTable({
                     name: index === 2 ? name : res.data.text.replace(/(\r\n|\n|\r)/gm, ' ').substring(0,50),
                     duration: res.data.duration < 1000 ? 1 : Math.round(res.data.duration/1000),
                     img: index === 2 ? '' : data.uri,
                     url: url,
                  })
                  console.log(await setupData(url))
                  navigator.navigate('Home')
                  
               }).catch((err) => {
                  console.log(err)
                  alert(err)
               }).finally(() => {
                  setLoading(false)
               })
            }}
         />
      </>
   )
}

const styles = StyleSheet.create({
   menubar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      ...Platform.select({
         android: {
            marginTop: '3%',
         },
         ios: {
            marginTop: '5%'
         }
      })
   },
   spinnerText: {
      color: '#FFF'
   },
})
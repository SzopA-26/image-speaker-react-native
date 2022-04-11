import React, {useRef, useState} from 'react'
import {
   StyleSheet,
   TouchableOpacity,
   View,
   Platform,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { COLOR, SERVER, SIZE, STYLES, TABLE_NAME } from '../../assets/properties';

import ActionSheet from "react-native-actionsheet";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import DialogInput from 'react-native-dialog-input';
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
   const docs = useSelector(state => state.docs)
   const dispatch = useDispatch()

   const [loading, setLoading] = useState(false)
   const [isDialogVisible, setDialogVisible] = useState(false)
   const [imageSelected, setImageSelected] = useState({})

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

   const isDuplicatedName = (name) => {
      const dup = docs.filter((doc) => {
         return doc.name === name
      })
      return dup.length > 0
   }

   const createDuplicatedNumber = (name) => {
      if (isDuplicatedName(name)) {
         if (/^.* \(\d+\)$/.test(name)) {
            const match = name.match(/ \(\d+\)$/)[0]
            const num = parseInt(match.slice(2, match.length-1))
            console.log('num', num);
            return createDuplicatedNumber(name.replace(/\(\d+\)$/i, `(${num+1})`))
         } else {
            return createDuplicatedNumber(name + ' (1)')
         }
      } else {
         return name
      }
   }

   const upload = async (isPDF, image, fileName='Untitled Audio') => {
      const data = isPDF ? image[0] : image.assets[0]
      const name = isPDF ? data.name : data.fileName
      const base64 = await RNFS.readFile(data.uri, 'base64')
      const path = isPDF ? '/pdf' : '/image'
      axios.post(
         SERVER + path, 
         {
            name: Date.now() + '-' + name,
            base64: base64
         }
      ).then(async (res) => {
         const url = `${SERVER}/audio/${res.data.name}`
         let audioName = isPDF ? name : fileName
         if (isPDF && isDuplicatedName(audioName)) {
            audioName = createDuplicatedNumber(audioName)
         }
         await insertToTable({
            name: audioName,
            duration: res.data.duration < 1000 ? 1 : Math.round(res.data.duration/1000),
            img: isPDF ? '' : data.uri,
            url: url,
         })
         console.log(await setupData(url))
         navigator.navigate('Home')
         setLoading(false)
      }).catch((err) => {
         console.log(err)
         alert('Error: Invalid file.')
         setLoading(false)
      })
   }

   return (
      <>
         {<DialogInput 
            isDialogVisible={isDialogVisible}
            title={'Audio file name.'}
            hintInput ={'Untitled Audio'}
            submitInput={(input) => {
               if (isDuplicatedName(input)) {
                  alert('Error: This name is duplicated.')
                  setDialogVisible(false)
                  return
               }
               if (input !== '') {
                  upload(false, imageSelected, input.trim())
               }
               setDialogVisible(false)
            }}
            closeDialog={() => {setDialogVisible(false)}}
            dialogStyle={{backgroundColor: COLOR.DOCUMENT_BGC}}
            modalStyle={{backgroundColor: 'rgba(0,0,0,0.2)'}}
         />}
         {loading && <Spinner
            visible={true}
            textContent={'Loading...'}
            textStyle={STYLES.SPINNER}
         />}
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
            onPress={async (index) => {
               let res = null
               if (index === 0) res = await launchCamera()
               else if (index === 1) res = await launchImageLibrary()
               else if (index === 2) res = await docPicker()
               else {return}
               setLoading(true)
               if (res == null || res.errorCode || res.didCancel) {
                  setLoading(false)
                  return
               }
               setImageSelected(res)
               if (index === 0 || index === 1) {
                  setDialogVisible(true)
                  setImageSelected(res)
               }
               else upload(true, res)
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
})
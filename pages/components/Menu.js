import React, {useRef} from 'react'
import {
   StyleSheet,
   TouchableOpacity,
   View,
   Platform,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { COLOR, SIZE } from '../../assets/properties';

import ActionSheet from "react-native-actionsheet";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import { db } from '../../App'

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

const insertDocument = (doc) => {
   db.transaction((tx) => {
      tx.executeSql(
         "INSERT INTO Documents (name, duration, currentTime, uri, content) "
         + "VALUES ('" + doc.name + "', " + doc.duration + ", " + doc.currentTime + ", '" + doc.uri + "', '" + doc.content + "');",
         [],
         () => {console.log("insert " + doc.name + " document success.")},
         error => {console.log(error)}
      )
   })
 }

export default Menu = ({ navigator }) => {

   const actionSheet = useRef()
   const optionArray = [
      'Take Photo', 'Choose From Library', 'PDF File', 'Cancel'
   ]
   const showActionSheet = () => {
      actionSheet.current.show()
   }

   return (
      <>
         <Divider width={2.5} color={COLOR.MAIN_TEXT_COLOR}/>
         <View style={[styles.menubar]}>
            <TouchableOpacity onPress={() => navigator.navigate('Home')}>
               <Icon name='home' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={showActionSheet}>
               <Icon name='add-circle' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigator.navigate('List')}>
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
               if (index === 0) {
                  res = await launchCamera()
               } else if (index === 1) {
                  res = await launchImageLibrary()
               } else if (index === 2) {
                  res = await docPicker()
               }
               console.log(res)
               // insertDocument({
               //   name: 'sqlite4',
               //   duration: 1345,
               //   currentTime: 0,
               //   uri: 'https://cdn-images-1.medium.com/max/280/1*lKN9xV1YEin-2wfAiGySBA.png',
               //   content: 'content',
               // })
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
   }
})
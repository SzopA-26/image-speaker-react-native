import React, {useRef} from 'react'
import {
   StyleSheet,
   Text,
   Touchable,
   TouchableOpacity,
   View,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { COLOR, SIZE } from '../assets/properties';

import ActionSheet, { SheetManager } from "react-native-actionsheet";
import DocumentPicker from 'react-native-document-picker';

const docPicker = async () => {
   try {
      const res = await DocumentPicker.pick({
         type: [DocumentPicker.types.images, DocumentPicker.types.pdf]
      })
      console.log(res);
   }
   catch (err) {
      if (DocumentPicker.isCancel(err)) {
         // User cancelled the picker
      } else throw err
   } 
}

export default Menu = () => {
   const actionSheet = useRef();
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
            <TouchableOpacity>
               <Icon name='home' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={showActionSheet}>
               <Icon name='add-circle' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
            <TouchableOpacity>
               <Icon name='video-library' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
            </TouchableOpacity>
         </View>

         <ActionSheet
            ref={actionSheet}
            title={'Select an Image or PDF File.'}
            options={optionArray}
            cancelButtonIndex={3}
            onPress={(index) => {
               switch (index) {
                  case 0:
                     break
                  case 1:
                     break
                  case 2:
                     docPicker()
                     break
               }
            }}
         />
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
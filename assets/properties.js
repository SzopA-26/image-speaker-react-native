import { PixelRatio, StyleSheet } from "react-native"

export const DATABASE_NAME = 'image-speaker'
export const TABLE_NAME = 'Documents'
export const SERVER = 'http://192.168.1.105:3000'

export const COLOR = {
   MAIN_TEXT_COLOR: '#4267B2',
   SEC_TEXT_COLOR: 'white',
   DOCUMENT_BGC: '#E4EAF0',
   CONTROL_BTN_BGC: '#CEDEFF',
   MIC_BTN_BGC: '#A3BCEF',
   ITEM_NAME: 'black',
   ITEM_DURATION: '#C4C4C4',
   ITEM_DIVIDER: '#C4C4C4',
}

export const SIZE = {

   // icon
   CONTROL_ICON: 70/3 * PixelRatio.get(),
   MIC_ICON: 80/3 * PixelRatio.get(),
   MENU_ICON: 50/3 * PixelRatio.get(),

   // font & img
   HEADER: 35,
   DOCUMENT: 20,
   ITEM: 16,
   IMG: 55
}

export const STYLES = StyleSheet.create({
   HEADER: {
      fontSize: SIZE.HEADER,
      color: COLOR.MAIN_TEXT_COLOR,
      fontWeight: 'bold',
      marginVertical: '5%'
   },
   SPINNER: {
      color: 'white'
   }, 
})

export const SPEAK = {
   AUDIOS_NOT_FOUND: {
      EN: 'Sorry, audios not found.',
      TH: 'ขอโทษค่ะ ไม่พบไฟล์เสียงที่ต้องการ'
   },
   AUDIOS_FOUND: {
      EN: (num) => {
         return `I found ${num} audios in the list.`
      },
      TH: (num) => {
         return `พบ ${num} ไฟล์เสียงที่ใกล้เคียง`
      }
   }
}
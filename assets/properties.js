import { PixelRatio, StyleSheet } from "react-native"

export const DATABASE_NAME = 'image-speaker'
export const TABLE_NAME = 'Documents'

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
})
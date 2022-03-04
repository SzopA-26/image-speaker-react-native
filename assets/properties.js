import { StyleSheet } from "react-native"

export const COLOR = {
   MAIN_TEXT_COLOR: '#4267B2',
   SEC_TEXT_COLOR: 'white',
   CONTEXT_BGC: '#E4EAF0',
   CONTROL_BTN_BGC: '#CEDEFF',
   MIC_BTN_BGC: '#A3BCEF',
   ITEM_NAME: 'black',
   ITEM_DURATION: '#C4C4C4',
   ITEM_DIVIDER: '#C4C4C4',
}

export const SIZE = {
   CONTROL_ICON: 70,
   MIC_ICON: 80,
   MENU_ICON: 50,
   HEADER: 35,
   CONTEXT: 20,
   ITEM: 20,
}

export const STYLES = StyleSheet.create({
   HEADER: {
      fontSize: SIZE.HEADER,
      color: COLOR.MAIN_TEXT_COLOR,
      fontWeight: 'bold',
      marginVertical: '5%'
   },
})
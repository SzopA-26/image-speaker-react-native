import React from 'react'
import {
   SafeAreaView,
   StyleSheet,
   View,
} from 'react-native';
import Menu from './Menu';

export default Container = ({ children, navigator }) => {

   return (
      <SafeAreaView style={styles.area}>
         <View style={styles.container}>
            <View style={styles.child}>{children}</View>
         </View>
         <View style={styles.menu}>
            <Menu navigator={navigator}/>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   area: {
      height: '100%',      
   },
   container: {
      paddingHorizontal: '4%',
      flex: 9,
   },
   menu: {
      flex: 1,
   },
   child: {
      height: '100%',
   }
})
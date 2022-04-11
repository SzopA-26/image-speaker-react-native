import React from 'react';
import { 
  StyleSheet,
  View,
  Text, 
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native'
import { Divider, Icon } from 'react-native-elements';
import { COLOR, SIZE, STYLES } from '../assets/properties';
import Container from './components/Container';

import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDoc, switchDoc } from '../services/redux/actions';

export default List = ({ navigation }) => {
  const items = useSelector(state => state.docs)
  const dispatch = useDispatch()

  const findIndexById = (id) => {
    for (let i=0; i<items.length; i++) {
      if (items[i].id === id) {
        return i
      }
    }
  }

  const itemOnPress = (item) => {
    dispatch(setCurrentDoc(findIndexById(item.id)))
    dispatch(switchDoc())
    console.log('id ' + item.id)
    navigation.navigate('Home')
  }

  const Item = ({item}) => {
    let imgSource = require('../assets/pdf-icon.png')
    if (item.img !== '') {
      imgSource = {
        uri: item.img
      }
    }
    let hour = Math.floor(item.duration/3600)
    hour = hour < 10 ? '0' + hour : '' + hour
    let min = Math.floor((item.duration%3600)/60)
    min = min < 10 ? '0' + min : '' + min
    let sec = (item.duration%3600)%60
    sec = sec < 10 ? '0' + sec : '' + sec
    return (
      <View style={styles.item}>
        <View style={styles.item_img}>
          <Image
            style={{width: SIZE.IMG, height: SIZE.IMG}}
            source={imgSource}
          />     
        </View>   
        <View style={styles.item_detail}>
          <Text accessibilityLabel={item.name + ' audio file.'}
           style={styles.item_name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.item_duration} numberOfLines={1}>
            {hour + ':' + min + ':' + sec}
          </Text>
        </View>
        <TouchableOpacity accessibilityLabel={item.name + ' audio file play'} accessibilityRole={'button'}
          style={styles.play_btn} onPress={() => itemOnPress(item)}>
          <Icon name='play-arrow' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Container navigator={navigation}>
      <Text style={STYLES.HEADER}>
          ImageSpeaker
      </Text>
      <ScrollView style={styles.list_menu}>
        {
          items.length === 0 ? 
          <Text style={styles.empty_text}>
            There is no audio in the list.
          </Text>
          :
          items.map((item) => {
            if (item.id !== items[0].id) {
              return (
                <View key={item.id+'-'+item.name}>
                  <Divider width={1.5} color={COLOR.ITEM_DIVIDER} style={[styles.divider]}></Divider>
                  <Item item={item}/>
                </View>
              )
            } 
            return (
              <View key={item.name+'-'+item.duration}>
                <Item item={item}/>
              </View>
            )
          })
        }
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  list_menu: {
    marginTop: '5%',
    marginBottom: '5%',
  },
  item: {
    flexDirection: 'row',
    paddingHorizontal: '7%',
  },
  item_img: {
    marginRight: '7%',
    flex: 1,
  },
  item_detail: {
    justifyContent: 'space-between',
    flex: 3,
  },
  item_name: {
    fontSize: SIZE.ITEM,
    color: COLOR.ITEM_NAME,
  },
  item_duration: {
    fontSize: SIZE.ITEM,
    color: COLOR.ITEM_DURATION,
  },
  play_btn: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  divider: {
    marginVertical: '5%',
  },
  empty_text: {
    color: 'black',
    justifyContent: 'center'
  }
})
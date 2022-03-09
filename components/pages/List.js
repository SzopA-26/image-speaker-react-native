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
import { COLOR, SIZE, STYLES } from '../../assets/properties';
import Container from '../Container';

import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDoc } from '../../services/actions';

export default List = ({ navigation }) => {
  const items = useSelector(state => state.docs)
  const dispatch = useDispatch()

  const itemOnPress = (item) => {
    dispatch(setCurrentDoc(item.id))
    navigation.navigate('Home')
  }

  const Item = ({item}) => {
    let imgSource = require('../../assets/pdf-icon.png')
    if (item.uri !== '') {
      imgSource = {
        uri: item.uri
      }
    }
    return (
      <TouchableOpacity style={styles.item} onPress={() => itemOnPress(item)}>
        <View style={styles.item_img}>
          <Image
            style={{width: SIZE.IMG, height: SIZE.IMG}}
            source={imgSource}
          />     
        </View>   
        <View style={styles.item_detail}>
          <Text style={styles.item_name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.item_duration} numberOfLines={1}>{item.duration}</Text>
        </View>
        <View style={styles.play_btn}>
          <Icon name='play-arrow' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Container navigator={navigation}>
      <Text style={[STYLES.HEADER]}>
          ImageSpeaker
      </Text>
      <ScrollView style={[styles.list_menu]}>
        {
          items.map((item) => {
            if (item.name !== items[0].name) {
              return (
                <View key={item.name+'-'+item.duration}>
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
  }
})
import React, {useState} from 'react'
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

export default List = ({ navigation }) => {
  const [items, setItems] = useState([
    {
      id: 0,
      name: 'Example Document',
      duration: '00:00:34'
    },
    {
      id: 1,
      name: 'tha amazing avanger super tornado assemble ultimate ultron',
      duration: '00:39:07'
    },
    {
      id: 2,
      name: 'Book2',
      duration: '01:23:45'
    },
    {
      id: 3,
      name: 'Book3',
      duration: '01:23:45'
    },
  ])

  const itemOnPress = (item) => {
    navigation.navigate('Home', {
      document: item.id
    })
  }

  const Item = ({item}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => itemOnPress(item)}>
        <View style={styles.item_img}>
          <Image
            style={{width: SIZE.IMG, height: SIZE.IMG}}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png'
            }}
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
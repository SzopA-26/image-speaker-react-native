import React, {useState} from 'react'
import { 
  StyleSheet,
  View,
  Text, 
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { Divider, Icon } from 'react-native-elements';
import { COLOR, SIZE, STYLES } from '../../assets/properties';
import Container from '../Container';

export default List = ({ navigation }) => {
  const [items, setItems] = useState([
    {
      name: 'Example Document',
      duration: '00:00:34'
    },
    {
      name: 'Long Titleeeeeeeeeeeeeeee',
      duration: '00:39:07'
    },
    {
      name: 'Book2',
      duration: '01:23:45'
    },
    {
      name: 'Book3',
      duration: '01:23:45'
    },
  ])

  const Item = ({item}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => alert(item.name)}>
        <View style={styles.item_img}></View>
        <View style={styles.item_detail}>
          <Text style={styles.item_name} numberOfLines={1}>{item.name}</Text>
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
            if (item.name === items[0].name) {
              return (
                <View key={item.name+'-'+item.duration}>
                  <Item item={item}/>
                </View>
              )
            } 
            return (
              <View key={item.name+'-'+item.duration}>
                <Divider width={1.5} color={COLOR.ITEM_DIVIDER} style={[styles.divider]}></Divider>
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
    backgroundColor: 'red', 
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
import React, {useState} from 'react'
import { 
  StyleSheet,
  SafeAreaView,
  View,
  Text, 
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { Divider, Icon } from 'react-native-elements';
import { COLOR, SIZE } from '../assets/properties';
import Menu from './Menu'

export default List = ({ navigation }) => {
  const [items, setItems] = useState([
    {
      name: 'Long Titleeeeeeeeeeee',
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

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.container]}>
        <Text style={[styles.header]}>
            ImageSpeaker
        </Text>
        <ScrollView style={[styles.list_menu]}>
          {
            items.map((item) => {
              if (item.name === items[0].name) {
                return (
                  <View key={item.name+'-'+item.duration}>
                    <TouchableOpacity style={[styles.item]}>
                      <View style={[styles.item_img]}></View>
                      <View style={[styles.item_detail]}>
                        <Text style={[styles.item_name]} numberOfLines={1}>{item.name}</Text>
                        <Text style={[styles.item_duration]} numberOfLines={1}>{item.duration}</Text>
                      </View>
                      <View style={[styles.play_btn]}>
                        <Icon name='play-arrow' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              }
              return (
                <View key={item.name+'-'+item.duration}>
                  <Divider width={1.5} color={COLOR.ITEM_DIVIDER} style={[styles.divider]}></Divider>
                  <TouchableOpacity style={[styles.item]}>
                    <View style={[styles.item_img]}></View>
                    <View style={[styles.item_detail]}>
                      <Text style={[styles.item_name]} numberOfLines={1}>{item.name}</Text>
                      <Text style={[styles.item_duration]} numberOfLines={1}>{item.duration}</Text>
                    </View>
                    <View style={[styles.play_btn]}>
                      <Icon name='play-arrow' color={COLOR.MAIN_TEXT_COLOR} size={SIZE.MENU_ICON}/>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            })
          }
          
        </ScrollView>
      </View>
      <View style={[styles.menu]}>
        <Menu navigation={navigation}/>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    padding: 20,
  },
  menu: {
    flex: 1
  },
  header: {
    fontSize: SIZE.HEADER,
    color: COLOR.MAIN_TEXT_COLOR,
    fontWeight: 'bold',
    marginVertical: '5%',
    marginBottom: '10%',
  },
  list_menu: {
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
    justifyContent: 'center',
  },
  divider: {
    marginVertical: '5%',
  }
})
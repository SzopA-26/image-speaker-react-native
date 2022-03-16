import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './services/redux/store';
import { openDatabase } from 'react-native-sqlite-storage';
import { DATABASE_NAME, TABLE_NAME } from './assets/properties';
import Home from './pages/Home';
import List from './pages/List'

LogBox.ignoreAllLogs(); // Ignore all log notifications

export const db = openDatabase(
  {
    name: DATABASE_NAME,
    location: 'default'
  },
  () => {console.log('connection success.')},
  error => {console.log(error)}
)

const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS '
      + TABLE_NAME
      + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, duration INT, currentTime INT, img TEXT, content TEXT);',
      [],
      () => {console.log('create table ' + TABLE_NAME + '.')},
      error => {console.log(error)}
    )
  })
}

const insertToTable = (item) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO ' + TABLE_NAME
      + ' (name, duration, currentTime, img, content) '
      + "VALUES ('" + item.name + "', " + item.duration + ", " + item.currentTime + ", '" + item.img + "', '" + item.content + "');",
      [],
      () => {console.log('insert ' + item.name + ' to table.')},
      error => {console.log(error);}
    )
  })
}

const clearTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DROP TABLE " + TABLE_NAME + ";", 
      [],
      () => {console.log('drop table ' + TABLE_NAME + '.');},
      error => {console.log(error);}
    )
  })
}

const Tab = createBottomTabNavigator();

export default App = () => {
  
  useEffect(() => {
    // clearTable()
    // createTable()
    // insertToTable({
    //   name: 'sqlite1',
    //   currentTime: 0,
    //   duration: 13423,
    //   img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png',
    //   content: ''
    // })
    // insertToTable({
    //   name: 'sqlite2',
    //   currentTime: 0,
    //   duration: 13423,
    //   img: '',
    //   content: ''
    // })
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{
            headerShown: false, 
            tabBarStyle: { display: 'none' }
          }}
        >
          <Tab.Screen name='Home' component={Home} />
          <Tab.Screen name='List' component={List} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
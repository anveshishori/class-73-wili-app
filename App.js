
import React, {Component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import TransactionScreen from './Screens/BookTransaction';
import SearchScreen from './Screens/Search';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'

export default class App extends Component {
  render(){
    return (
    
          <AppNavigator/>
    
  );
}
}


const TabNavigator = createBottomTabNavigator({
Transaction: {screen:TransactionScreen},
Search: {screen: SearchScreen}

},

{
defaultNavigationOptions : ({navigation})=>({
tabBarIcon:()=>{
const routeName = navigation.state.routeName

if(routeName === 'Transaction'){

return (

  <Image
  source = {require('./assets/book.png')}
  style={{width:40, height:40}}
  
  />
)


}
else if(routeName === 'Search'){

  return (

    <Image
    
    source = {require('./assets/searchingbook.png')}
    style={{width:40, height:40}}
    />
  )




}


}




})



})

const AppNavigator = createAppContainer(TabNavigator)

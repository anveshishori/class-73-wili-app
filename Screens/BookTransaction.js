
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image } from 'react-native';

import * as Permissions from 'expo-permissions'
import { BarCodeScanner } from 'expo-barcode-scanner';


export default class TransactionScreen extends Component {

  constructor() {

    super()

    this.state = {

      hasCamPermission: null,
      scanned: false,
      buttonState: 'normal',
      scannedBookId:'',
      scannedStudentId:''

    }

  }

  getCameraPermission = async (id) => {

    const { status } = await Permissions.askAsync(Permissions.CAMERA)

    this.setState({
      hasCamPermission: status === "granted",
      buttonState: id,
      scanned: false

    })

  }

  handleBarCodeScanned = async ({ data }) => {
const {buttonState} = this.state
if(buttonState === "BookId"){

this.setState({
      
      scanned: true,
      scannedBookId: data,
      buttonState: 'normal'

    })

} else if(buttonState === "StudentId"){


  this.setState({
    
    scanned: true,
    scannedStudentId: data,
    buttonState: 'normal'

  })


}
  }



  render() {
    console.log(this.state)

    if (this.state.hasCamPermission === true && this.state.buttonState !== 'normal') {

      return (

        <BarCodeScanner
          onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )
    }

    else if (this.state.buttonState === 'normal') {
      return (

       <View style = {{flex:1, alignSelf:'center', justifyContent: 'center'}}>
         
        <View>
        <Image
        source = {require("../assets/booklogo.jpg")}
        style = {{width:200, height:200}}
        />
        <Text style = {{fontSize:50, textAlign:'center'}}>Wily App</Text>



        </View>
         <View style = {{flexDirection:'row', margin:10}}>
           <TextInput 
           style = {{
            width: 200,
            height: 40,
            borderWidth: 1.5,
            borderRightWidth: 0,
            fontSize: 20}}

           placeholder = 'BookId'
           
           value = {this.state.scannedBookId}
           />
           <TouchableOpacity 
           style ={{
            backgroundColor: '#66BB6A',
            width: 50,
            borderWidth: 1.5,
            borderLeftWidth: 0

           }}
           
           onPress={()=>{this.getCameraPermission('BookId')}}
         
           
           >
             <Text style = {{fontSize:15, textAlign: 'center', marginTop:10}}>Scan</Text>
           </TouchableOpacity>


         </View>

         <View style = {{flexDirection:'row', margin:10}}>
           <TextInput 
           style = {{
            width: 200,
            height: 40,
            borderWidth: 1.5,
            borderRightWidth: 0,
            fontSize: 20}}

           placeholder = 'StudentId'
           
           value = {this.state.scannedStudentId}
           />
           <TouchableOpacity 
           style ={{
            backgroundColor: '#66BB6A',
            width: 50,
            borderWidth: 1.5,
            borderLeftWidth: 0

            
           }}
           
           onPress = {()=>{this.getCameraPermission('StudentId')}}
           
           >
             <Text style = {{fontSize:15, textAlign: 'center', marginTop:10}}>Scan</Text>
           </TouchableOpacity>


         </View>



       </View>



      );
    }
  }
}

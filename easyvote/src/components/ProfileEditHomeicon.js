import React from 'react';
import {Text,View, StyleSheet,Image,TouchableOpacity} from 'react-native'
//import Swipeout from 'react-native-swipeout';
//import {delpro} from '../actions';
//import {connect} from 'react-redux';
import { AsyncStorage } from "react-native"
import { ForwardButton } from './ForwardButton';

class  ProfileEditHomeicon extends React.Component{


          renderImage(){
              
            return(
                <Image
                style={{height: 40, width:40, marginRight:15,}}
                source={require('../.././images/logoicon.png')}
                resizeMode = 'contain'
                />
            );


        } 
          

  

       
         render(){
           

        return(
            // <Swipeout {...swipeSettings} >
            <TouchableOpacity onPress={() =>{this.props.press.navigate(this.props.place,{Id: this.props.Id,Name:this.props.Name,Candidates:this.props.Candidates,UserId:this.props.UserId})}} style={styles.listStyle} >
                {this.renderImage()}
                <View  /* style={{width:"80%"}} */>
                <Text style={{fontWeight:'bold', fontSize:18}}>
                    {this.props.Name}
                </Text>
                 </View>
                 
             </TouchableOpacity>  
           //  </Swipeout> 
        );
    };
    }
     const styles = StyleSheet.create({  
        listStyle: {
           // padding:10,
            opacity: 0.9,
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
            width:'90%',
           // alignSelf:'center',
            marginTop:8,
            marginBottom:10,
            //height:40,
            marginLeft:5,
            //marginBottom:10,
            borderBottomWidth:1,
            borderColor:"#D3D3D3"

        }
    
    
    }); 

   
    
    
    export default (ProfileEditHomeicon); //connect(null,{delpro})
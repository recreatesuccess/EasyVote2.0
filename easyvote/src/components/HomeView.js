import React, { Component } from 'react';
//import {Header} from './Header';
import {HomeHeader2,Spinner} from './index';
import {connect} from 'react-redux';
import {candidateInfo,sendVote} from '../actions';
import { AsyncStorage } from "react-native"
//import Myimage from '../.././images/p.png';

import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  Image,
  Platform
 
} from 'react-native';


class HomeView extends Component {

    state = {
        FirstName:  this.props.navigation.state.params.FirstName,
        CanId:  this.props.navigation.state.params.CanId,
        ElecId:  this.props.navigation.state.params.ElecId,
        UserId: this.props.navigation.state.params.UserId,
        description:this.props.navigation.state.params.description,
        image:this.props.navigation.state.params.image,
    } 


    componentDidMount(){
     // console.log(this.state.image);
    }


  next(){
    if(this.props.logintrigger){
        this.props.navigation.navigate('Profile',{Id: this.state.UserId});;
    }
}

renderButton(){
  if(this.props.loading){
   return <Spinner size="small"/>;
 }
 else{ 
  return <Button onPress={this.onButtonPress.bind(this)} title="VOTE"/>
 }
}


  onButtonPress(){
    const {CanId,ElecId,FirstName,UserId} = this.state;
    this.props.sendVote({CanId,ElecId,FirstName,UserId});
    
   }

    

        render() {
    
            return (
             <SafeAreaView style={styles.container}>
            
            <HomeHeader2 place2={'ProfileEdit'} ti={this.state.FirstName}  navigate={this.props.navigation.goBack}/>
              
              <Image
                    style={{height: 200,marginBottom:20,marginTop:20, width:200,borderRadius: Platform.OS === 'ios' ? 100 : 50}}
                    source={{uri:this.state.image}}
                    resizeMode = 'contain'
                    />

        
            
              
              <Text style={{width:'96%',alignSelf:"center", padding:12, paddingTop:2, fontSize:15}}>{this.state.description}</Text>
             
              
              <Text  style={{ width:'96%',alignSelf:"center", padding:12, marginTop:2, marginBottom:10, fontSize:20}}>Vote For Me</Text>
          

{this.renderButton()}
{this.next()}
             </SafeAreaView>
            );
          }



}

const styles = StyleSheet.create({
    container: {
      flex:1,
      alignItems:'center',
      backgroundColor: 'white',
      //justifyContent:'space-between',
      flexDirection:'column',
    },
    ImageStyle:{
      //borderWidth: 1,
      flexDirection:'column',
      height: '50%',
      width: '100%',
      justifyContent:'flex-end',
      alignItems: 'center',  
      
  },
  listStyle: {
      padding:27,
      opacity: 0.9,
      justifyContent: 'flex-start',
      width:'100%',
      //height:'10%',
      borderBottomWidth:1,
      borderColor:"white"
  }
  
    
  });

const mapStateToProps = state =>{
    return{
       
      loading:state.auth.loading,
      // Vals: state.auth.infol,
      // hope:state.auth.hope,
      //
      logintrigger:state.auth.logintrigger,
     }
  };

export default connect(mapStateToProps,{candidateInfo,sendVote})(HomeView);
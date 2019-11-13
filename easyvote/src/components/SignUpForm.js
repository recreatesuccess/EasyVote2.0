import React, { Component } from 'react';
import {FormInput,Card,FormButton,HomeHeader2,Spinner,ForwardButton} from './index';
import {connect} from 'react-redux';
import {emailChanged,passwordChanged,login} from '../actions';
import { AsyncStorage } from "react-native"
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
  Image
} from 'react-native';


class SignUpForm extends Component {

      next(){
          if(this.props.logintrigger){
             const {Active} = this.props;
              AsyncStorage.setItem('ID',JSON.stringify(Active));
              this.props.navigation.navigate('TwoF',{Id: this.props.Active});
          }
      }

     onEmailChanged(text){
        this.props.emailChanged(text);
    }
    
    onPasswordChanged(text){
        this.props.passwordChanged(text);
     } 

     onButtonPress(){
        // this.props.navigation.navigate('Profile');
       const {email,password} = this.props;
      this.props.login({email,password}); 
      
     }

   /* renderError(){
    if(this.props.error){
      return(
        <View>
          <Text style={{alignSelf: 'center', color: 'red'}}> {this.props.error}</Text>
        </View>
      );
    }
  } */

  renderButton(){
     if(this.props.loading){
      return <Spinner size="small"/>;
    }
    else{ 
     return <ForwardButton press={this.onButtonPress.bind(this)} place ={'TwoF'}/>
    }
  }

  render() {
    //const {vall} = this.props;
    return (
    <SafeAreaView style ={{width:'100%', height:'100%', backgroundColor:'white'}} >
     <HomeHeader2 navigate={this.props.navigation.goBack}/>
      <KeyboardAvoidingView style={{width:'90%',margin:'5%',marginTop:'20%'}} behavior = {(Platform.OS === 'ios') ? 'position' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
       
        <View style = {styles.viewStyle}>
        <Image
                style={{height: 100, alignSelf:'center', width:100}}
                source={require('../.././images/logoicon.png')}
                resizeMode = 'contain'
                />
                <View>
                <Text style={{fontSize:24}}>EasyVote</Text>
                <Text style={{fontSize:14}}>Login</Text>
                </View>
        </View>

        <Card>
        <FormInput val={this.props.email} ct={this.onEmailChanged.bind(this)}  bool = {false} ph = {"Email"}/>
        </Card>
        
        
        
        {/* <View style={{height: 40, alignItems:'center', alignSelf: 'center', width: "100%"}}> */}
       

        <Card>
        <FormInput val={this.props.password} ct={this.onPasswordChanged.bind(this)}  bool = {true} ph = {"Input Password"}/>
        </Card>
            {this.next()}
       {/* </View> */}
       <View >
      {this.renderButton()}
       
       </View>
       </View>
       
       
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      </SafeAreaView>
     
       
      
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: '#F4F2F3',
      width: '100%',

    },
    viewStyle: {
       // height: '100%',
       marginTop: '20%',
        width: '100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
   
    
  });


  const mapStateToProps = state =>{
    return{
       email: state.auth.email,
       password: state.auth.password,
        logintrigger:state.auth.logintrigger,
        Active:state.auth.Active,
        loading:state.auth.loading
       }
};

export default connect(mapStateToProps,{emailChanged,passwordChanged,login})(SignUpForm) ;

 

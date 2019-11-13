import React, { Component } from 'react';
import {Text} from 'react-native';
import {HomeHeader2} from './index';
import {connect} from 'react-redux';
//import {connect} from 'react-redux';
import ProfileEditHomeCan from './ProfileEditHomeCan';
//import {Fetchcandidate} from '../actions';
import { AsyncStorage } from "react-native"
import ProfileHome from './ProfileHome';
import {
  Platform,
  StyleSheet,
  ListView,
  SafeAreaView,
  Keyboard
} from 'react-native';




class CandidateListForm extends Component {
    constructor(props) {
        super(props);
      this.state = {
        Id:  this.props.navigation.state.params.Id,
        UserId:this.props.navigation.state.params.UserId,
        elecName:  this.props.navigation.state.params.Name,
        Candidates:  this.props.navigation.state.params.Candidates,
        navigate:this.props.navigation,
        profiles: [
          {
            Name: "Donald Trump",
            Party: '../.././images/profile.png',
            Age:24
    
          }, 
         {
          Name: "Howard Schultz",
          Party: '../.././images/profile.png',
          Age:24
            
          },
          {
            Name: "Elizabeth Warren",
            Party: "Republican",
            Age:24
    
          }, 
         {
          Name: "Beto O'Rourke",
          Party: "Democrats",
          Age:24
            
          },
          {
            Name: "Bernie Sanders",
            Party: "Republican",
            Age:24
    
          }, 
         {
          Name: "Kamala Harris",
          Party: "Democrats",
          Age:24
            
          },
          
      ],
    }
    this.renderRow=this.renderRow.bind(this);
      }


      componentDidMount(){
        let valll = this.state.Id;
        console.log(valll);
        
        //let elecName = this.state.elecName
       // this.props.Fetchcandidate({valll,elecName});
    }


    

  getProfiles(){
    //return  this.props.Candidate;
    return  this.state.Candidates;
  }
    

  renderRow(item){
    return <ProfileEditHomeCan press = {this.state.navigate} CanId = {item._id} UserId={this.state.UserId} ElecId = {this.state.Id} place ={'HomeCan'} description={item.description} image={item.image} Name = {item.firstName+" "+item.lastName} /> 
    }

  renderButton(){ 
   /*  if(this.props.loading){
      return <Spinner size="large"/>;
    }
    else{ */
    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.dataSource = ds.cloneWithRows(this.getProfiles())
     return <ListView
    // horizontal={true}
     style={{width:'90%',marginTop:'10%'}}
     dataSource={this.dataSource}
     enableEmptySections = {true}
     renderRow={this.renderRow}
     />
      ;
    //}
  }

  render() {
    //const {vall} = this.props;
    return (
    <SafeAreaView style={{width:'100%', height:'100%',backgroundColor:'white',alignItems:'center', marginTop:'5%'}}>
    <HomeHeader2 place2={'ProfileEdit'} ti="Candidates"  navigate={this.props.navigation.goBack}/>
      {this.renderButton()}
      </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F4F2F3',
      width: '100%',

    },
    viewStyle: {
       // height: '100%',
       marginTop: '50%',
        width: '100%',
    },
   
    
  });

  const mapStateToProps = state =>{
  
    const Candidate = _.map(state.auth.Candidate,(Val,uid) =>{
      return {...Val};
    });
  
  
  return {Candidate,loading:state.pro.loading1};
  };

export default CandidateListForm; //connect(mapStateToProps,{Fetchcandidate})(CandidateListForm);

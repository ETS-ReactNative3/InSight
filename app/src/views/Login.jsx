import React from "react"
import { StyleSheet, Text, View, Image, AsyncStorage } from "react-native"
import { Button } from "react-native-elements"
import * as Google from "expo-google-app-auth";
import axios from 'axios';
import {andriodId, iphoneId, deployment } from 'react-native-dotenv';
import NavBar from './NavBar';
import Colors from '../constants/Colors';


export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      name: "",
      photoUrl: ""
    }
  }
  signIn = async () => {
    try {
      const { type, accessToken, user} = await Google.logInAsync({
        androidClientId: andriodId,
        iosClientId: iphoneId,
        scopes: ["profile", "email"]
      })
    
      if (type === "success") {
        //  STORE THE USER TOKEN
        storeData = async () => {
          try {
            await AsyncStorage.setItem('@token', accessToken) // Stores the data across the app
          } catch (e) {
            // saving error
          }
        }
        storeData();

        //  SET THE STATE  TO USER DATA
        this.setState({
          signedIn: true,
          name: user.name,
          photoUrl: user.photoUrl
        })
        // ADD THE USER TO THE DATABASE
        return axios.post(`http://${deployment}:8080/profile/user/`, {
          user,
          accessToken,
        });

      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>

        {this.state.signedIn ? (
          <LoggedInPage name={this.state.name} photoUrl={this.state.photoUrl} navigation={this.props.navigation} />
        ) : (
            <LoginPage signIn={this.signIn} />
          )}
      </View>
    )
  }
}

const LoginPage = props => {
  return (
    <View style={styles.container}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      >
        <Image
          styles={{ flex: 1, resizeMode: 'contain' }}
          source={require('../assets/images/bg1.png')}
        />
      </View>
      <Text style={styles.signIn}>Welcome to InSight! </Text>
      <Button 
        title="Sign in with Google" 
        containerStyle={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 10,
          borderRadius: 10, // adds the rounded corners
        }}
        buttonStyle={{ backgroundColor: Colors.secondary }}
        onPress={() => props.signIn()} 
      />
    </View>
  )
}

const LoggedInPage = props => {
  return (
    <View style={{flex: 1}}>
      <NavBar navigation={props.navigation} name="Main" />
      <View style={styles.container}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      >
        <Image
          styles={{ flex: 1, resizeMode: 'contain' }}
          source={require('../assets/images/bg2.png')}
        />
      </View>
        <Text style={styles.header}>InSight</Text>
        <Text style={styles.welcome}>Welcome {props.name}!</Text>
        <Image style={styles.image} source={{ uri: props.photoUrl }} />
        <Text style={styles.body}>Swipe right to start your journey to financial enlightenment!</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  },
  header: {
    fontWeight: 'bold',
    // fontFamily: 'LobsterTwo-Bold',
    fontSize: 56,
    marginTop: 10,
    color: Colors.primary,
  },
  signIn: {
    fontWeight: 'bold',
    // fontFamily: '',
    fontSize: 60,
    textAlign: "center",
    color: Colors.primary,
    margin:30
  },
  welcome: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  body: {
    fontSize: 16,
    marginTop: 10,
    margin: 30,
    padding: 20,
    textAlign: "center",
    fontWeight: 'bold',
  },
})
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Animated,StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import {PlayerContext} from '../navigation/BottomTabNavigator';

const CopyrightRow = (props:Object)=>{
  return(
    <View style={styles.copyrightRow}>
      <Text style={styles.copyrightText}>Copyright 2021 - William A. Rodríguez Jiménez</Text>
    </View>
  )
}


export default function WelcomeScreen(props:Object) { 
  let playerContext = useContext(PlayerContext);
  function startAIGame(){
    playerContext.setAgainstAI(true);
    props.navigation.navigate("LevelSelectionScreen");
  }

  function startTwoPlayerGame(){
    playerContext.setAgainstAI(false);
    props.navigation.navigate("EmojiSelectionScreen",{currentPlayer:1});

  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Emoji Tic Tac Toe!</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <LinearGradient 
          colors={['red', 'yellow']} 
          start={{
            x: 0,
            y: 0
          }}
          end={{
            x: 1,
            y: 1
          }}
          style={styles.playButton}>   
          <TouchableOpacity style={styles.playButton} onPress={startAIGame}>
              <Text style={styles.playButtonText}>Play against AI</Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient 
          colors={['red', 'yellow']} 
          start={{
            x: 0,
            y: 0
          }}
          end={{
            x: 1,
            y: 1
          }}
          style={styles.playButton}>   
          <TouchableOpacity style={styles.playButton} onPress={startTwoPlayerGame}>
              <Text style={styles.playButtonText}>Play with Two Players</Text>
          </TouchableOpacity>
        </LinearGradient>        
        <CopyrightRow/>
      </View>
  );
}

let BLOCK_SIDE_LENGTH = 100; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  playButton:{
      padding:5,
      borderRadius:10,
      margin:10,
  },
  playButtonText:{
      fontSize:20,
  },
  copyrightRow:{
    position:'absolute',
    bottom:30,
  }  
});

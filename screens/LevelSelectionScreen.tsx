import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, View } from '../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';


const PlayAIGameButton = (props:Object) =>{
    return(
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
          <TouchableOpacity style={styles.playButton} onPress={props.onPress}>
              <Text style={styles.playButtonText}>{props.title}</Text>
          </TouchableOpacity>
        </LinearGradient>
    )
}

export default function WelcomeScreen(props:Object) { 
  function startAIGame(level:Number){
    props.navigation.navigate("EmojiSelectionScreen",{AIlevel:level,currentPlayer:1});
  }


  return (
      <View style={styles.container}>
        <Text style={styles.title}>Emoji Tic Tac Toe!</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <PlayAIGameButton title={'Beginner'} onPress={()=>startAIGame(1)}/>            
        <PlayAIGameButton title={'Intermediate'} onPress={()=>startAIGame(2)}/>            
        <PlayAIGameButton title={'Advanced'} onPress={()=>startAIGame(3)}/>            
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

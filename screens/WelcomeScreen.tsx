import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Animated,StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';




export default function WelcomeScreen() {
  

  

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
        <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>Play!</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>
  );
}

let BLOCK_SIDE_LENGTH = 100; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
      padding:10,
      borderRadius:10,

  },
  playButtonText:{
      fontSize:20,
  }
});

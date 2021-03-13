import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Animated,StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, View } from '../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import {PlayerContext} from '../navigation/AppNavigator';
import EMOJI_LIST from '../constants/Emojis';
import {getRandomElementInList} from '../constants/Functions';


const CopyrightRow = (props:Object)=>{
  return(
    <View style={styles.copyrightRow}>
      <Text style={styles.copyrightText}>Made with ❤️ by William A. Rodríguez Jiménez</Text>
    </View>
  )
}


const BannerRow = (props:Object) =>{

  let threeRandomEmojis = [getRandomElementInList(EMOJI_LIST),getRandomElementInList(EMOJI_LIST),getRandomElementInList(EMOJI_LIST)];

  const [demoEmoji1,] = useState(getRandomElementInList(threeRandomEmojis));
  const [demoEmoji2,] = useState(getRandomElementInList(threeRandomEmojis));
  const [demoEmoji3,] = useState(getRandomElementInList(threeRandomEmojis));


  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;


  const sideLength1 = useRef(new Animated.Value(1)).current;
  const sideLength2 = useRef(new Animated.Value(1)).current;
  const sideLength3 = useRef(new Animated.Value(1)).current;



  const fadeIn = (fadeAnim:Animated.Value):Animated.CompositeAnimation => {
    // Will change fadeAnim value to 1 in 5 seconds
    return Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver:true,
    });
  };

  const scaleUp = (sideLength:Animated.Value):Animated.CompositeAnimation =>{
    return Animated.timing(sideLength, {
      toValue: 1,
      duration: 500,
      useNativeDriver:true,
    });
  };

  const scaleDown = (sideLength:Animated.Value):Animated.CompositeAnimation =>{

    return Animated.timing(sideLength, {
      toValue: 0,
      duration: 250,
      useNativeDriver:true,
    });
  };  

  let makeAllThreeDisappear = Animated.parallel([scaleDown(sideLength1),scaleDown(sideLength2),scaleDown(sideLength3)])
  let makeAllThreeAppear = Animated.parallel([scaleUp(sideLength1),scaleUp(sideLength2),scaleUp(sideLength3)])

  const animation = (Animated.sequence([fadeIn(fadeAnim1),fadeIn(fadeAnim2),fadeIn(fadeAnim3),makeAllThreeDisappear,makeAllThreeAppear]))

  animation.start();

  return(
    <Animated.View style={styles.bannerRow}>
      <Animated.Text   style={[
          styles.bannerEmoji,
          {
            transform:[{scale:sideLength1}],
            opacity: fadeAnim1, // Bind opacity to animated value
          },
        ]}>{demoEmoji1}</Animated.Text>      
      <Animated.Text   style={[
          styles.bannerEmoji,
          {
            transform:[{scale:sideLength2}],
            opacity: fadeAnim2, // Bind opacity to animated value
          },
        ]}>{demoEmoji2}</Animated.Text>          
      <Animated.Text   style={[
          styles.bannerEmoji,
          {
            transform:[{scale:sideLength3}],
            opacity: fadeAnim3, // Bind opacity to animated value
          },
        ]}>{demoEmoji3}</Animated.Text>                        
    </Animated.View>
  )
}


export default function WelcomeScreen(props:Object) { 

  const [stopAnimation, setStopAnimation] = useState(false);

  let playerContext = useContext(PlayerContext);
  function startAIGame(){
    setStopAnimation(false);
    playerContext.setAgainstAI(true);
    props.navigation.navigate("LevelSelectionScreen");
  }

  function startTwoPlayerGame(){
    playerContext.setAgainstAI(false);
    props.navigation.navigate("EmojiSelectionScreen",{currentPlayer:1});

  }
  return (
      <View style={styles.container}>
        <Text style={styles.title}>emoji</Text>
        <Text style={styles.title}>Tic Tac Toe</Text>
        <BannerRow stopAnimation={stopAnimation}/>
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
  },
  title: {
    textAlign:'center',
    fontSize: 50,
    fontWeight: 'bold',
  },
  bannerRow:{
    flexDirection:'row',
  },
  bannerEmoji:{
    zIndex:0,
    fontSize:50,
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

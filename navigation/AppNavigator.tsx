import { createStackNavigator } from '@react-navigation/stack';
import React,{createContext, useState} from 'react';

import GameScreen from '../screens/GameScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LevelSelectionScreen from '../screens/LevelSelectionScreen';
import EmojiSelectionScreen from '../screens/EmojiSelectionScreen';


const TabOneStack = createStackNavigator();
export const PlayerContext = createContext();

export default function TabOneNavigator() {
  const [playerOne,setPlayerOne] = useState();
  const [playerOneScore,setPlayerOneScore] = useState(0);

  const [playerTwo,setPlayerTwo] = useState();
  const [playerTwoScore,setPlayerTwoScore] = useState(0);
  const [ties,setTies] = useState(0);
  const [againstAI,setAgainstAI] = useState(false);

  return (
    <PlayerContext.Provider value={{playerOne:playerOne,setPlayerOne:setPlayerOne,
      playerOneScore:playerOneScore,setPlayerOneScore:setPlayerOneScore,
      playerTwo:playerTwo,setPlayerTwo:setPlayerTwo,
      playerTwoScore:playerTwoScore,setPlayerTwoScore:setPlayerTwoScore,
      ties:ties,setTies:setTies,
      againstAI:againstAI,setAgainstAI:setAgainstAI,}}>
      <TabOneStack.Navigator>
        <TabOneStack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerTitle: 'Home' }}
        />
        <TabOneStack.Screen
          name="LevelSelectionScreen"
          component={LevelSelectionScreen}
          options={{ headerTitle: 'Choose AI Level' }}
        />               
        <TabOneStack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{ headerTitle: 'Emoji Tic Tac Toe' }}
        />
        <TabOneStack.Screen
          name="EmojiSelectionScreen"
          component={EmojiSelectionScreen}
          options={{ headerTitle: 'Player 1 Emoji Selection' }}
        />
        <TabOneStack.Screen
          name="EmojiSelectionScreen2"
          component={EmojiSelectionScreen}
          options={{ headerTitle: 'Player 2 Emoji Selection' }}
        />                   
      </TabOneStack.Navigator>
    </PlayerContext.Provider>
  );
}
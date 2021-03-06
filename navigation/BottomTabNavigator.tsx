import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React,{createContext, useState} from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import GameScreen from '../screens/GameScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import TabTwoScreen from '../screens/TabTwoScreen';

import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import EmojiSelectionScreen from '../screens/EmojiSelectionScreen';


// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator();
export const PlayerContext = createContext();

export default function TabOneNavigator() {
  const [playerOne,setPlayerOne] = useState();
  const [playerOneScore,setPlayerOneScore] = useState(0);

  const [playerTwo,setPlayerTwo] = useState();
  const [playerTwoScore,setPlayerTwoScore] = useState(0);
  const [againstAI,setAgainstAI] = useState(false);



  return (
    <PlayerContext.Provider value={{playerOne:playerOne,setPlayerOne:setPlayerOne,
      playerOneScore:playerOneScore,setPlayerOneScore:setPlayerOneScore,
      playerTwo:playerTwo,setPlayerTwo:setPlayerTwo,
      playerTwoScore:playerTwoScore,setPlayerTwoScore:setPlayerTwoScore,
      againstAI:againstAI,setAgainstAI:setAgainstAI}}>
      <TabOneStack.Navigator>
        <TabOneStack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerTitle: 'Home' }}
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

const TabTwoStack = createStackNavigator();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </TabTwoStack.Navigator>
  );
}

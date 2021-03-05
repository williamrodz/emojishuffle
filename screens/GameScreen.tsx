import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Animated,StyleSheet,Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { PlayerContext } from '../navigation/BottomTabNavigator';

let EMPTY = ""
let NUM_ROWS = 3;


const GameContext = createContext();

function getCoord(r,c){
  return {r:r,c:c}
}

function checkForWin(grid,currentPlayer){

  // across
  for (var r=0; r< NUM_ROWS; r++){
    if (grid[`row${r}`][`col${0}`] === currentPlayer && grid[`row${r}`][`col${0}`] === grid[`row${r}`][`col${1}`] && grid[`row${r}`][`col${1}`] === grid[`row${r}`][`col${2}`]){
      alert(`win across row ${r} `)
      return true;
    }    
  }

  // down
  for (var c=0; c< NUM_ROWS; c++){
    if (grid[`row${0}`][`col${c}`] === currentPlayer && grid[`row${0}`][`col${c}`]=== grid[`row${1}`][`col${c}`] && grid[`row${1}`][`col${c}`] === grid[`row${2}`][`col${c}`]){
      alert(`win down col ${c} `)
      return true;
    }    
  }

  // diag
  if (grid[`row${0}`][`col${0}`] === currentPlayer && grid[`row${0}`][`col${0}`]=== grid[`row${1}`][`col${1}`] && grid[`row${1}`][`col${1}`] === grid[`row${2}`][`col${2}`]){
    alert(`win in diag  ↘️`)    
    return true;
  }    
  if (grid[`row${2}`][`col${0}`] === currentPlayer && grid[`row${2}`][`col${0}`]=== grid[`row${1}`][`col${1}`] && grid[`row${1}`][`col${1}`] === grid[`row${0}`][`col${2}`]){
    alert(`win in diag  ↗️`)    
    
    return true;
  }
  
  return false;


}


const SlotBlock = (props) =>{
  let gameState = useContext(GameContext);
  let playerContext = useContext(PlayerContext);




  function updateBlockValue(){
    gameState.updateCoordWithValue(getCoord(props.row,props.col),gameState.currentPlayer)

  } 
  function changePlayer(){
    let playerThatGoesNext = playerContext.playerOne === gameState.currentPlayer ? playerContext.playerTwo : playerContext.playerOne
    gameState.setCurrentPlayer(playerThatGoesNext)
  }

  function processMove(){
    updateBlockValue()
    if (checkForWin(gameState.grid,gameState.currentPlayer)){
      gameState.setGameWon(true);
      if (gameState.currentPlayer === playerContext.playerOne){
        playerContext.setPlayerOneScore(playerContext.playerOneScore+1)
      } else{
        playerContext.setPlayerTwoScore(playerContext.playerTwoScore+1)

      }
      Alert.alert(
        "Winner declared!",
        `Congratulations, ${gameState.currentPlayer}`,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );      
    } else {
      changePlayer()
    }

  }

  let BORDER_WIDTH = 2

  let borderStyle = {
    borderTopWidth:props.row > 0 ? BORDER_WIDTH : 0,
    borderLeftWidth:props.col > 0 ? BORDER_WIDTH : 0,

  }


  return (
    <TouchableOpacity disabled={gameState.gameWon} style={{...styles.slotBlock,...borderStyle}} onPress={processMove} >
      <Text style={styles.slotBlockTextContainer}>{gameState.grid[`row${props.row}`][`col${props.col}`]}</Text>
    </TouchableOpacity>
  )
}

const SlotRow = (props:any) =>{
  return (
    <View style={styles.slotRow}>
      <SlotBlock row={props.rowNumber} col={0}/>
      <SlotBlock row={props.rowNumber} col={1}/>
      <SlotBlock row={props.rowNumber} col={2}/>
    </View>
  )
}

const SlotMachine = (props:any) =>{

  return (
    <View style={styles.containerOfRows}>
      <SlotRow rowNumber={0}/>
      <SlotRow rowNumber={1}/>
      <SlotRow rowNumber={2}/>
    </View>
  )
}



export default function TabOneScreen() {
  let DEFAULT_ROW = {col0:EMPTY,col1:EMPTY,col2:EMPTY}
  let DEFAULT_GRID = {row0:{...DEFAULT_ROW},row1:{...DEFAULT_ROW},row2:{...DEFAULT_ROW}}  
  
  const playerContext = useContext(PlayerContext);
  const [grid,setGrid] = useState(DEFAULT_GRID); 

  const [gameWon,setGameWon] = useState(false);

  var randomIndex = Math.round(Math.random() * 2);

  let defaultPlayer = randomIndex === 1.0 ? playerContext.playerOne : playerContext.playerTwo;
  const [currentPlayer,setCurrentPlayer] = useState(defaultPlayer)

  const updateCoordWithValue = (coord,value) =>{
    let r = coord.r;
    let c = coord.c;
    var newGrid = {...grid}
    let rowKey = `row${r}`;
    let colKey = `col${c}`;
    newGrid[rowKey][colKey] = currentPlayer;
    setGrid(newGrid);
  }

  

  return (
    <GameContext.Provider value={{currentPlayer:currentPlayer,setCurrentPlayer:setCurrentPlayer,grid:grid,updateCoordWithValue:updateCoordWithValue,gameWon:gameWon,setGameWon:setGameWon}}>
      <View style={styles.container}>
        <Text style={styles.title}>Tab One</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.instructions}>{`Score:`}</Text>
        <Text style={styles.instructions}>{`${playerContext.playerOne} | ${playerContext.playerTwo}`}</Text>
        <Text style={styles.instructions}>{`${playerContext.playerOneScore} : ${playerContext.playerTwoScore}`}</Text>

        <Text style={styles.instructions}>{`Current Player:`}</Text>
        <Text style={styles.currentPlayer}>{`${currentPlayer}`}</Text>

        
        <SlotMachine/>
      </View>
    </GameContext.Provider>
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
  instructions:{
    fontSize:30,
  },
  currentPlayer:{
    fontSize:40,
  },
  containerOfRows:{
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  slotRow:{
    flexDirection:'row',
  },
  slotBlock:{
    width:BLOCK_SIDE_LENGTH,
    height:BLOCK_SIDE_LENGTH,
    alignItems:'center',
    justifyContent:'center',
  },
  slotBlockTextContainer:{
    fontSize:60,
  }
});

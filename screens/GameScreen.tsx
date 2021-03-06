import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Animated,StyleSheet,Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { PlayerContext } from '../navigation/BottomTabNavigator';

let EMPTY = ""
let NUM_ROWS = 3;
let NUM_COLS = 3;


const GameContext = createContext(null);

function getCoord(r:Number,c:Number){
  return {r:r,c:c}
}

function getEmptyCoords(grid:Object){
  var emptyCoords = [];

  for(var r =0; r < NUM_ROWS; r++){
    for (var c=0; c< NUM_COLS; c++){
      let coord = getCoord(r,c)
      if (getValueFromGrid(coord,grid) === EMPTY){
        emptyCoords.push(coord);
      }
    }
  }
  return emptyCoords;
}

function getValueFromGrid(coord:any,grid:any){
  return grid[`row${coord.r}`][`col${coord.c}`];
}

function isGridFull(grid:Object){
  for (var r=0; r< NUM_ROWS; r++){
    for (var c=0; c< NUM_ROWS; c++){
      if (grid[`row${r}`][`col${c}`] === EMPTY){
        return false;
      }
    }
  } 
  console.log(`Grid is full`);
return true;
}

function checkForWin(grid:Object,currentPlayer:String){

  // across
  for (var r=0; r< NUM_ROWS; r++){
    if (grid[`row${r}`][`col${0}`] === currentPlayer && grid[`row${r}`][`col${0}`] === grid[`row${r}`][`col${1}`] && grid[`row${r}`][`col${1}`] === grid[`row${r}`][`col${2}`]){
      // alert(`win across row ${r} `)
      return true;
    }    
  }

  // down
  for (var c=0; c< NUM_ROWS; c++){
    if (grid[`row${0}`][`col${c}`] === currentPlayer && grid[`row${0}`][`col${c}`]=== grid[`row${1}`][`col${c}`] && grid[`row${1}`][`col${c}`] === grid[`row${2}`][`col${c}`]){
      // alert(`win down col ${c} `)
      return true;
    }    
  }

  // diag
  if (grid[`row${0}`][`col${0}`] === currentPlayer && grid[`row${0}`][`col${0}`]=== grid[`row${1}`][`col${1}`] && grid[`row${1}`][`col${1}`] === grid[`row${2}`][`col${2}`]){
    // alert(`win in diag  ↘️`)    
    return true;
  }    
  if (grid[`row${2}`][`col${0}`] === currentPlayer && grid[`row${2}`][`col${0}`]=== grid[`row${1}`][`col${1}`] && grid[`row${1}`][`col${1}`] === grid[`row${0}`][`col${2}`]){
    // alert(`win in diag  ↗️`)    
    
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

  function processMove(){
    updateBlockValue()
    if (checkForWin(gameState.grid,gameState.currentPlayer)){
      gameState.processWonGame()
    }
    else if (isGridFull(gameState.grid)){
      gameState.processTie()    
    }
    else {
      gameState.changePlayer()    
    }
  }

  let BORDER_WIDTH = 2

  let borderStyle = {
    borderTopWidth:props.row > 0 ? BORDER_WIDTH : 0,
    borderLeftWidth:props.col > 0 ? BORDER_WIDTH : 0,

  }


  return (
    <TouchableOpacity disabled={gameState.gameFinished} style={{...styles.slotBlock,...borderStyle}} onPress={processMove} >
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


function getRandomElementInList(sampleList:Array<any>){
  return sampleList[Math.floor(Math.random() * sampleList.length)];
}

function getStringOfGrid(grid:Object){
  var stringVisualization = "";
  for(var r=0; r < NUM_ROWS; r++){
    for (var c=0; c<NUM_COLS; c++){
      let valueAtSpot = grid[`row${r}`][`col${c}`]
      if (valueAtSpot === EMPTY){
        stringVisualization += "  "
      } else{
        stringVisualization += valueAtSpot
      }
      if (c < NUM_COLS - 1){
        stringVisualization += "|"
      }
    }
    if (r < NUM_ROWS - 1){
      stringVisualization += "\n________\n"
    }
  }

  return "BOARD\n"+stringVisualization + "\nENDBOARD";
}

export default function TabOneScreen() {
  let DEFAULT_ROW = {col0:EMPTY,col1:EMPTY,col2:EMPTY}
  let DEFAULT_GRID = {row0:{...DEFAULT_ROW},row1:{...DEFAULT_ROW},row2:{...DEFAULT_ROW}}  
  
  const playerContext = useContext(PlayerContext);
  const [grid,setGrid] = useState(DEFAULT_GRID); 
  const [gameFinished,setGameFinished] = useState(false);
  const [againstAI,setAgainstAI] = useState(playerContext.againstAI);

  var randomIndex = Math.round(Math.random() * 2);

  let defaultPlayer = randomIndex === 1.0 ? playerContext.playerOne : playerContext.playerTwo;
  const [currentPlayer,setCurrentPlayer] = useState(defaultPlayer)

  function getNextMoveForAIPlayer(grid:Object,player:String){
    // check if there is a one to win
    let emptyCoords = getEmptyCoords(grid);
    var nextSpot = getRandomElementInList(emptyCoords);

    for (var i =0; i < emptyCoords.length; i++){
      let spot = emptyCoords[i];
      let gridFilled = getGridWithNewValueAtCoord(spot,player);
      // console.log(getStringOfGrid(gridFilled));
      if (checkForWin(gridFilled,player)){
        nextSpot = spot;
        break;
      }
    }
    return nextSpot;
  }  

  function makeAImove(){
    let nextMoveLocation =  getNextMoveForAIPlayer(grid,playerContext.playerTwo);
    console.log(`>>>AI will process move at r=${nextMoveLocation.r},c=${nextMoveLocation.c}`)
    updateCoordWithValue(nextMoveLocation,playerContext.playerTwo);
    let gridFilled = getGridWithNewValueAtCoord(nextMoveLocation,playerContext.playerTwo);

    if (checkForWin(gridFilled,playerContext.playerTwo)){
      console.log(`AI won game`);
      processWonGame();
    } else if (isGridFull(gridFilled)){
      processTie();
    } 
  }


  useEffect(()=>{
    if (againstAI && currentPlayer === playerContext.playerTwo){
      if (!isGridFull(grid)){
        makeAImove();
        changePlayer();
      } else{
        processTie();
      }
 
    }
  },[currentPlayer])

  function getGridWithNewValueAtCoord(coord:Object,value:String){
    let r = coord.r;
    let c = coord.c;
    var newGrid = JSON.parse(JSON.stringify(grid))
    let rowKey = `row${r}`;
    let colKey = `col${c}`;
    newGrid[rowKey][colKey] = currentPlayer;   
    return newGrid; 

  }
  const updateCoordWithValue = (coord,value) =>{
    setGrid(getGridWithNewValueAtCoord(coord,value));
  }

  function changePlayer(){
    let playerThatGoesNext = playerContext.playerOne === currentPlayer ? playerContext.playerTwo : playerContext.playerOne
    setCurrentPlayer(playerThatGoesNext)
    
  }

  function processWonGame(){
    setGameFinished(true);
    let winner;
    if (currentPlayer === playerContext.playerOne){
      winner = playerContext.playerOne;
      playerContext.setPlayerOneScore(playerContext.playerOneScore+1)
    } else{
      winner = playerContext.playerTwo;
      playerContext.setPlayerTwoScore(playerContext.playerTwoScore+1)
    }

    let winBodyMessage = againstAI && winner === playerContext.playerTwo ? `The AI ${playerContext.playerTwo} has beat you. `: `Congratulations, ${winner}`;
    Alert.alert(
      "Winner declared!",
      winBodyMessage,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "New Game", onPress: () => startNewGame()}
      ],
      { cancelable: false }
    );    
  }

  function processTie(){
    setGameFinished(true);
    Alert.alert(
      "Game is tied!",
      `Wow! You both are tough!`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "New Game", onPress: () => startNewGame()}
      ],
      { cancelable: false }
    );       

  }

  function startNewGame(){
    setGrid(DEFAULT_GRID);
    let gamesPlayedSoFar = playerContext.playerOneScore + playerContext.playerTwoScore 
    if (gamesPlayedSoFar % 2 === 0){
      setCurrentPlayer(defaultPlayer);
    } else{
      setCurrentPlayer(defaultPlayer === playerContext.playerOne ? playerContext.playerTwo : playerContext.playerOne);
    }
    setGameFinished(false);
  }  

  return (
    <GameContext.Provider value={{currentPlayer:currentPlayer,setCurrentPlayer:setCurrentPlayer,grid:grid,updateCoordWithValue:updateCoordWithValue,gameFinished:gameFinished,setGameFinished:setGameFinished,startNewGame,getGridWithNewValueAtCoord:getGridWithNewValueAtCoord,againstAI:againstAI,processWonGame:processWonGame,changePlayer:changePlayer,makeAImove:makeAImove,processTie:processTie}}>
      <View style={styles.container}>
        <View style={styles.scoreBoard}>
          <View style={styles.scoreBoardRow}> 
            <View style={{...styles.scoreBoardBlock,borderTopLeftRadius:10}}><Text style={styles.scoreBoardEmojiText}>{`${playerContext.playerOne}`}</Text></View>
            <View style={{...styles.scoreBoardBlock,borderTopRightRadius:10}}><Text style={styles.scoreBoardEmojiText}>{`${playerContext.playerTwo}`}</Text></View>
          </View>
          <View style={styles.scoreBoardRow}> 
            <View style={{...styles.scoreBoardBlock,borderBottomLeftRadius:10,}}><Text style={styles.scoreText}>{`${playerContext.playerOneScore}`}</Text></View>
            <View style={{...styles.scoreBoardBlock,borderBottomRightRadius:10,}}><Text style={styles.scoreText}>{`${playerContext.playerTwoScore}`}</Text></View>
          </View>
        </View>
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
    fontSize:23,
    marginTop:10,
  },
  scoreBoard:{
    flexDirection:'column',
    marginTop:20,
  },
  scoreBoardTop:{
    backgroundColor:'#27ae60',
    alignItems:'center',
    borderTopLeftRadius:10,
    borderTopEndRadius:10,
  },
  scoreBoardTitleText:{
    fontSize:30,
    color:'black',
  },
  scoreBoardRow:{
    flexDirection:'row',
    justifyContent:'center',
  },
  scoreBoardBlock:{
    fontSize:30,
    width:80,
    height:80,
    backgroundColor:'#2ecc71',
    textAlign:'center',
    alignItems:'center',
    justifyContent:'center',
  },
  scoreBoardEmojiText:{
    fontSize:50,    
  },
  scoreText:{
    fontSize:40,
    color:'white',
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
  },
});

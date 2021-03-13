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
  }

  let BORDER_WIDTH = 2

  let borderStyle = {
    borderTopWidth:props.row > 0 ? BORDER_WIDTH : 0,
    borderLeftWidth:props.col > 0 ? BORDER_WIDTH : 0,

  }
  let blockFilled = gameState.grid[`row${props.row}`][`col${props.col}`] !== EMPTY;
  let blockDisabled = blockFilled || gameState.gameFinished || (gameState.againstAI && gameState.currentPlayer === playerContext.playerTwo)


  return (
    <TouchableOpacity disabled={blockDisabled} style={{...styles.slotBlock,...borderStyle}} onPress={processMove} >
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

  return "\n"+stringVisualization + "\nENDBOARD";
}

export default function GameScreen(props:Object) {
  let DEFAULT_ROW = {col0:EMPTY,col1:EMPTY,col2:EMPTY}
  let DEFAULT_GRID = {row0:{...DEFAULT_ROW},row1:{...DEFAULT_ROW},row2:{...DEFAULT_ROW}}  
  
  const playerContext = useContext(PlayerContext);
  const [grid,setGrid] = useState(DEFAULT_GRID); 
  const [gameFinished,setGameFinished] = useState(false);
  const [againstAI,setAgainstAI] = useState(playerContext.againstAI);
  const [moveLog,setMoveLog] = useState([]);



  let firstPlayer = props.route.params.randomOneOrTwo === 1.0 ? playerContext.playerOne : playerContext.playerTwo;
  console.log(`First player will be ${firstPlayer}`)
  const [currentPlayer,setCurrentPlayer] = useState(firstPlayer)

  function getNextMoveForAIPlayer(grid:Object,player:String,opponent:String){
    let emptyCoords = getEmptyCoords(grid);
    var nextSpot = getRandomElementInList(emptyCoords);

    // console.log(`AI level is ${props.route.params.AIlevel}` )

    if (props.route.params.AIlevel >= 2){
      // check for AI win
      for (var i =0; i < emptyCoords.length; i++){
        let spot = emptyCoords[i];
        let gridFilledWithPlayer = getGridWithNewValueAtCoord(spot,player);

        if (checkForWin(gridFilledWithPlayer,player)){
          nextSpot = spot;
          return nextSpot;
        }
      }      
    }

    // prevent opponent from win
    if (props.route.params.AIlevel >= 3){
      for (var i =0; i < emptyCoords.length; i++){
        let spot = emptyCoords[i];
        let gridFilledWithOpponent = getGridWithNewValueAtCoord(spot,opponent);
        if (checkForWin(gridFilledWithOpponent,opponent)){
          nextSpot = spot;
          return nextSpot;
        }

      }
    }    

    return nextSpot;
  }  

  function makeAImove(){
    let nextMoveLocation =  getNextMoveForAIPlayer(grid,playerContext.playerTwo,playerContext.playerOne);
    // console.log(`>>>AI will process move at r=${nextMoveLocation.r},c=${nextMoveLocation.c}`)
    updateCoordWithValue(nextMoveLocation,playerContext.playerTwo);

  }

  //Whenever the grid changes, should check for win or tie
  useEffect(()=>{
    // person won
    if (!gameFinished && checkForWin(grid,playerContext.playerOne) || checkForWin(grid,playerContext.playerTwo)){
      processWonGame();
    // game was tied
    } else if (isGridFull(grid)){
      processTie();
    // move happened
    } else{
      if ((currentPlayer === playerContext.playerOne && moveLog.length !== 0 )){
        // console.log(`~~Changing from player 1`);
        changePlayer();
      }      

      if ((currentPlayer === playerContext.playerTwo && !againstAI)){
        // console.log(`~~Changing from player 2 `);
        changePlayer();
      }
    }
  },[grid])



  useEffect( ()=> {
    const executeAI = async ()=> {
      return new Promise((resolve,reject)=>{
      // process move if AI
        setTimeout(()=>{
          if (moveLog.slice(-1) !== playerContext.playerTwo){
            makeAImove();
            changePlayer();
          } else{
            console.log('race condition')
          }
          resolve(true);
        },2000);
      });
    }

    if (againstAI && currentPlayer === playerContext.playerTwo){
      executeAI();
    }
  }    
  ,[currentPlayer])

  function getGridWithNewValueAtCoord(coord:Object,value:String){
    let r = coord.r;
    let c = coord.c;
    var newGrid = JSON.parse(JSON.stringify(grid))
    let rowKey = `row${r}`;
    let colKey = `col${c}`;
    newGrid[rowKey][colKey] = value;   
    return newGrid; 

  }
  const updateCoordWithValue = (coord,value) =>{
    if (!gameFinished){
      setGrid(getGridWithNewValueAtCoord(coord,value));
      setMoveLog(moveLog.concat(value));
    } else{
      console.log('Game is finished. Cannot update board');
    }

  }

  function changePlayer(){
    let playerThatGoesNext = playerContext.playerOne === currentPlayer ? playerContext.playerTwo : playerContext.playerOne
    console.log(`Changing player from ${currentPlayer} to ${playerThatGoesNext}`)
    setCurrentPlayer(playerThatGoesNext)
  }

  function processWonGame(){
    setGameFinished(true);
    let winner = currentPlayer;
    if (winner === playerContext.playerOne){
      playerContext.setPlayerOneScore(playerContext.playerOneScore+1)
    } else{
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
    playerContext.setTies(playerContext.ties+1);
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
    setGameFinished(false);
    setMoveLog([]);
    setGrid(DEFAULT_GRID);
    let nextToPlayFirst = moveLog[0] === playerContext.playerOne ? playerContext.playerTwo : playerContext.playerOne
    console.log(`nextToPlayFirst ${nextToPlayFirst}`)
    setCurrentPlayer(nextToPlayFirst);
  }

  function resetScoreBoard(){
    playerContext.setPlayerOneScore(0);
    playerContext.setPlayerTwoScore(0);
  }

  function askToResetScoreBoard(){
    Alert.alert(
      "Do you want to reset the scoreboard?",
      "This will set both scores to 0",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Reset Scores", onPress: resetScoreBoard}
      ],
      { cancelable: false }
    );   
  } 

  return (
    <GameContext.Provider value={{currentPlayer:currentPlayer,setCurrentPlayer:setCurrentPlayer,grid:grid,updateCoordWithValue:updateCoordWithValue,gameFinished:gameFinished,setGameFinished:setGameFinished,startNewGame,getGridWithNewValueAtCoord:getGridWithNewValueAtCoord,againstAI:againstAI,changePlayer:changePlayer}}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.scoreBoard} onPress={askToResetScoreBoard}>
          <View style={styles.scoreBoardRow}> 
            <View style={{...styles.scoreBoardBlock,borderTopLeftRadius:10}}><Text style={styles.scoreBoardEmojiText}>{`${playerContext.playerOne}`}</Text></View>
            <View style={{...styles.scoreBoardBlock,borderTopRightRadius:10}}><Text style={styles.scoreBoardEmojiText}>{`${playerContext.playerTwo}`}</Text></View>
          </View>
          <View style={styles.scoreBoardRow}> 
            <View style={{...styles.scoreBoardBlock,borderBottomLeftRadius:10,}}><Text style={styles.scoreText}>{`${playerContext.playerOneScore}`}</Text></View>
            <View style={{...styles.scoreBoardBlock,borderBottomRightRadius:10,}}><Text style={styles.scoreText}>{`${playerContext.playerTwoScore}`}</Text></View>
          </View>
        </TouchableOpacity>
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

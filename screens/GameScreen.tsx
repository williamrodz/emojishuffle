import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Animated,StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

let EMPTY = "*"
let NUM_ROWS = 3;


const UserContext = createContext();

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
  let gameState = useContext(UserContext);

  function updateBlockValue(){
    gameState.updateCoordWithValue(getCoord(props.row,props.col),gameState.currentPlayer)
    // setBlockValue(gameState.currentPlayer);
  } 

  return (
    <TouchableOpacity style={styles.slotBlock} onPress={updateBlockValue} >
      <Text style={styles.slotBlockTextContainer}>{gameState.grid[`row${props.row}`][`col${props.col}`]}</Text>
    </TouchableOpacity>
  )
}

const SlotRow = (props) =>{
  return (
    <View style={styles.slotRow}>
      <SlotBlock row={props.rowNumber} col={0}/>
      <SlotBlock row={props.rowNumber} col={1}/>
      <SlotBlock row={props.rowNumber} col={2}/>
    </View>
  )
}

const SlotMachine = (props) =>{

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
  
  const [grid,setGrid] = useState(DEFAULT_GRID); 
  const [currentPlayer,setCurrentPlayer] = useState("😀")

  const updateCoordWithValue = (coord,value) =>{
    let r = coord.r;
    let c = coord.c;
    var newGrid = {...grid}
    let rowKey = `row${r}`;
    let colKey = `col${c}`;
    newGrid[rowKey][colKey] = currentPlayer;
    setGrid(newGrid);
  }

  useEffect(()=>{
    if (checkForWin(grid,currentPlayer)){
      alert(`Winner declared ${currentPlayer}`);
    }
  },[grid])

  

  return (
    <UserContext.Provider value={{currentPlayer:currentPlayer,grid:grid,updateCoordWithValue:updateCoordWithValue}}>
      <View style={styles.container}>
        <Text style={styles.title}>Tab One</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <SlotMachine grid={grid} currentPlayer={currentPlayer}/>
      </View>
    </UserContext.Provider>
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
    backgroundColor:'blue',
    width:BLOCK_SIDE_LENGTH,
    height:BLOCK_SIDE_LENGTH,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
  },
  slotBlockTextContainer:{
    fontSize:60,
  }
});

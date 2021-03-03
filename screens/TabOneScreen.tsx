import * as React from 'react';
import { Animated,StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';


const SlotBlock = (props) =>{
  return (
    <View style={styles.slotBlock}>
      <Text style={styles.slotBlockTextContainer}>{props.text}</Text>
    </View>
  )
}

const SlotRow =(props) =>{
  return (
    <View style={styles.slotRow}>
      <SlotBlock text="😀"/>
      <SlotBlock text="😀"/>
      <SlotBlock text="😀"/>
    </View>
  )
}

const SlotMachine = (props) =>{
  return (
    <View style={styles.containerOfRows}>
      <SlotRow/>
      <SlotRow/>
      <SlotRow/>
    </View>
  )
}

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <SlotMachine/>
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
  },
  slotBlockTextContainer:{
    fontSize:60,
  }
});

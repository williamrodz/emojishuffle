import React,{useState,createContext,useContext} from 'react';
import { TouchableOpacity,StyleSheet, Touchable,SafeAreaView,ScrollView, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from '../components/Themed';
import { PlayerContext } from '../navigation/BottomTabNavigator';
let EMOJIS = "😀 😁 😆 😅 😂 🤣 🥲 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾"
let EMOJI_LIST = EMOJIS.split(" ");

const EmojiBlock = (props)=>{
    const setSelectedEmoji = useContext(AvatarContext);

    return (
        <TouchableOpacity style={styles.emojiBlock} onPress={()=>setSelectedEmoji(props.emoji)}>
            <Text style={styles.emojiText}>{props.emoji}</Text>
        </TouchableOpacity>
    )
}

let ROW_SIZE = 6;
function putIntoRows(elements:Array<any>){
    var i =0;
    var rows = [];
    var currentRow;

    while (i < elements.length){
        let currentElement = elements[i];
        if (currentRow){
            currentRow.push(currentElement);
            if (i > 0 && (i+1) % ROW_SIZE === 0){
                rows.push(<View key={i} style={styles.emojiRow}>{currentRow}</View>);
                currentRow = null;
            }
        } else{
            currentRow = [currentElement];
        }
        i++;
    }
    return rows;
}

const EmojiSelection = (props) =>{
    var emojiBlocks = [];

    for (var i = 0; i< props.listOfEmojis.length; i++){
        let currentEmoji = props.listOfEmojis[i];
        emojiBlocks.push(<EmojiBlock key={currentEmoji} emoji={currentEmoji}/>)
    }


    return(
        <SafeAreaView style={styles.scrollViewContainer}>
            <ScrollView style={styles.scrollView}>
                {putIntoRows(emojiBlocks)}
            </ScrollView>
        </SafeAreaView>
    )
}

let AvatarContext = createContext(); 

export default function EmojiSelectionScreen(props) {
    var randomIndex = Math.floor(Math.random() * EMOJI_LIST.length);
    const [selectedEmoji,setSelectedEmoji] = useState(EMOJI_LIST[randomIndex]);
    const playerContext = useContext(PlayerContext);


    function updateGlobalAvatar(){
        if (props.route.params.currentPlayer === 1){
            playerContext.setPlayerOne(selectedEmoji)
        }
        else if (props.route.params.currentPlayer === 2){
            if (playerContext.playerOne === selectedEmoji){
                return false;
            }
            playerContext.setPlayerTwo(selectedEmoji)
        }
        return true;  
    }

    function continueAction(){
        let updateSuccesful = updateGlobalAvatar()
        if (!updateSuccesful){
            alert("Player 1 already chose this emoji. Please choose another one")
        }
        else if ( props.route.params.currentPlayer === 1){
            props.navigation.navigate("EmojiSelectionScreen2",{currentPlayer:2});
        }
        else if (props.route.params.currentPlayer === 2){
            props.navigation.navigate("GameScreen");
        }
    }

    return (
        <AvatarContext.Provider value={setSelectedEmoji}>
            <View style={styles.container}>
                <Text style={styles.title}>{`Choose your avatar, Player ${props.route.params.currentPlayer}!`}</Text>
                <Text style={styles.avatar}>{selectedEmoji}</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <EmojiSelection listOfEmojis={EMOJI_LIST} updateEmoji={setSelectedEmoji}/>
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
      style={styles.continueButtonGradient}>   
        <TouchableOpacity style={styles.continueButton} onPress={continueAction}>
            <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        </LinearGradient>                
            </View>
        </AvatarContext.Provider>
    );
  }
  
let EMOJI_BLOCK_SIDE_LENGTH = 50;
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
    avatar:{
        fontSize:60,
    },
    separator: {
      marginVertical: 20,
      height: 1,
      width: '80%',
    },
    scrollViewContainer:{
        flex:1,
    },
    scrollView:{
        flex:1,
        backgroundColor:'blue',
        width:'100%',
        height:50,
        flexDirection:'column',
        borderRadius:20,

    },
    emojiRow:{
        flexDirection:'row',
    },
    emojiBlock:{
        width:EMOJI_BLOCK_SIDE_LENGTH,
        height:EMOJI_BLOCK_SIDE_LENGTH,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#34495e',
    },
    emojiText:{
        fontSize:30,
    },
    continueButtonGradient:{
        marginTop:10,
        marginBottom:50,
        padding:15,
        borderRadius:10,        
    },
    continueButton:{

    },
    continueButtonText:{
        fontSize:20,
        color:'white',
    }
  });
  
import React,{ useState } from 'react';
import {
    Image,
    ImageBackground,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableWithoutFeedback,
    TouchableOpacity,
    VirtualizedList
} from 'react-native';
import { Button, Overlay } from 'react-native-elements';

const rank = [
    {
        name:'Nguyen Van A',
        class: 'A123',
        score: 28
    },
    {
        name:'Nguyen Van B',
        class: 'B199',
        score: 20
    },
    {
        name:'Nguyen Van C',
        class: 'A123',
        score: 10
    },
    {
        name:'Nguyen Van D',
        class: 'B123',
        score: 30
    },
    {
        name:'Nguyen Van A',
        class: 'A123',
        score: 28
    },
    {
        name:'Nguyen Van B',
        class: 'B199',
        score: 20
    },
    {
        name:'Nguyen Van A',
        class: 'A123',
        score: 28
    },
    {
        name:'Nguyen Van B',
        class: 'B199',
        score: 20
    },
    {
        name:'Nguyen Van A',
        class: 'A123',
        score: 28
    }
];

const data = [
    {
        'question': 'A la ki tu nao trong bang chu cai?',
        'answer': 'あ'
    },
    {
        'question': 'I la ki tu nao trong bang chu cai?',
        'answer': 'い'
    },
    {
        'question': 'U la ki tu nao trong bang chu cai?',
        'answer': 'う'
    },
    {
        'question': 'E la ki tu nao trong bang chu cai?',
        'answer': 'え'
    },
    {
        'question': 'O la ki tu nao trong bang chu cai?',
        'answer': 'お'
    }
];

const hiragana = [
    'あ', 'い', 'う', 'え', 'お',
    'か', 'き', 'く', 'け', 'こ',
];

const App = () => {
    //state
    const [questNum, setQuestNum] = useState(0);
    const [score, setScore] = useState(0);
    const [visibleStartGame, setVisibleStartGame] = useState(true);
    const [visibleResult, setVisibleResult] = useState(false);
    const [visibleRank, setVisibleRank] = useState(false);

    const questions = data[questNum].question;
    const answer = [data[questNum].answer];

    let i = 0,
        temp;
    while (i < 3) {
        let rand = Math.floor(Math.random() * hiragana.length);
        if(answer.indexOf(hiragana[rand]) == -1){
            if(hiragana[rand] != answer[0] && rand != temp){
            answer.push(hiragana[rand]);
            answer.sort(() => Math.random() - 0.5);
            temp = rand;
            i++;
            }
        }
    }

    const chooseAnswer = (answer) => {
        if (answer == data[questNum].answer) {
            setScore(score + 1);
        } else {
            setVisibleResult(!visibleResult);
        }

        if (questNum == data.length - 1) {
            setVisibleResult(!visibleResult);
        } else {
            setQuestNum(questNum + 1);
        }
    }

    const playAgain = () => {
        setQuestNum(0);
        setScore(0);
        data.sort(() => Math.random() - 0.5)
        setVisibleResult(!visibleResult);
    }

    const quitGame = () => {
        setQuestNum(0);
        setScore(0);
        setVisibleResult(!visibleResult);
    }

    const modalRank = () => {
        setVisibleRank(!visibleRank);
    };

    const startGame = () => {
        setVisibleStartGame(!visibleStartGame);
    }

    const Start = () => {
        return(
            <Overlay isVisible={visibleStartGame} overlayStyle={{backgroundColor:'#ffffff',height:'50%',width:'80%'}}>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={{color:'white',fontSize:26,fontWeight:'bold'}}>Start Game</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={{color:'white',fontSize:26,fontWeight:'bold'}}>Start Game</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={{color:'white',fontSize:26,fontWeight:'bold'}}>Start Game</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={{color:'white',fontSize:26,fontWeight:'bold'}}>Start Game</Text>
                </TouchableOpacity>
            </Overlay>
        );
    }

    const Result = () => {
        return(
            <Overlay isVisible={visibleResult} animationType={'fade'} overlayStyle={{height:'45%',width:'70%',borderRadius:15}}>
                <View style={{justifyContent:'center',alignItems:'center',height:'20%'}}>
                    <Text style={{fontSize:30,fontWeight:'bold'}}>Your Score</Text>
                </View>
                <View style={{alignItems:'center',height:'60%'}}>
                    <Text style={{fontSize:120, color:'red'}}>{score}</Text>
                    <Text style={{fontSize:18}}>You answer correctly {score} / {data.length}</Text>
                </View>
                <View style={{flexDirection: 'row',justifyContent:'space-around',height:'20%'}}>
                    <TouchableOpacity onPress={playAgain} style={{backgroundColor:'#66b3ff', height:40, justifyContent:'center', width:'40%', borderRadius:10}}>
                        <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:16}}>Play Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={quitGame} style={{backgroundColor:'#ff0000', height:40, justifyContent:'center', width:'40%', borderRadius: 10}}>
                        <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:16}}>Quit</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
        );
    }

    const Rank = () => {
        const Item = ({ item, index })=> {
            return (
                <View style={{backgroundColor: index % 2 == 0 ? '#ccfff5' : '#ffffff'}}>
                    <Text >{item.name}</Text>
                    <Text >{item.class}</Text>
                    <Text >{item.score}</Text>
                </View>
            );
        }

        return(
            <Overlay animationType={'fade'} isVisible={visibleRank} onBackdropPress={modalRank} overlayStyle={{height:'80%',width:'70%',borderRadius:15}}>
                <View style={{justifyContent:'center',alignItems:'center',height:'10%'}}>
                    <Text style={{fontSize:30,fontWeight:'bold'}}>Top Rank</Text>
                </View>
                <VirtualizedList
                    data={rank}
                    renderItem={({ item, index }) => <Item item={item} index={index} />}
                    keyExtractor={ ( item,index ) => index.toString() }
                    getItemCount={(data) => {return data.length}}
                    getItem={(data, index) => data[index]}
                />
                <View style={{justifyContent:'center',height:'10%'}}>
                    <TouchableOpacity onPress={modalRank} style={{justifyContent:'center',height:'60%',width:'50%',backgroundColor:'#ff0000',alignSelf:'center',borderRadius:5}}>
                        <Text style={{alignSelf:'center',color: '#ffffff',fontSize:16,fontWeight:'bold'}}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
        );
    }

    return (
        <View style={styles.background}>
            <StatusBar hidden={true} />
            <Start />
            <View style={styles.backgroundGame}>
                <ImageBackground source={require('./assets/image/demo.png')} style={styles.demoGame}>
                    <View style={{width:60,height:60,borderRadius:15,backgroundColor:'white',marginTop:40, marginLeft:15,justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize: 18,fontWeight:'bold'}}>Time</Text>
                        <Text style={{fontSize: 20}}>120</Text>
                    </View>
                    <View style={{width:60,height:60,borderRadius:15,backgroundColor:'white',marginTop:40, marginLeft:15,justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize: 18,fontWeight:'bold'}}>Score</Text>
                        <Text style={{fontSize: 20}}>10</Text>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.backgroundQuest}>
            <View>
                <ImageBackground source={require('./assets/image/hexagon.png')} style={styles.quest}>
                <Text style={{fontSize: 20,color:'white'}}>{questions}</Text>
                </ImageBackground>
                <View style={styles.answer}>
                    <TouchableOpacity style={styles.answerButton} onPress={() => chooseAnswer(answer[0])}>
                        <Text style={styles.answerText}>{answer[0]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.answerButton} onPress={() => chooseAnswer(answer[1])}>
                        <Text style={styles.answerText}>{answer[1]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.answerButton} onPress={() => chooseAnswer(answer[2])}>
                        <Text style={styles.answerText}>{answer[2]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.answerButton} onPress={() => chooseAnswer(answer[3])}>
                        <Text style={styles.answerText}>{answer[3]}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity style={styles.quitButton}>
                        <Text style={styles.titleQuitButton}>Quit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rankButton} onPress={modalRank}>
                        <Text  style={styles.titleRankButton}>Rank</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Result />
            <Rank />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    backgroundGame: {
        height: '40%',
        backgroundColor: 'black'
    },
    demoGame: {
        height: '100%',
        width: '100%',
        flexDirection: 'row'
    },
    backgroundQuest: {
        height: '60%',
        backgroundColor: '#00ffbf',
        justifyContent: 'center'
    },
    quest: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 90,
        width: '100%',
        marginTop: 10
    },
    answer: {
        marginTop: -15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '15%',
        width: '80%',
        backgroundColor: '#66ccff',
        marginBottom: 13,
        borderRadius: 15
    },
    answerText:{
        fontWeight: 'bold',
        fontSize: 18
    },
    footerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '10%',
        marginLeft: 10,
        marginRight: 10,
        bottom : 20
    },
    quitButton: {
        backgroundColor: 'red',
        width: '45%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rankButton: {
        backgroundColor: 'white',
        width: '45%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    startButton: {
        backgroundColor: '#ff0000',
        width: '100%',
        height: '20%',
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 15
    },
    titleQuitButton: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold'
    },
    titleRankButton: {
        color: '#000000',
        fontSize: 22,
        fontWeight: 'bold'
    }
});

export default App;

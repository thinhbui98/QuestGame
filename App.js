import React,{ useState, useRef } from 'react';
import {
    Animated,
    Image,
    ImageBackground,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableWithoutFeedback,
    TouchableOpacity,
    VirtualizedList,
    useWindowDimensions,
    LogBox
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
    },
    {
        'question': 'Ka la ki tu nao trong bang chu cai?',
        'answer': 'か'
    },
    {
        'question': 'Ki la ki tu nao trong bang chu cai?',
        'answer': 'き'
    },
    {
        'question': 'Ku la ki tu nao trong bang chu cai?',
        'answer': 'く'
    },
    {
        'question': 'Ke la ki tu nao trong bang chu cai?',
        'answer': 'け'
    },
    {
        'question': 'Ko la ki tu nao trong bang chu cai?',
        'answer': 'こ'
    }
];

const hiragana = [
    'あ', 'い', 'う', 'え', 'お',
    'か', 'き', 'く', 'け', 'こ',
];

LogBox.ignoreAllLogs();
const App = () => {
    //state
    const [questNum, setQuestNum] = useState(0);
    const [score, setScore] = useState(0);
    const [visibleStartGame, setVisibleStartGame] = useState(true);
    const [visibleResult, setVisibleResult] = useState(false);
    const [visibleRank, setVisibleRank] = useState(false);
    const [visibleQuest, setvisibleQuest] = useState(false);
    const [tempCharaterLeftAnimated, setTempCharaterLeftAnimated] = useState(140);
    const [tempCharaterTopAnimated, setTempCharaterTopAnimated] = useState(270);
    const [characterStatus, setcharacterStatus] = useState(false);

    //animated
    //trang thai dau tien tren ios
    const charaterLeftAnimated = useRef(new Animated.Value(0)).current;
    const charaterTopAnimated = useRef(new Animated.Value(290)).current;
    const backgroundRightAnimated = useRef(new Animated.Value(0)).current;
    const backgroundBottomAnimated = useRef(new Animated.Value(180)).current;

    //demension
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

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
            setcharacterStatus(true);
            setvisibleQuest(false);
            if (score < 1) {
                //Lan dau tien di chuyen nhan vat
                Animated.timing(charaterLeftAnimated, {
                    toValue: windowWidth/4,
                    duration: 3000,
                }).start(( {finished} ) => {
                    if (finished) {
                        Animated.timing(charaterLeftAnimated, {
                            toValue: tempCharaterLeftAnimated,
                            duration: 2000,
                        }).start(( {finished} ) => {
                            if (finished) {
                                console.log('charaterLeftAnimated stop')
                            }
                        });
                        Animated.timing(charaterTopAnimated, {
                            toValue: tempCharaterTopAnimated,
                            duration: 2000,
                        }).start(( {finished} ) => { 
                            if (finished) {
                                console.log('charaterTopAnimated stop')
                                setvisibleQuest(true);
                                setTempCharaterLeftAnimated(tempCharaterLeftAnimated + 20)
                                setTempCharaterTopAnimated(tempCharaterTopAnimated - 10)
                            }
                        });
                    }
                });
            } else {
                //Cac lan tiep theo
                setTempCharaterLeftAnimated(tempCharaterLeftAnimated + 20)
                setTempCharaterTopAnimated(tempCharaterTopAnimated - 10)
                console.log('tempCharaterLeftAnimated',tempCharaterLeftAnimated);
                console.log('setTempCharaterTopAnimated',tempCharaterTopAnimated);
                Animated.timing(charaterLeftAnimated, {
                    toValue: tempCharaterLeftAnimated,
                    duration: 2000,
                }).start(( {finished} ) => {
                    if (finished) {
                        console.log('tempCharaterLeftAnimated2 stop')
                    }
                });
                Animated.timing(charaterTopAnimated, {
                    toValue: tempCharaterTopAnimated,
                    duration: 2000,
                }).start(( {finished} ) => { 
                    //di chuyen background va nhan vat theo so diem
                    if (finished) {
                        setvisibleQuest(true);
                        if (tempCharaterLeftAnimated > windowWidth/2) {
                            setTempCharaterLeftAnimated(tempCharaterLeftAnimated - 120);
                            setTempCharaterTopAnimated(tempCharaterTopAnimated + 60);
                            console.log('tempCharaterLeftAnimated2',tempCharaterLeftAnimated);
                            console.log('setTempCharaterTopAnimated2',tempCharaterTopAnimated);
                            //di chuyen background
                            Animated.timing(backgroundRightAnimated, {
                                toValue: 150,
                                duration: 1000,
                            }).start(( {finished} ) => {
                                if (finished) {
                                    console.log('backgroundRightAnimated stop')
                                }
                            });
                            Animated.timing(backgroundBottomAnimated, {
                                toValue: 120,
                                duration: 1000,
                            }).start(( {finished} ) => { 
                                if (finished) {
                                    console.log('backgroundBottomAnimated stop')
                                }
                            });

                            //di chuyen nhan vat
                            Animated.timing(charaterLeftAnimated, {
                                toValue: tempCharaterLeftAnimated - 160,
                                duration: 1000,
                            }).start(( {finished} ) => {
                                if (finished) {
                                    console.log('charaterLeftAnimated stop')
                                }
                            });
                            Animated.timing(charaterTopAnimated, {
                                toValue: tempCharaterTopAnimated + 60,
                                duration: 1000,
                            }).start(( {finished} ) => {
                                if (finished) {
                                    console.log('left stop')
                                }
                            });
                        }
                    }
                });
            }
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
        data.sort(() => Math.random() - 0.5)
        setVisibleResult(false);
        setTempCharaterLeftAnimated(140);
        setTempCharaterTopAnimated(270);
        Animated.timing(charaterLeftAnimated, {
            toValue: 0,
            duration: 0,
        }).start();

        Animated.timing(charaterTopAnimated, {
            toValue: 290,
            duration: 0,
        }).start();

        Animated.timing(backgroundRightAnimated, {
            toValue: 0,
            duration: 0,
        }).start();

        Animated.timing(backgroundBottomAnimated, {
            toValue: 180,
            duration: 0,
        }).start();
    }

    const modalRank = () => {
        setVisibleRank(!visibleRank);
    };

    const startGame = () => {
        setVisibleStartGame(!visibleStartGame);
        setvisibleQuest(!visibleQuest);
    }

    const Start = () => {
        return(
            <Overlay isVisible={visibleStartGame} overlayStyle={styles.modalStartButton}>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={styles.textStartButton}>Start Game</Text>
                </TouchableOpacity>
            </Overlay>
        );
    }

    const Result = () => {
        return(
            <Overlay isVisible={visibleResult} animationType={'fade'} overlayStyle={styles.modalResult}>
                <View style={styles.headerResult}>
                    <Text style={styles.textHeaderResult}>Your Score</Text>
                </View>
                <View style={styles.bodyResult}>
                    <Text style={styles.scoreResult}>{score}</Text>
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
                <Animated.Image source={require('./assets/image/background_game.png')} style={{height: 540,width: 960,bottom: backgroundBottomAnimated,position:'relative',right:backgroundRightAnimated}} />
                <View style={{top: -540,flexDirection: 'row'}}>
                    <View style={{width:60,height:60,borderRadius:15,backgroundColor:'white',marginTop:40, marginLeft:15,justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize: 18,fontWeight:'bold'}}>Time</Text>
                        <Text style={{fontSize: 20}}>120</Text>
                    </View>
                    <View style={{width:60,height:60,borderRadius:15,backgroundColor:'white',marginTop:40, marginLeft:15,justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize: 18,fontWeight:'bold'}}>Score</Text>
                        <Text style={{fontSize: 20}}>{score}</Text>
                    </View>
                </View>
                <Animated.Image source={characterStatus ? require('./assets/image/character_male_moving.gif') : require('./assets/image/character_male_stay.png')} style={{height: 70, width:36, top:charaterTopAnimated,left: charaterLeftAnimated, position:'absolute'}} />
            </View>
            <View style={styles.backgroundQuest}>
            {visibleQuest ? (
                <View>
                    <ImageBackground source={require('./assets/image/hexagon.png')} style={styles.quest}>
                        <Text style={{fontSize: 20,fontWeight:'bold',color:'white'}}>{questions}</Text>
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
                        <TouchableOpacity style={styles.quitButton} onPress={quitGame}>
                            <Text style={styles.titleQuitButton}>Quit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rankButton} onPress={modalRank}>
                            <Text  style={styles.titleRankButton}>Rank</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View></View>
            )}
                
            </View>
            <Result />
            <Rank />
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
    imageGame: {
        height: 1920,
        width: 1080,
        bottom: 1500,
        // left:300,
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
        borderRadius: 10
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
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rankButton: {
        backgroundColor: 'white',
        width: '45%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    startButton: {
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalStartButton: {
        backgroundColor: '#ff0000',
        height: '7%',
        width: '70%',
        borderRadius: 15,
        justifyContent: 'center'
    },
    textStartButton: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold'
    },
    modalResult: {
        height: '45%',
        width: '70%',
        borderRadius: 15
    },
    headerResult: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '20%'
    },
    textHeaderResult: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    bodyResult: {
        alignItems: 'center',
        height: '60%'
    },
    scoreResult: {
        fontSize: 120, 
        color: 'red'
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

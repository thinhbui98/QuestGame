import React,{ useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
    Animated,
    Image,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    StatusBar,
    Platform,
    TouchableOpacity,
    VirtualizedList,
    Dimensions,
    LogBox
} from 'react-native';
import { Root, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountDown from 'react-native-countdown-component';
// import NavigationService from '../../Navigation';
// import Routes from '../../Navigation/Routes';
Icon.loadFont();

// const rank = [
//     {
//         name:'Nguyen Van A',
//         class: 'A123',
//         score: 30
//     },
//     {
//         name:'Nguyen Van B',
//         class: 'B199',
//         score: 28
//     },
//     {
//         name:'Nguyen Van C',
//         class: 'A123',
//         score: 27
//     },
//     {
//         name:'Nguyen Van D',
//         class: 'B123',
//         score: 23
//     },
//     {
//         name:'Nguyen Van A',
//         class: 'A123',
//         score: 21
//     },
//     {
//         name:'Nguyen Van B',
//         class: 'B199',
//         score: 17
//     },
//     {
//         name:'Nguyen Van A',
//         class: 'A123',
//         score: 17
//     },
//     {
//         name:'Nguyen Van B',
//         class: 'B199',
//         score: 16
//     },
//     {
//         name:'Nguyen Van A',
//         class: 'A123',
//         score: 9
//     }
// ];

const rank = [];

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
    },
    {
        'question': 'Sa la ki tu nao trong bang chu cai?',
        'answer': 'さ'
    },
    {
        'question': 'Shi la ki tu nao trong bang chu cai?',
        'answer': 'し'
    },
    {
        'question': 'Su la ki tu nao trong bang chu cai?',
        'answer': 'す'
    },
    {
        'question': 'Se la ki tu nao trong bang chu cai?',
        'answer': 'せ'
    },
    {
        'question': 'So la ki tu nao trong bang chu cai?',
        'answer': 'そ'
    },
    {
        'question': 'Ta la ki tu nao trong bang chu cai?',
        'answer': 'た'
    },
    {
        'question': 'Chi la ki tu nao trong bang chu cai?',
        'answer': 'ち'
    },
    {
        'question': 'Tsu la ki tu nao trong bang chu cai?',
        'answer': 'つ'
    },
    {
        'question': 'Te la ki tu nao trong bang chu cai?',
        'answer': 'て'
    },
    {
        'question': 'To la ki tu nao trong bang chu cai?',
        'answer': 'と'
    },
    {
        'question': 'Na la ki tu nao trong bang chu cai?',
        'answer': 'な'
    },
    {
        'question': 'Ni la ki tu nao trong bang chu cai?',
        'answer': 'に'
    },
    {
        'question': 'Nu la ki tu nao trong bang chu cai?',
        'answer': 'ぬ'
    },
    {
        'question': 'Ne la ki tu nao trong bang chu cai?',
        'answer': 'ね'
    },
    {
        'question': 'No la ki tu nao trong bang chu cai?',
        'answer': 'の'
    },
    {
        'question': 'Ha la ki tu nao trong bang chu cai?',
        'answer': 'は'
    },
    {
        'question': 'Hi la ki tu nao trong bang chu cai?',
        'answer': 'ひ'
    },
    {
        'question': 'Fu la ki tu nao trong bang chu cai?',
        'answer': 'ふ'
    },
    {
        'question': 'He la ki tu nao trong bang chu cai?',
        'answer': 'へ'
    },
    {
        'question': 'Ho la ki tu nao trong bang chu cai?',
        'answer': 'ほ'
    },
].sort(() => Math.random() - 0.5);

const hiragana = [
    'あ', 'い', 'う', 'え', 'お',
    'か', 'き', 'く', 'け', 'こ',
    'さ', 'し', 'す', 'せ', 'そ',
    'た', 'ち', 'つ', 'て', 'と',
    'な', 'に', 'ぬ', 'ね', 'の',
    'は', 'ひ', 'ふ', 'へ', 'ほ',
    'ま', 'み', 'む', 'め', 'も',
    'ら', 'り', 'る', 'れ', 'ろ',
    'や', 'ゆ', 'よ',
    'わ', 'を', 'ん',
    'が', 'ぎ', 'ぐ', 'げ', 'ご',
    'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
    'だ', 'ぢ', 'づ', 'で', 'ど',
    'ば', 'び', 'ぶ', 'べ', 'ぼ',
    'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',
    'きゃ', 'きゅ', 'きょ',
    'しゃ', 'しゅ', 'しょ',
    'ちゃ', 'ちゅ', 'ちょ',
    'にゃ', 'にゅ', 'にょ',
    'ひゃ', 'ひゅ', 'ひょ',
    'みゃ', 'みゅ', 'みょ',
    'りゃ', 'りゅ', 'りょ',
    'ぎゃ', 'ぎゅ', 'ぎょ',
    'じゃ', 'じゅ', 'じょ',
    'ぢゃ', 'ぢゅ', 'ぢょ',
    'びゃ', 'びゅ', 'びょ',
    'ぴゃ', 'ぴゅ', 'ぴょ'
];

LogBox.ignoreAllLogs();
const URL_SETSCORE = 'http://arigato.haki.work/api/setResultGame',
    URL_GETRANKGAME = 'http://haki.work/api/getRankGame',
    windowWidth = Dimensions.get('window').width,
    windowHeight = Dimensions.get('window').height,
    DEFAULT_CHARATER_TOP_ANIMATED = 300,
    DEFAULT_BACKGROUND_BOTTOM_ANIMATED = 170,
    TIME_DEFAULT = 10,
    TIME_ANSWER = TIME_DEFAULT * data.length,
    PARAMS = {
        access_token:"ef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca1",
        lesson_id:"1"
    }

    console.log('windowWidth',windowWidth);
    console.log('windowHeight',windowHeight);
var tempCharaterLeftAnimated = 100,
    tempCharaterTopAnimated = 300,
    tempBackgroundRightAnimated = 0,
    tempBackgroundBottomAnimated = 0,
    movingBackground = 0,
    renderAnwser = [],
    checkAnswer = [],
    trueAnswer = false;
    questNum = 0,
    timeLeft = 0,
    flagFirework = false

const App = () => {
    //state
    const [score, setScore] = useState(0),
        [visibleStartGame, setVisibleStartGame] = useState(true),
        [visibleResult, setVisibleResult] = useState(false),
        [visibleRank, setVisibleRank] = useState(false),
        [visibleQuest, setvisibleQuest] = useState(false),
        [characterStatus, setcharacterStatus] = useState(false),
        [flagAnswer, setFlagAnswer] = useState(true),
        [clock, setClock] = useState(false),
        [timeClock, setTimeClock] = useState(TIME_ANSWER),
        [disableAnswer, setDisableAnswer] = useState(false),
    //animated
    //trang thai dau tien
        charaterLeftAnimated = useRef(new Animated.Value(0)).current,
        charaterTopAnimated = useRef(new Animated.Value(DEFAULT_CHARATER_TOP_ANIMATED)).current,
        backgroundRightAnimated = useRef(new Animated.Value(0)).current,
        backgroundBottomAnimated = useRef(new Animated.Value(DEFAULT_BACKGROUND_BOTTOM_ANIMATED)).current,
    //render cau hoi va cau tra loi
        questions = data[questNum].question,
        answer = [data[questNum].answer];

    if (flagAnswer) {
        let i = 0, temp;
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
        for (let j = 0; j < answer.length; j++) {
            if (answer[j] == data[questNum].answer) {
                checkAnswer[j] = true;
            } else {
                checkAnswer[j] = false;
            }
        }
        renderAnwser = answer;
        console.log('checkAnswer',checkAnswer);
        setFlagAnswer(false);
    }

    const callApi = (url,params) => {
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const chooseAnswer = (answer,index) => {
        setDisableAnswer(true);
        if (answer == data[questNum].answer) {
            if (checkAnswer[index]) {
                checkAnswer[index] = {backgroundColor: '#00cc00'};
            }
            trueAnswer = true;
            setClock(false);
            setScore(score + 1);
            setcharacterStatus(true);
            if (score < 1) {
                //Lan dau tien di chuyen nhan vat
                Animated.timing(charaterLeftAnimated, {
                    toValue: windowWidth/4,
                    duration: 3000,
                }).start(( {finished} ) => {
                    if (finished) {
                        console.log('charaterLeftAnimated1 stop')
                        questNum++;
                        setFlagAnswer(true);
                        setClock(true);
                        setDisableAnswer(false);
                    }
                });
            } else {
                //Cac lan tiep theo
                tempCharaterLeftAnimated = tempCharaterLeftAnimated + 20;
                tempCharaterTopAnimated = tempCharaterTopAnimated - 10;
                Animated.timing(charaterLeftAnimated, {
                    toValue: tempCharaterLeftAnimated,
                    duration: 2000, 
                }).start(( {finished} ) => {
                    if (finished) {
                        console.log('charaterLeftAnimated2 stop')
                    }
                });
                Animated.timing(charaterTopAnimated, {
                    toValue: tempCharaterTopAnimated,
                    duration: 2000, 
                }).start(( {finished} ) => { 
                    //di chuyen background va nhan vat theo so diem
                    console.log('charaterTopAnimated2 stop')
                    if (finished) {
                        //neu nhat vat di duoc 1/2 width man hinh thi se di chuyen background
                        if (tempCharaterLeftAnimated > windowWidth/2) {
                            //tinh so lan di chuyen background
                            movingBackground = movingBackground + 1;
                            switch (movingBackground) {
                                case 1:
                                    console.log('case1');
                                    tempCharaterLeftAnimated = tempCharaterLeftAnimated - 90;
                                    tempCharaterTopAnimated = tempCharaterTopAnimated + 20;
                                    tempBackgroundRightAnimated = tempBackgroundRightAnimated + 100;
                                    tempBackgroundBottomAnimated = tempBackgroundBottomAnimated + 140;
                                    break;
                                case 2:
                                    console.log('case2');
                                    tempCharaterLeftAnimated = tempCharaterLeftAnimated - 70;
                                    tempCharaterTopAnimated = tempCharaterTopAnimated + 40;
                                    tempBackgroundRightAnimated = tempBackgroundRightAnimated + 80;
                                    tempBackgroundBottomAnimated = tempBackgroundBottomAnimated - 50;
                                    break;
                                case 3:
                                    console.log('case3');
                                    tempCharaterLeftAnimated = tempCharaterLeftAnimated - 140;
                                    tempCharaterTopAnimated = tempCharaterTopAnimated + 40;
                                    tempBackgroundRightAnimated = tempBackgroundRightAnimated + 150;
                                    tempBackgroundBottomAnimated = tempBackgroundBottomAnimated - 50;
                                    break;
                                default:
                                    console.log('case last');
                                    tempCharaterLeftAnimated = tempCharaterLeftAnimated - 180;
                                    tempCharaterTopAnimated = tempCharaterTopAnimated - 10;
                                    if (questNum < data.length - 1) {
                                        tempBackgroundRightAnimated = tempBackgroundRightAnimated + 180;
                                    }
                                    break;
                            }
                            console.log('tempBackgroundRightAnimated',tempBackgroundRightAnimated);
                            console.log('tempBackgroundBottomAnimated',tempBackgroundBottomAnimated);
                            //di chuyen background
                            Animated.timing(backgroundRightAnimated, {
                                toValue: tempBackgroundRightAnimated,
                                duration: 1000,
                            }).start(( {finished} ) => {

                                if (finished) {
                                    console.log('backgroundRightAnimated1 stop')
                                }
                            });
                            Animated.timing(backgroundBottomAnimated, {
                                toValue: tempBackgroundBottomAnimated,
                                duration: 1000,
                            }).start(( {finished} ) => { 
                                if (finished) {
                                    console.log('backgroundBottomAnimated1 stop')
                                }
                            });

                            //di chuyen nhan vat
                            Animated.timing(charaterLeftAnimated, {
                                toValue: tempCharaterLeftAnimated,
                                duration: 1000,
                            }).start(( {finished} ) => {
                                if (finished) {
                                    console.log('charaterLeftAnimated3 stop')
                                }
                            });
                            Animated.timing(charaterTopAnimated, {
                                toValue: tempCharaterTopAnimated,
                                duration: 1000,
                            }).start(( {finished} ) => {
                                if (finished) {
                                    console.log('tempCharaterTopAnimated3 stop')
                                    if (questNum == data.length - 1) {
                                        flagFirework = true;
                                        setVisibleResult(!visibleResult);
                                        setClock(false);
                                    } else {
                                        questNum++;
                                        setClock(true);
                                        setFlagAnswer(true);
                                        setDisableAnswer(false);
                                    }
                                }
                            });
                        } else {
                            if (questNum == data.length - 1) {
                                flagFirework = true;
                                setVisibleResult(!visibleResult);
                                setClock(false);
                            } else {
                                questNum++;
                                setClock(true);
                                setFlagAnswer(true);
                                setDisableAnswer(false);
                            }
                        }
                    }
                });
            }
        } else {
            trueAnswer = false;
            questNum = 0;
            checkAnswer[index] = {backgroundColor : '#ff3300'};
            setClock(false);
            setDisableAnswer(false);
            setVisibleResult(!visibleResult);
            setTimeClock(TIME_ANSWER);
            
        }
    }

    const playAgain = () => {
        data.sort(() => Math.random() - 0.5)
        timeLeft = TIME_ANSWER;
        questNum = 0;
        checkAnswer = [];
        flagFirework = false;
        setScore(0);
        setClock(true);
        setFlagAnswer(true);
        setVisibleResult(!visibleResult);
        tempCharaterLeftAnimated = 100;
        tempCharaterTopAnimated = 300;
        Animated.timing(charaterLeftAnimated, {
            toValue: 0,
            duration: 0,
        }).start();

        Animated.timing(charaterTopAnimated, {
            toValue: DEFAULT_CHARATER_TOP_ANIMATED,
            duration: 0,
        }).start();

        Animated.timing(backgroundRightAnimated, {
            toValue: 0,
            duration: 0,
        }).start();

        Animated.timing(backgroundBottomAnimated, {
            toValue: DEFAULT_BACKGROUND_BOTTOM_ANIMATED,
            duration: 0,
        }).start();
    }

    const quitGame = () => {
        // if (visibleResult) {
        //     setVisibleResult(!visibleResult);
        // }
        // data.sort(() => Math.random() - 0.5)
        // NavigationService.navigate(Routes.LOGIN_SCREEN)
        questNum = 0;
        setClock(false);
        setTimeClock(TIME_ANSWER);
        setScore(0);
        data.sort(() => Math.random() - 0.5)
        setVisibleResult(false);
        tempCharaterLeftAnimated = 100;
        tempCharaterTopAnimated = 300;
        Animated.timing(charaterLeftAnimated, {
            toValue: 0,
            duration: 0,
        }).start();

        Animated.timing(charaterTopAnimated, {
            toValue: DEFAULT_CHARATER_TOP_ANIMATED,
            duration: 0,
        }).start();

        Animated.timing(backgroundRightAnimated, {
            toValue: 0,
            duration: 0,
        }).start();

        Animated.timing(backgroundBottomAnimated, {
            toValue: DEFAULT_BACKGROUND_BOTTOM_ANIMATED,
            duration: 0,
        }).start();
    }

    const backGame = () => {
        // setVisibleStartGame(!visibleStartGame);
        // NavigationService.navigate(Routes.LOGIN_SCREEN);
    }

    const modalRank = () => {
        setVisibleRank(!visibleRank);
        setClock(!clock);
    };

    const startGame = () => {
        setVisibleStartGame(!visibleStartGame);
        setvisibleQuest(!visibleQuest);
        setClock(true);
        setTimeClock(TIME_ANSWER);
        timeLeft = TIME_ANSWER;
    }

    const onFinishTime = () => {
        setClock(false);
        setTimeClock(TIME_ANSWER);
        setVisibleResult(!visibleResult);
    }

    const onChangeTime = () => {
        timeLeft = timeLeft - 1;
        console.log('timeLeft',timeLeft);
    }

    const Start = () => {
        // callApi(URL_GETRANKGAME,params);
        const Item = ({ item, index })=> {
            let medal = '';
            switch (index) {
                case 0:
                    medal = require('./assets/image/medal_icon_01.png');
                    break;
                case 1:
                    medal = require('./assets/image/medal_icon_02.png');
                    break;
                case 2:
                    medal = require('./assets/image/medal_icon_03.png');
                    break;
            }
            return (
                <View style={{backgroundColor: index % 2 == 0 ? '#ccfff5' : '#ffffff', borderRadius: 15, justifyContent:'space-between',flexDirection:'row', marginBottom: 15,height: 60}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{justifyContent:'center'}}>
                            <Image source={medal} style={{height:51,width:39,marginLeft:10}}/>
                        </View>
                        <View style={{justifyContent:'center',marginLeft:15}}>
                            <Text style={{fontSize: 20,fontWeight:'bold'}}>{item.name}</Text>
                            <Text style={{fontSize: 16}}>{item.class}</Text>
                        </View>
                    </View>
                </View>
            );
        }
        return(
            <Overlay isVisible={visibleStartGame} overlayStyle={styles.modalStartButton}>
                <View style={styles.headerStartButton}>
                    <Text style={styles.textHeaderStartButton}>Top Rank</Text>
                </View>
                {rank.length > 0 ? (
                    <VirtualizedList
                    data={rank}
                    renderItem={({ item, index }) => <Item item={item} index={index} />}
                    keyExtractor={ ( item,index ) => index.toString() }
                    getItemCount={(data) => {return 3}}
                    getItem={(data, index) => data[index]}
                />
                ) : (
                    <View style={{alignItems:'center',height:'55%'}}>
                        <Image source={require('./assets/image/no_player.png')} style={{height: 170, width: 170}}/>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Chưa có người chơi</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={styles.textStartButton}>Bắt Đầu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButton} onPress={backGame}>
                    <Text style={styles.textBackButton}>Quay Lại</Text>
                </TouchableOpacity>
            </Overlay>
        );
    }

    const Result = () => {
        // callApi(URL_SETSCORE)
        return(
            <Overlay isVisible={visibleResult} animationType={'fade'} overlayStyle={styles.modalResult}>
                <View style={styles.headerResult}>
                    <Text style={styles.textHeaderResult}>Your Score</Text>
                </View>
                <View style={styles.bodyResult}>
                    <Text style={styles.scoreResult}>{score}</Text>
                    {/* <Text style={{fontSize:18}}>You answer correctly {score} / {data.length}</Text> */}
                </View>
                <View style={{flexDirection: 'row',justifyContent:'space-around',height:'20%'}}>
                    <TouchableOpacity onPress={playAgain} style={{backgroundColor:'#66b3ff', height:40, justifyContent:'center', width:'40%', borderRadius:10}}>
                        <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:16}}>Chơi Lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={quitGame} style={{backgroundColor:'#ff0000', height:40, justifyContent:'center', width:'40%', borderRadius: 10}}>
                        <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:16}}>Thoát</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
        );
    }

    const TimeCountDown = () => {
        let timeCountDown = 0;
        if (trueAnswer) {
            timeCountDown = timeLeft;
        } else {
            timeCountDown = TIME_ANSWER;
        }
        return(
            <CountDown
                until={timeCountDown}
                size={25}
                onFinish={onFinishTime}
                onChange={onChangeTime}
                timeToShow={['M','S']}
                timeLabels={{m: null, s: null}}
                digitStyle={{backgroundColor: 'none', marginLeft:-10}}
                running={clock}
                digitTxtStyle={{color: '#cc5c00'}}
                separatorStyle={{color: '#cc5c00',marginLeft:-10,marginTop:-5}}
                showSeparator
            />
        )
    }

    const Rank = () => {
        // callApi(URL_GETRANKGAME,params);
        const Item = ({ item, index })=> {
            let medal = '';
            switch (index) {
                case 0:
                    medal = require('./assets/image/medal_icon_01.png');
                    break;
                case 1:
                    medal = require('./assets/image/medal_icon_02.png');
                    break;
                case 2:
                    medal = require('./assets/image/medal_icon_03.png');
                    break;
            }
            return (
                <View style={{backgroundColor: index % 2 == 0 ? '#ccfff5' : '#ffffff', borderRadius: 15, justifyContent:'space-between',flexDirection:'row', marginBottom: 15,height: 70}}>
                    <View style={{flexDirection:'row'}}>
                        {medal != '' ? (
                            <View style={{justifyContent:'center'}}>
                                <Image source={medal} style={{height:51,width:39,marginLeft:10}}/>
                            </View>
                        ) : (
                            <View style={{justifyContent:'center'}}>
                                 <Image source={require('./assets/image/medal_icon_04.png')} style={{height:45,width:36,marginLeft:10}}/>
                            </View>
                        )}
                        <View style={{justifyContent:'center', marginLeft:15}}>
                            <Text style={{fontSize: 20,fontWeight:'bold'}}>{item.name}</Text>
                            <Text style={{fontSize: 16}}>{item.class}</Text>
                        </View>
                    </View>
                    <View style={{ marginRight:15, flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize: 24,fontWeight:'bold', color: '#3333ff'}}> {item.score}</Text>
                        <Image source={require('./assets/image/rank_star.png')} style={{height: 35,width: 35, marginLeft: 10}} />
                    </View>
                </View>
            );
        }

        return(
            <Overlay animationType={'fade'} isVisible={visibleRank} onBackdropPress={modalRank} overlayStyle={styles.modalRank}>
                <View style={{justifyContent:'center',alignItems:'center',height:'10%'}}>
                    <Text style={{fontSize:30,fontWeight:'bold'}}>Top Rank</Text>
                </View>
                {rank.length > 0 ? (
                    <VirtualizedList
                        data={rank}
                        renderItem={({ item, index }) => <Item item={item} index={index} />}
                        keyExtractor={ ( item,index ) => index.toString() }
                        getItemCount={(data) => {return data.length}}
                        getItem={(data, index) => data[index]}
                    />
                ) : (
                    <View style={{alignItems:'center',height:'80%'}}>
                        <Image source={require('./assets/image/no_player.png')} style={{height: 200, width: 200}}/>
                        <Text style={{fontSize: 24, fontWeight: 'bold'}}>Chưa có người chơi</Text>
                    </View>
                )}
                <View style={{justifyContent:'center',height:'10%' }}>
                    <TouchableOpacity onPress={modalRank} style={{justifyContent:'center',height:'60%',width:'50%',backgroundColor:'#ff0000',alignSelf:'center',borderRadius:5}}>
                        <Text style={{alignSelf:'center',color: '#ffffff',fontSize:16,fontWeight:'bold'}}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
        );
    }

    return (
        <View style={styles.background}>
            <View style={{ height: windowWidth * 0.9}}>
                <Animated.Image source={require('./assets/image/background_game.png')} style={{height: 540,width: 960,bottom: backgroundBottomAnimated,right:backgroundRightAnimated,position:'relative'}} />
                <View style={{top: Platform.OS == 'ios' ? -540 : -560,flexDirection: 'row',justifyContent: 'space-between'}}>
                    <View style={{width: 130,height:60,borderRadius:15,backgroundColor:'#ffffff',marginTop:40, marginLeft:15,justifyContent:'center', alignItems:'center',flexDirection: 'row'}}>
                        <Image source={require('./assets/image/hourglass.gif')} style={{height:35,width:35,marginLeft:10}} />
                        <TimeCountDown />
                    </View>
                    <View style={{width:90,height:60,borderRadius:15,backgroundColor:'white',marginTop:40, marginRight:15,justifyContent:'center', alignItems:'center',flexDirection: 'row'}}>
                        <Image source={require('./assets/image/star.gif')} style={{height:40,width:40}} />
                        <Text style={{fontSize: 25, fontWeight:'bold',color:'#ffcc00'}}>{score < 10 ? '0'+score : score }</Text>
                    </View>
                </View>
                <Animated.Image source={characterStatus ? require('./assets/image/character_male_moving.gif') : require('./assets/image/character_male_hello.png')} style={{height: 70, width:36, top:charaterTopAnimated,left: charaterLeftAnimated, position:'absolute'}} />
                {/* <Animated.Image source={characterStatus ? require('./assets/image/character_female_moving.gif') : require('./assets/image/character_female_hello.png')} style={{height: 70, width:36, top:charaterTopAnimated,left: charaterLeftAnimated, position:'absolute'}} /> */}
                {flagFirework ? (
                    <Animated.Image source={require('./assets/image/firework.gif')} style={{height: 100, width: 100, top: tempCharaterTopAnimated - 100,left: tempCharaterLeftAnimated, position:'absolute'}} />
                ) : (
                    <View></View>
                )}
            </View>
            <View style={[styles.backgroundQuest, {height: windowHeight - (windowWidth * 0.9)}]}>
                <ImageBackground source={require('./assets/image/hexagon.png')} style={[styles.quest,{height: '16%'}]}>
                    <Text style={{fontSize: 20,fontWeight:'bold',color:'white'}}>{questions}</Text>
                </ImageBackground>
                <View style={styles.answer}>
                    <TouchableOpacity style={[styles.answerButton, checkAnswer[0]]} disabled={disableAnswer} onPress={() => chooseAnswer(renderAnwser[0],0)}>
                        <Text style={styles.answerText}>{renderAnwser[0]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.answerButton,checkAnswer[1]]} disabled={disableAnswer} onPress={() => chooseAnswer(renderAnwser[1],1)}>
                        <Text style={styles.answerText}>{renderAnwser[1]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.answerButton,checkAnswer[2]]} disabled={disableAnswer} onPress={() => chooseAnswer(renderAnwser[2],2)}>
                        <Text style={styles.answerText}>{renderAnwser[2]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.answerButton,checkAnswer[3]]} disabled={disableAnswer} onPress={() => chooseAnswer(renderAnwser[3],3)}>
                        <Text style={styles.answerText}>{renderAnwser[3]}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity style={styles.quitButton} onPress={quitGame}>
                        <Icon name="arrow-circle-left" size={30} color="#ffffff" />
                        <Text style={styles.titleQuitButton}>Thoát</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rankButton} onPress={modalRank}>
                        <Icon name="trophy" size={30} color="#ff0000" /> 
                        <Text style={styles.titleRankButton}>Xếp Hạng</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <StatusBar hidden={true} />
            <Start />
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
        // backgroundColor: '#00ffbf'
    },
    backgroundQuest: {
        justifyContent: 'center',
         backgroundColor: '#00ffbf'
    },
    quest: {
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    answer: {
        marginTop: -10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '16%',
        width: '80%',
        backgroundColor: '#66ccff',
        marginBottom: '3%',
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
        bottom: 15,
    },
    quitButton: {
        backgroundColor: '#ff0000',
        flexDirection: 'row',
        width: '45%',
        minHeight: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalRank: {
        height: '80%',
        width: '95%',
        borderRadius: 15
    },
    rankButton: {
        backgroundColor: 'white',
        flexDirection: 'row',
        width: '45%',
        minHeight: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    startButton: {
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
        height: '15%'
    },
    backButton: {
        backgroundColor: '#dddddd',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: '10%'
    },
    modalStartButton: {
        height: '50%',
        width: '70%',
        borderRadius: 15,
        justifyContent: 'flex-start'
    },
    headerStartButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '15%'
    },
    textHeaderStartButton: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000'
    },
    textStartButton: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold'
    },
    textBackButton: {
        color: '#000000',
        fontSize: 26
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
        color: '#ff0000'
    },
    titleQuitButton: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10
    },
    titleRankButton: {
        color: '#ff0000',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10
    }
});

export default App;

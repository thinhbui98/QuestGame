import React,{ useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
    Animated,
    Image,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity,
    VirtualizedList,
    Dimensions,
    LogBox,
    Button
} from 'react-native';
import { Overlay } from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import { ACCESS_TOKEN,HTTP_CODE } from '../../Constants';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { shuffleArray } from '../../Utils/ArrayUtils';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const rank = [
    {
        name:'Nguyen Van A',
        class: 'A123',
        score: 30
    },
    {
        name:'Nguyen Van B',
        class: 'B199',
        score: 28
    },
    {
        name:'Nguyen Van C',
        class: 'A123',
        score: 27
    },
    {
        name:'Nguyen Van D',
        class: 'B123',
        score: 23
    },
    {
        name:'Nguyen Van A',
        class: 'A123',
        score: 21
    },
    {
        name:'Nguyen Van B',
        class: 'B199',
        score: 17
    },
    {
        name:'Nguyen Van A',
        class: 'A123',
        score: 17
    },
    {
        name:'Nguyen Van B',
        class: 'B199',
        score: 16
    },
    {
        name:'Nguyen Van A',
        class: 'A123',
        score: 9
    }
];

LogBox.ignoreAllLogs();
const windowWidth = Dimensions.get('window').width,
    windowHeight = Dimensions.get('window').height,
    // DEFAULT_CHARATER_TOP_ANIMATED = 220, //190
    // DEFAULT_BACKGROUND_BOTTOM_ANIMATED = 250, //280
    DEFAULT_CHARATER_TOP_ANIMATED = 220, //190
    DEFAULT_BACKGROUND_BOTTOM_ANIMATED = 350, //280
    TIME_ANSWER = 300

var tempCharaterLeftAnimated = 140, //100
    tempCharaterTopAnimated = DEFAULT_CHARATER_TOP_ANIMATED,
    tempBackgroundRightAnimated = 0,
    tempBackgroundBottomAnimated = 0,
    movingBackground = 0,
    renderAnwser = [],
    checkAnswer = [],
    trueAnswer = 0,
    questNum = 0,
    flagFirework = false,
    dataRankGame = {};

const QuestGameScreen = ({route, navigation}) => {

    const { getRankGame, setResultGame } = useStoreActions((actions) => ({
        getRankGame: actions.game.getRankGame,
        setResultGame: actions.game.setResultGame
    })),
        { title, lesson_id, lesson_data } = route.params,
        PARAMS = {
            access_token: ACCESS_TOKEN,
            lesson_id: lesson_id
        }

    const processAnswerData = (data) => {
        let listAnswer = [];
        for (let index = 0; index < data.length; index++) {
            if (data[index].title_jp != '-') {
                listAnswer.push(data[index].title_jp);
            }
        }
        return listAnswer;
    }

    const processQuestionData = (data) => {
        let listQuestion = [];
        for (let index = 0; index < data.length; index++) {
            if (data[index].title_vn != '-') {
                listQuestion.push({
                    question: data[index].title_vn,
                    answer: data[index].title_jp
                });
            }
        }
        return listQuestion;
        // return shuffleArray(listQuestion);
    }
    
    const dataAnswer =  processAnswerData(lesson_data);

    const dataQuestion = processQuestionData(lesson_data);

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
        [disableAnswer, setDisableAnswer] = useState(false)
    //animated
    //trang thai dau tien
        charaterLeftAnimated = useRef(new Animated.Value(0)).current,
        charaterTopAnimated = useRef(new Animated.Value(DEFAULT_CHARATER_TOP_ANIMATED)).current,
        backgroundRightAnimated = useRef(new Animated.Value(0)).current,
        backgroundBottomAnimated = useRef(new Animated.Value(DEFAULT_BACKGROUND_BOTTOM_ANIMATED)).current,
    //render cau hoi va cau tra loi
        questions = dataQuestion[questNum].question,
        answer = [dataQuestion[questNum].answer];
        

        useLayoutEffect(() => {
            navigation.setOptions({
                title: title,
                // headerLeft: () => (
                //     <Icon name='chevron-left' />
                // )
                headerRight :  () => (<ButtonX
                    onPress={() => modalRank()}
                    tKey={'Xếp hạng'}
                    style={{
                        height: 40,
                        width: 120,
                        backgroundColor : '#d40000'
                    }}
                />)
            });
        }, [navigation]);

        useEffect(() => {
            apiGetRankGame();
        }, [])

    if (flagAnswer) {
        let i = 0, temp;
        while (i < 3) {
            let rand = Math.floor(Math.random() * dataAnswer.length);
            if(answer.indexOf(dataAnswer[rand]) == -1){
                if(dataAnswer[rand] != answer[0] && rand != temp){
                    answer.push(dataAnswer[rand]);
                    answer.sort(() => Math.random() - 0.5);
                    temp = rand;
                    i++;
                }
            }
        }
        // console.log('answer123123ư',answer);
        console.log('questNum',questNum);
        for (let j = 0; j < answer.length; j++) {
            if (answer[j] == dataQuestion[questNum].answer) {
                checkAnswer[j] = true;
            } else {
                checkAnswer[j] = false;
            }
        }
        renderAnwser = answer;
        console.log('checkAnswer',checkAnswer);
        setFlagAnswer(false);
    }

    const chooseAnswer = (answer,index) => {
        setDisableAnswer(true);
        if (answer == dataQuestion[questNum].answer) {
            checkAnswer[index] = {backgroundColor: '#00cc00'};
            trueAnswer = true;
            setClock(false);
            setScore(score + 1);
            setcharacterStatus(true);
            if (score < 1) {
                //Lan dau tien di chuyen nhan vat
                Animated.timing(charaterLeftAnimated, {
                    toValue: windowWidth/3,
                    duration: 2000,
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
                tempCharaterLeftAnimated = tempCharaterLeftAnimated + 16; // giam 2 thi duoc them 5 cau
                tempCharaterTopAnimated = tempCharaterTopAnimated - 8;
                Animated.timing(charaterLeftAnimated, {
                    toValue: tempCharaterLeftAnimated,
                    duration: 1000, 
                }).start(( {finished} ) => {
                    if (finished) {
                        console.log('charaterLeftAnimated2 stop')
                    }
                });
                Animated.timing(charaterTopAnimated, {
                    toValue: tempCharaterTopAnimated,
                    duration: 1000, 
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
                                    tempCharaterLeftAnimated = tempCharaterLeftAnimated - 80;
                                    tempCharaterTopAnimated = tempCharaterTopAnimated + 30;
                                    tempBackgroundRightAnimated = tempBackgroundRightAnimated + 100;
                                    tempBackgroundBottomAnimated = tempBackgroundBottomAnimated + 300;
                                    break;
                                case 2:
                                    console.log('case2');
                                    tempCharaterLeftAnimated = tempCharaterLeftAnimated - 60;
                                    tempCharaterTopAnimated = tempCharaterTopAnimated + 40;
                                    tempBackgroundRightAnimated = tempBackgroundRightAnimated + 80;
                                    tempBackgroundBottomAnimated = tempBackgroundBottomAnimated - 50;
                                    break;
                                case 3:
                                    console.log('case3');
                                    tempCharaterLeftAnimated = tempCharaterLeftAnimated - 130;
                                    tempCharaterTopAnimated = tempCharaterTopAnimated + 30;
                                    tempBackgroundRightAnimated = tempBackgroundRightAnimated + 150;
                                    tempBackgroundBottomAnimated = tempBackgroundBottomAnimated - 50;
                                    break;
                                default:
                                    console.log('case last');
                                    if (questNum < dataQuestion.length - 1) {
                                        tempCharaterLeftAnimated = tempCharaterLeftAnimated - 180;
                                        tempCharaterTopAnimated = tempCharaterTopAnimated + 40;
                                        tempBackgroundRightAnimated = tempBackgroundRightAnimated + 180;
                                        tempBackgroundBottomAnimated = tempBackgroundBottomAnimated - 50;
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
                                    if (questNum == dataQuestion.length - 1) {
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
                            if (questNum == dataQuestion.length - 1) {
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
        }
    }

    const playAgain = () => {
        questNum = 0;
        checkAnswer = [];
        flagFirework = false;
        movingBackground = 0;
        tempCharaterLeftAnimated = 140;
        tempCharaterTopAnimated = DEFAULT_CHARATER_TOP_ANIMATED;
        tempBackgroundRightAnimated = 0,
        tempBackgroundBottomAnimated = 0,
        setScore(0);
        setClock(true);
        setFlagAnswer(true);
        setDisableAnswer(false);
        setVisibleResult(!visibleResult);
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
        if (visibleResult) {
            setVisibleResult(!visibleResult);
        }
        navigation.goBack();
    }

    const backGame = () => {
        setVisibleStartGame(!visibleStartGame);
        navigation.goBack();
    }

    const modalRank = () => {
        setVisibleRank(!visibleRank);
        setVisibleResult(!visibleResult);
    };

    const startGame = () => {
        setVisibleStartGame(!visibleStartGame);
        setvisibleQuest(!visibleQuest);
        setClock(true);
    }

    const onFinishTime = () => {
        setClock(false);
        setVisibleResult(!visibleResult);
    }

    const onChangeTime = () => {
        console.log('onChangeTime run');
    }

    const apiGetRankGame = async () => {
        const { code, message, data } = await getRankGame(PARAMS);
        if (code == HTTP_CODE.CODE_201 || code == HTTP_CODE.CODE_401) {
            toastRef.current.showAlert({
                content : message, 
                isSuccess : false
            });
        } else {
            dataRankGame = data.top10;
        }
    }

    const Start = () => {
        console.log('top',dataRankGame);
        const Item = ({ item, index })=> {
            let medal = '';
            switch (index) {
                case 0:
                    medal = require('../../Assets/game/medal_icon_01.png');
                    break;
                case 1:
                    medal = require('../../Assets/game/medal_icon_02.png');
                    break;
                case 2:
                    medal = require('../../Assets/game/medal_icon_03.png');
                    break;
            }
            return (
                <View style={{backgroundColor: index % 2 == 0 ? '#ccfff5' : '#ffffff', borderRadius: 15,flexDirection:'row', marginBottom: 15,height: 60}}>
                    <View style={{justifyContent:'center'}}>
                        <Image source={medal} style={{height:51,width:39,marginLeft:10}}/>
                    </View>
                    <View style={{justifyContent:'center',marginLeft:15}}>
                        <Text style={{fontSize: 20,fontWeight:'bold'}}>{item.name}</Text>
                        <Text style={{fontSize: 16}}>{item.class}</Text>
                    </View>
                </View>
            );
        }
        return(
            <Overlay isVisible={visibleStartGame} overlayStyle={styles.modalStartButton}>
                <View style={styles.headerStartButton}>
                    <Text style={styles.textHeaderStartButton}>Top Rank</Text>
                </View>
                {dataRankGame.length > 0 ? (
                    <VirtualizedList
                        data={dataRankGame}
                        renderItem={({ item, index }) => <Item item={item} index={index} />}
                        keyExtractor={ ( item,index ) => index.toString() }
                        getItemCount={(data) => {return 3}}
                        getItem={(data, index) => data[index]}
                    />
                ) : (
                    <View style={{alignItems:'center',height:'55%'}}>
                        <Image source={require('../../Assets/game/no_player.png')} style={{height: 170, width: 170}}/>
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
        return(
            <Overlay isVisible={visibleResult} animationType={'fade'} overlayStyle={styles.modalResult}>
                <View style={styles.headerResult}>
                    <Text style={styles.textHeaderResult}>Your Score</Text>
                </View>
                <View style={styles.bodyResult}>
                    <Text style={styles.scoreResult}>{score}</Text>
                    {/* <Text style={{fontSize:18}}>You answer correctly {score} / {data.length}</Text> */}
                    <TouchableOpacity onPress={modalRank} style={{backgroundColor:'#00ffbf', height:40, justifyContent:'center', width:'60%', borderRadius:10}}>
                        <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:16}}>Xếp hạng</Text>
                    </TouchableOpacity>
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

    const Rank = () => {
        const Item = ({ item, index })=> {
            let medal = '';
            switch (index) {
                case 0:
                    medal = require('../../Assets/game/medal_icon_01.png');
                    break;
                case 1:
                    medal = require('../../Assets/game/medal_icon_02.png');
                    break;
                case 2:
                    medal = require('../../Assets/game/medal_icon_03.png');
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
                                <Image source={require('../../Assets/game/medal_icon_04.png')} style={{height:45,width:36,marginLeft:10}}/>
                            </View>
                        )}
                        <View style={{justifyContent:'center', marginLeft:15}}>
                            <Text style={{fontSize: 20,fontWeight:'bold'}}>{item.name}</Text>
                            <Text style={{fontSize: 16}}>{item.class}</Text>
                        </View>
                    </View>
                    <View style={{ marginRight:15, flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize: 24,fontWeight:'bold', color: '#3333ff'}}> {item.score}</Text>
                        <Image source={require('../../Assets/game/rank_star.png')} style={{height: 35,width: 35, marginLeft: 10}} />
                    </View>
                </View>
            );
        }
        return(
            <Overlay animationType={'fade'} isVisible={visibleRank} overlayStyle={styles.modalRank}>
                <View style={{justifyContent:'center',alignItems:'center',height:'10%'}}>
                    <Text style={{fontSize:30,fontWeight:'bold'}}>Top Rank</Text>
                </View>
                {dataRankGame.length > 0 ? (
                    <VirtualizedList
                        data={dataRankGame}
                        renderItem={({ item, index }) => <Item item={item} index={index} />}
                        keyExtractor={ ( item,index ) => index.toString() }
                        getItemCount={(data) => {return data.length}}
                        getItem={(data, index) => data[index]}
                    />
                ) : (
                    <View style={{alignItems:'center',height:'80%'}}>
                        <Image source={require('../../Assets/game/no_player.png')} style={{height: 200, width: 200}}/>
                        <Text style={{fontSize: 24, fontWeight: 'bold'}}>Chưa có người chơi</Text>
                    </View>
                )}
                <View style={{justifyContent:'center',height:'10%'}}>
                    <TouchableOpacity onPress={modalRank} style={{justifyContent:'center',height:'60%',width:'50%',backgroundColor:'#ff0000',alignSelf:'center',borderRadius:5}}>
                        <Text style={{alignSelf:'center',color: '#ffffff',fontSize:16,fontWeight:'bold'}}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
        );
    }

    const TimeCountDown = () => {
        return(
            <CountDown
                until={timeClock}
                size={25}
                onFinish={onFinishTime}
                onChange={onChangeTime}
                timeToShow={['S']}
                timeLabels={{s: null}}
                digitStyle={{backgroundColor: 'none', marginLeft:-10}}
                running={clock}
                digitTxtStyle={{color: '#cc5c00'}}
                separatorStyle={{color: '#cc5c00',marginLeft:-10,marginTop:-5}}
                showSeparator
            />
        )
    }

    const Rock = () => {
        return(
            <Animated.Image source={require('../../Assets/game/rock_01.png')} style={[styles.rock, {top: tempCharaterTopAnimated + 40 ,left: tempCharaterLeftAnimated + 30}]} />    
        )
    }

    return (
        <View style={styles.background}>
            <View style={{ height: windowWidth * 0.7}}>
                <Animated.Image source={require('../../Assets/game/background_game.png')} style={[styles.backgroundGame, {bottom: backgroundBottomAnimated, right: backgroundRightAnimated}]} />
                <View style={{top: Platform.OS == 'ios' ? -650 : -640,flexDirection: 'row',justifyContent: 'space-between'}}>
                    <View style={styles.clockCountDown}>
                        <Image source={require('../../Assets/game/hourglass.gif')} style={styles.hourGlass} />
                        <TimeCountDown />
                    </View>
                    <View style={styles.pointGame}>
                        <Image source={require('../../Assets/game/star.gif')} style={styles.pointStar} />
                        <Text style={styles.pointText}>{score < 10 ? '0' + score : score }</Text>
                    </View>
                </View>
                <Animated.Image source={characterStatus ? require('../../Assets/game/character_male_moving.gif') : require('../../Assets/game/character_male_hello.png')} style={[styles.character, {top:charaterTopAnimated,left: charaterLeftAnimated}]} />
                {/* <Animated.Image source={characterStatus ? require('../../Assets/game/character_female_moving.gif') : require('../../Assets/game/character_female_hello.png')} style={{height: 70, width:36, top:charaterTopAnimated,left: charaterLeftAnimated, position:'absolute'}} /> */}
                {flagFirework ? (
                    <Animated.Image source={require('../../Assets/game/firework.gif')} style={[styles.firework, {top: tempCharaterTopAnimated - 100,left: tempCharaterLeftAnimated}]} />
                ) : (
                    <View></View>
                )}
                <Rock />
            </View>
            <View style={[styles.backgroundQuest, {height: windowHeight - (windowWidth * 0.9)}]}>
                <ImageBackground source={require('../../Assets/game//hexagon.png')} style={[styles.quest,{height: '16%'}]}>
                    <Text style={styles.questText}>{questions}</Text>
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
            </View>
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
    },
    backgroundGame: {
        // height: 540,
        // width: 960,
        height: 648,
        width: 1152,
        position:'relative'
    },
    clockCountDown: {
        width: 90,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        marginTop: 40,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    hourGlass: {
        height: 35,
        width: 35,
        marginLeft: 10
    },
    pointStar: {
        height: 40,
        width: 40
    },
    pointGame: {
        width: 90,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        marginTop: 40,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    pointText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#ffcc00'
    },
    character: {
        height: 70,
        width: 36,
        position: 'absolute'
    },
    firework: {
        height: 100,
        width: 100,
        position:'absolute'
    },
    rock: {
        height: 30,
        width: 30,
        position:'absolute'
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
    questText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    answer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '15%',
        width: '80%',
        backgroundColor: '#66ccff',
        marginBottom: '5%',
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
        bottom: 50,
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
        fontSize: 22,
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

export default QuestGameScreen;

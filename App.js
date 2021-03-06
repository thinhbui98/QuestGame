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
    LogBox
} from 'react-native';
import { Overlay } from 'react-native-elements';
import { CountDownX } from '../../Components';
import { ACCESS_TOKEN,HTTP_CODE } from '../../Constants';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { shuffleArray } from '../../Utils/ArrayUtils';
import Icon from 'react-native-vector-icons/FontAwesome';

LogBox.ignoreAllLogs();
const WINDOW_WIDTH = Dimensions.get('window').width,
    WINDOW_HEIGHT = Dimensions.get('window').height,
    DEFAULT_CHARATER_TOP_ANIMATED = WINDOW_WIDTH < 380 ? 190 : 220, //190
    DEFAULT_CHARATER_LEFT_ANIMATED = 140,
    DEFAULT_BACKGROUND_BOTTOM_ANIMATED = WINDOW_WIDTH < 380 ? 380 : 350, //380,
    DEFAULT_ROCK_LEFT_ANIMATED = 170,
    DEFAULT_ROCK_TOP_ANIMATED = 500,
    BONUS_ROCK_FLAG = 0,
    BONUS_FOOD_FLAG = 1,
    MALE_FLAG = 0,
    FEMALE_FLAG = 1,
    DEFAULT_FOOD_OPACITY = 1,
    TIME_ANSWER = 3;

var tempCharaterLeftAnimated = DEFAULT_CHARATER_LEFT_ANIMATED,
    tempCharaterTopAnimated = DEFAULT_CHARATER_TOP_ANIMATED,
    tempBackgroundRightAnimated = 0,
    tempBackgroundBottomAnimated = 0,
    tempOpacityFood = 0,
    firstStep = WINDOW_WIDTH/9,
    movingBackground = 0,
    renderAnwser = [],
    checkAnswer = [],
    trueAnswer = 0,
    questNum = 0,
    indexFood = 0,
    flagFirework = false,
    flagQuestion = false,
    flagShufferQuest = false,
    flagBonus = false,
    flagPositionFood = false,
    flagPositionRock = false,
    positionFood = [],
    positionRock = [],
    dataQuestion = '',
    dataRankGame = {};

const QuestGameScreen = ({route, navigation}) => {

    const { getRankGame, setResultGame } = useStoreActions((actions) => ({
        getRankGame: actions.game.getRankGame,
        setResultGame: actions.game.setResultGame
    })),
        { userInfo } = useStoreState(state => ({
        userInfo : state.user.userInfo
    })),
        { title, lesson_id, lesson_data } = route.params,
        PARAMS = {
            access_token: ACCESS_TOKEN,
            lesson_id: lesson_id
        }

    const processAnswerData = (data) => {
        let listAnswer = [];
        if (title == 'Hiragana' || title == 'Katakana' ) {
            for (let index = 0; index < data.length; index++) {
                if (data[index].title_jp != '-') {
                    listAnswer.push(data[index].title_jp);
                }
            }
        } else {
            for (let index = 0; index < data.length; index++) {
                if (data[index].title_vn != '-') {
                    listAnswer.push(data[index].title_vn);
                }
            }
        }
        return listAnswer;
    }

    const processQuestionData = (data) => {
        let listQuestion = [];
        if (flagShufferQuest == false) {
            shuffleArray(data);
            flagShufferQuest = true;
        }
        let rockPosition = [ 5, 9, 12, 15, 19, 22],
            foodPosition = [ 6, 10, 13, 17, 21, 26];
        if (title == 'Hiragana' || title == 'Katakana' ) {
            for (let index = 0; index < data.length; index++) {
                let bonus = false;
                if (data[index].title_vn != '-') {
                    if (listQuestion.length < 30) {
                        if (rockPosition.indexOf(index) != -1) {
                            bonus = BONUS_ROCK_FLAG;
                        } else if(foodPosition.indexOf(index) != -1) {
                            bonus = BONUS_FOOD_FLAG;
                        }
                        listQuestion.push({
                            question: data[index].title_vn,
                            answer: data[index].title_jp,
                            position: index,
                            bonus: bonus
                        });
                    } else {
                        break;
                    }
                }
            }
        } else {
            for (let index = 0; index < data.length; index++) {
                let bonus = false;
                if (data[index].title_jp != '-') {
                    if (listQuestion.length < 30) {
                        if (rockPosition.indexOf(index) != -1) {
                            bonus = BONUS_ROCK_FLAG;
                        } else if(foodPosition.indexOf(index) != -1) {
                            bonus = BONUS_FOOD_FLAG;
                        }
                        listQuestion.push({
                            question: data[index].title_jp,
                            answer: data[index].title_vn,
                            position: index,
                            bonus: bonus
                        });
                    } else {
                        break;
                    }
                }
            }
        }
        return listQuestion;
    }

    const dataAnswer =  processAnswerData(lesson_data);
    if (flagQuestion == false) {
        flagQuestion = true;
        dataQuestion = processQuestionData(lesson_data);
    }

    //state
    const [score, setScore] = useState(0),
        [visibleStartGame, setVisibleStartGame] = useState(true),
        [visibleResult, setVisibleResult] = useState(false),
        [visibleRank, setVisibleRank] = useState(false),
        [visibleQuest, setvisibleQuest] = useState(false),
        [characterStatus, setcharacterStatus] = useState(1),
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
        rockLeftAnimated = useRef(new Animated.Value(DEFAULT_ROCK_LEFT_ANIMATED)).current,
        rockTopAnimated = useRef(new Animated.Value(DEFAULT_ROCK_TOP_ANIMATED)).current,
        opacityFoodAnimated = useRef(new Animated.Value(DEFAULT_FOOD_OPACITY)).current
    //render cau hoi va cau tra loi
        questions = dataQuestion[questNum].question,
        answer = [dataQuestion[questNum].answer];

        useLayoutEffect(() => {
            navigation.setOptions({
                title: title,
                headerLeft :  () => (
                    <TouchableOpacity onPress={quitGame}>
                        <Icon name={'chevron-left'} color={'#ffffff'} size={28} />
                    </TouchableOpacity>
                )
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
        console.log('answer',answer);
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
            setcharacterStatus(2);
            if (questNum < 3) {
                //Lan dau tien di chuyen nhan vat
                Animated.timing(charaterLeftAnimated, {
                    toValue: firstStep,
                    duration: 1500,
                }).start(( {finished} ) => {
                    if (finished) {
                        console.log('charaterLeftAnimated1 stop')
                        questNum++;
                        firstStep = firstStep + WINDOW_WIDTH/9;
                        setFlagAnswer(true);
                        setClock(true);
                        setDisableAnswer(false);
                    }
                });
            } else {
                //Cac lan tiep theo
                if (dataQuestion[questNum].bonus === BONUS_ROCK_FLAG) {
                    console.log('hello',questNum);
                    tempCharaterLeftAnimated = tempCharaterLeftAnimated + 30;
                    tempCharaterTopAnimated = tempCharaterTopAnimated - 40;
                    Animated.timing(charaterTopAnimated, {
                        toValue: tempCharaterTopAnimated,
                        duration: 1000,
                    }).start((finished) => {});
                    Animated.timing(charaterLeftAnimated, {
                        toValue: tempCharaterLeftAnimated,
                        duration: 1000, 
                    }).start((finished) => {
                        tempCharaterLeftAnimated = tempCharaterLeftAnimated + 20;
                        tempCharaterTopAnimated = tempCharaterTopAnimated + 10;
                        Animated.timing(charaterTopAnimated, {
                            toValue: tempCharaterTopAnimated,
                            duration: 1000,
                        }).start((finished) => {});
                        Animated.timing(charaterLeftAnimated, {
                            toValue: tempCharaterLeftAnimated,
                            duration: 1000, 
                        }).start((finished) => {
                            //di chuyen background va nhan vat theo so diem
                            console.log('charaterTopAnimated2 stop')
                            if (finished) {
                                //neu nhat vat di duoc 1/2 width man hinh thi se di chuyen background
                                if (tempCharaterLeftAnimated > WINDOW_WIDTH * 2/3) {
                                    //tinh so lan di chuyen background
                                    movingBackground = movingBackground + 1;
                                    switch (movingBackground) {
                                        case 1:
                                            console.log('case11');
                                            if (WINDOW_WIDTH < 380) {
                                                tempCharaterLeftAnimated = tempCharaterLeftAnimated - 80;
                                                tempCharaterTopAnimated = tempCharaterTopAnimated + 60;
                                            } else {
                                                tempCharaterLeftAnimated = tempCharaterLeftAnimated - 80;
                                                tempCharaterTopAnimated = tempCharaterTopAnimated + 40;
                                            }
                                            tempBackgroundRightAnimated = tempBackgroundRightAnimated + 100;
                                            tempBackgroundBottomAnimated = tempBackgroundBottomAnimated + 300;
                                            break;
                                        case 2:
                                            console.log('case22');
                                            tempCharaterLeftAnimated = tempCharaterLeftAnimated - 60;
                                            tempCharaterTopAnimated = tempCharaterTopAnimated + 40;
                                            tempBackgroundRightAnimated = tempBackgroundRightAnimated + 80;
                                            tempBackgroundBottomAnimated = tempBackgroundBottomAnimated - 50;
                                            break;
                                        case 3:
                                            console.log('case33');
                                            tempCharaterLeftAnimated = tempCharaterLeftAnimated - 140;
                                            tempCharaterTopAnimated = tempCharaterTopAnimated + 50;
                                            tempBackgroundRightAnimated = tempBackgroundRightAnimated + 150;
                                            tempBackgroundBottomAnimated = tempBackgroundBottomAnimated - 50;
                                            break;
                                        default:
                                            console.log('case last');
                                            if (questNum < dataQuestion.length - 1) {
                                                tempCharaterLeftAnimated = tempCharaterLeftAnimated - 180;
                                                tempCharaterTopAnimated = tempCharaterTopAnimated + 50;
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
                    });
                } else if (dataQuestion[questNum].bonus === BONUS_FOOD_FLAG) {
                    tempCharaterLeftAnimated = tempCharaterLeftAnimated + 20;
                    tempCharaterTopAnimated = tempCharaterTopAnimated - 10;
                    Animated.timing(charaterLeftAnimated, {
                        toValue: tempCharaterLeftAnimated,
                        duration: 1000, 
                    }).start(( {finished} ) => {});
                    Animated.timing(charaterTopAnimated, {
                        toValue: tempCharaterTopAnimated,
                        duration: 1000,
                    }).start(( {finished} ) => {
                        Animated.timing(charaterTopAnimated, {
                            toValue: tempCharaterTopAnimated - 30,
                            duration: 800,
                        }).start(( {finished} ) => {
                            Animated.timing(opacityFoodAnimated, {
                                toValue: tempOpacityFood,
                                duration: 300,
                            }).start(({finished}) => {});
                            dataQuestion[questNum].bonus = true;
                            indexFood++;
                            Animated.timing(charaterTopAnimated, {
                                toValue: tempCharaterTopAnimated,
                                duration: 800,
                            }).start(({finished}) => {
                                //di chuyen background va nhan vat theo so diem
                                console.log('charaterTopAnimated2 stop')
                                if (finished) {
                                    //neu nhat vat di duoc 1/2 width man hinh thi se di chuyen background
                                    if (tempCharaterLeftAnimated > WINDOW_WIDTH * 2/3) {
                                        //tinh so lan di chuyen background
                                        movingBackground = movingBackground + 1;
                                        switch (movingBackground) {
                                            case 1:
                                                console.log('case11');
                                                tempCharaterLeftAnimated = tempCharaterLeftAnimated - 80;
                                                tempCharaterTopAnimated = tempCharaterTopAnimated + 40;
                                                tempBackgroundRightAnimated = tempBackgroundRightAnimated + 100;
                                                tempBackgroundBottomAnimated = tempBackgroundBottomAnimated + 300;
                                                break;
                                            case 2:
                                                console.log('case22');
                                                tempCharaterLeftAnimated = tempCharaterLeftAnimated - 60;
                                                tempCharaterTopAnimated = tempCharaterTopAnimated + 40;
                                                tempBackgroundRightAnimated = tempBackgroundRightAnimated + 80;
                                                tempBackgroundBottomAnimated = tempBackgroundBottomAnimated - 50;
                                                break;
                                            case 3:
                                                console.log('case33');
                                                tempCharaterLeftAnimated = tempCharaterLeftAnimated - 140;
                                                tempCharaterTopAnimated = tempCharaterTopAnimated + 50;
                                                tempBackgroundRightAnimated = tempBackgroundRightAnimated + 150;
                                                tempBackgroundBottomAnimated = tempBackgroundBottomAnimated - 50;
                                                break;
                                            default:
                                                console.log('case last');
                                                if (questNum < dataQuestion.length - 1) {
                                                    tempCharaterLeftAnimated = tempCharaterLeftAnimated - 180;
                                                    tempCharaterTopAnimated = tempCharaterTopAnimated + 50;
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
                        });
                    });
                } else {
                    tempCharaterLeftAnimated = tempCharaterLeftAnimated + 20;
                    tempCharaterTopAnimated = tempCharaterTopAnimated - 10;
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
                            if (tempCharaterLeftAnimated > WINDOW_WIDTH * 2/3) {
                                //tinh so lan di chuyen background
                                movingBackground = movingBackground + 1;
                                switch (movingBackground) {
                                    case 1:
                                        console.log('case1');
                                        if (WINDOW_WIDTH < 380) {
                                            tempCharaterLeftAnimated = tempCharaterLeftAnimated - 90;
                                            tempCharaterTopAnimated = tempCharaterTopAnimated + 70;
                                        } else {
                                            tempCharaterLeftAnimated = tempCharaterLeftAnimated - 80;
                                            tempCharaterTopAnimated = tempCharaterTopAnimated + 40;
                                        }
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
                                        tempCharaterLeftAnimated = tempCharaterLeftAnimated - 120;
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
                                            apiSetResultGame();
                                            setcharacterStatus(3);
                                            setTimeout(() => {
                                                setVisibleResult(!visibleResult);
                                            }, 1500);
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
                                    apiSetResultGame();
                                    setcharacterStatus(3);
                                    setTimeout(() => {
                                        setVisibleResult(!visibleResult);
                                    }, 1500);
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
            }
        } else {
            trueAnswer = false;
            questNum = 0;
            checkAnswer[index] = {backgroundColor : '#ff3300'};
            apiSetResultGame();
            setClock(false);
            setDisableAnswer(false);
            setTimeout(() => {
                setVisibleResult(!visibleResult);
            }, 500);
        }
    }

    const resetGame = () => {
        questNum = 0;
        indexFood = 0;
        checkAnswer = [];
        flagFirework = false;
        flagBonus = true;
        flagPositionFood = false;
        flagPositionRock = false;
        flagQuestion = false;
        flagShufferQuest = true;
        dataQuestion = [];
        positionFood = [];
        positionRock = [];
        movingBackground = 0;
        firstStep = WINDOW_WIDTH/9;
        tempCharaterLeftAnimated = DEFAULT_CHARATER_LEFT_ANIMATED;
        tempCharaterTopAnimated = DEFAULT_CHARATER_TOP_ANIMATED;
        tempBackgroundRightAnimated = 0;
        tempBackgroundBottomAnimated = 0;
        setScore(0);
        setClock(true);
        setFlagAnswer(true);
        setDisableAnswer(false);
        setcharacterStatus(1);
        if (visibleResult) {
            setVisibleResult(!visibleResult);
        }
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

    const playAgain = () => {
        resetGame();
    }

    const quitGame = () => {
        if (visibleResult) {
            setVisibleResult(!visibleResult);
        }
        resetGame();
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
        apiSetResultGame();
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

    const apiSetResultGame = async () => {
        let params = {
            access_token: ACCESS_TOKEN,
            lesson_id: lesson_id,
            account_id: userInfo.id,
            score: score
        }
        const { code, message, data } = await setResultGame(params);
        if (code == HTTP_CODE.CODE_201 || code == HTTP_CODE.CODE_401) {
            toastRef.current.showAlert({
                content : message, 
                isSuccess : false
            });
        } else {
            console.log('Success set score game');
        }
    }

    const Start = () => {
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
                <View style={[styles.itemStart ,{backgroundColor: index % 2 == 0 ? '#ccfff5' : '#ffffff'}]}>
                    <View style={{justifyContent:'center'}}>
                        <Image source={medal} style={styles.medalStart}/>
                    </View>
                    <View style={{justifyContent:'center',marginLeft:15}}>
                        <Text style={{fontSize: 20,fontWeight: 'bold'}}>{item.name}</Text>
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
                        <Image source={require('../../Assets/game/no_player.png')} style={styles.noPlayerImg}/>
                        <Text style={styles.noPlayerText}>Chưa có người chơi</Text>
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
                    <TouchableOpacity onPress={modalRank} style={styles.rankResultButton}>
                        <Text style={styles.rankResultText}>Xếp hạng</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerResult}>
                    <TouchableOpacity onPress={playAgain} style={styles.playAgainButton}>
                        <Text style={styles.playAgainText}>Chơi Lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={quitGame} style={styles.quitGameButton}>
                        <Text style={styles.quitGameText}>Thoát</Text>
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
                <View style={[styles.itemRank ,{backgroundColor: index % 2 == 0 ? '#ccfff5' : '#ffffff'}]}>
                    <View style={{flexDirection:'row'}}>
                        {medal != '' ? (
                            <View style={{justifyContent:'center'}}>
                                <Image source={medal} style={styles.medalTop}/>
                            </View>
                        ) : (
                            <View style={{justifyContent:'center'}}>
                                <Image source={require('../../Assets/game/medal_icon_04.png')} style={styles.medalNormal}/>
                            </View>
                        )}
                        <View style={{justifyContent:'center', marginLeft:15}}>
                            <Text style={{fontSize: 20,fontWeight:'bold'}}>{item.name}</Text>
                            <Text style={{fontSize: 16}}>{item.class}</Text>
                        </View>
                    </View>
                    <View style={styles.itemPoint}>
                        <Text style={styles.itemScore}>{item.score}</Text>
                        <Image source={require('../../Assets/game/rank_star.png')} style={styles.starPoint} />
                    </View>
                </View>
            );
        }
        return(
            <Overlay animationType={'fade'} isVisible={visibleRank} overlayStyle={styles.modalRank}>
                <View style={styles.headerRank}>
                    <Text style={styles.headerRankText}>Top Rank</Text>
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
                    <View style={styles.bodyRank}>
                        <Image source={require('../../Assets/game/no_player.png')} style={styles.noPlayerRankImg}/>
                        <Text style={{fontSize: 24, fontWeight: 'bold'}}>Chưa có người chơi</Text>
                    </View>
                )}
                <View style={styles.footerRank}>
                    <TouchableOpacity onPress={modalRank} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
        );
    }

    const TimeCountDown = () => {
        return(
            <CountDownX
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
        let positionTop = -10,
            positionLeft = 90,
            
            rockImgSource = [
                require('../../Assets/game/rock_01.png'),
                require('../../Assets/game/rock_02.png'),
                require('../../Assets/game/rock_03.png'),
                require('../../Assets/game/rock_04.png'),
                require('../../Assets/game/rock_05.png'),
                require('../../Assets/game/rock_06.png'),
                require('../../Assets/game/rock_07.png'),
                require('../../Assets/game/rock_08.png'),
            ];
        if (flagPositionRock == false) {
            flagPositionRock = true;
            for (let index = 0; index < 7; index++) {
                let randomNumber = Math.floor(Math.random() * 8);
                if (index > 3) {
                    positionTop = positionTop - 60;
                    positionLeft = positionLeft + 100;
                } else if (index == 0) {
                    positionTop = -10;
                    positionLeft = 90;
                } else {
                    positionTop = positionTop - 60;
                    positionLeft = positionLeft + 120;
                }
                positionRock.push({
                    top: positionTop,
                    left: positionLeft,
                    source: rockImgSource[randomNumber]
                })
            }
        }

        return (
            <View>
                {positionRock.map((result,index,value) => {
                    return(
                        <Image source={result.source} style={[styles.rock, {top: result.top, left: result.left}]} />
                    );
                })}
            </View>
        );
    }

    const Food = () => {
        let positionTop = -170,
            positionLeft = 250,
            foodImgSource = [
                require('../../Assets/game/food_01.png'),
                require('../../Assets/game/food_02.png'),
                require('../../Assets/game/food_03.png'),
                require('../../Assets/game/food_04.png'),
                require('../../Assets/game/food_05.png'),
                require('../../Assets/game/food_06.png'),
                require('../../Assets/game/food_07.png'),
                require('../../Assets/game/food_08.png'),
            ];
        if (flagPositionFood == false) {
            flagPositionFood = true;
            for (let index = 0; index < 7; index++) {
                let randomNumber = Math.floor(Math.random() * 8);
                if (index > 2) {
                    positionTop = positionTop - 70;
                    positionLeft = positionLeft + 120;
                } else if (index == 0) {
                    positionTop = -170;
                    positionLeft = 250;
                } else {
                    positionTop = positionTop - 60;
                    positionLeft = positionLeft + 120;
                }
                positionFood.push({
                    top: positionTop,
                    left: positionLeft,
                    source: foodImgSource[randomNumber]
                })
            }
        }

        if (dataQuestion[questNum].bonus === BONUS_FOOD_FLAG) {
            opacityFoodAnimated = useRef(new Animated.Value(DEFAULT_FOOD_OPACITY)).current;
            positionFood[indexFood].opacity = opacityFoodAnimated;
        }

        switch (questNum) {
            case 7:
                positionFood[0].opacity = 0;
                break;
            case 11:
                positionFood[1].opacity = 0;
                break;
            case 14:
                positionFood[2].opacity = 0;
                break;
            case 18:
                positionFood[3].opacity = 0;
                break;
            case 22:
                positionFood[4].opacity = 0;
                break;
            case 28:
                positionFood[5].opacity = 0;
                break;
        }

        return (
            <View>
                {positionFood.map((result,index,value) => {
                    return(
                        <Animated.Image source={result.source} style={[styles.food, {top: result.top, left: result.left, opacity: result.opacity}]} />
                    );
                })}
            </View>
        );
    }

    const Character = () => {
        let characterImg = require('../../Assets/game/character_male_hello.png');
        if (userInfo.sex == MALE_FLAG) {
            switch (characterStatus) {
                case 1:
                    characterImg = require('../../Assets/game/character_male_hello.png');
                    break;
                case 2:
                    characterImg = require('../../Assets/game/character_male_moving.gif');
                    break;
                case 3:
                    characterImg = require('../../Assets/game/character_male_end.png');
                    break;
            }
        } else {
            switch (characterStatus) {
                case 1:
                    characterImg = require('../../Assets/game/character_female_hello.png');
                    break;
                case 2:
                    characterImg = require('../../Assets/game/character_female_moving.gif');
                    break;
                case 3:
                    characterImg = require('../../Assets/game/character_female_end.png');
                    break;
            }
        }
        return(
            <Animated.Image
                source={characterImg}
                style={[styles.character, {top:charaterTopAnimated,left: charaterLeftAnimated}]}
            />
        );
    }

    return (
        <View style={styles.background}>
            <View style={{ height: WINDOW_WIDTH * 0.7}}>
                <Animated.View style={[styles.backgroundGame, {bottom: backgroundBottomAnimated, right: backgroundRightAnimated}]}>
                    <Image source={require('../../Assets/game/background_game.png')} style={[styles.backgroundGame]} />
                    <Rock />
                    <Food />
                </Animated.View>
                <View style={{top: Platform.OS == 'ios' ? -650 : -710,flexDirection: 'row',justifyContent: 'space-between'}}>
                    <View style={styles.clockCountDown}>
                        <Image source={require('../../Assets/game/hourglass.gif')} style={styles.hourGlass} />
                        <TimeCountDown />
                    </View>
                    <View style={styles.pointGame}>
                        <Image source={require('../../Assets/game/star.gif')} style={styles.pointStar} />
                        <Text style={styles.pointText}>{score < 10 ? '0' + score : score }</Text>
                    </View>
                </View>
                <Character />
                {flagFirework ? (
                    <Animated.Image source={require('../../Assets/game/firework.gif')} style={[styles.firework, {top: tempCharaterTopAnimated - 70,left: tempCharaterLeftAnimated}]} />
                ) : (
                    <View></View>
                )}
            </View>
            <View style={[styles.backgroundQuest, {height: WINDOW_HEIGHT - (WINDOW_WIDTH * 0.9)}]}>
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
    food: {
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
    headerRank: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%'
    },
    headerRankText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    itemRank: {
        borderRadius: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 15,
        height: 70
    },
    medalTop: {
        height: 51,
        width: 39,
        marginLeft: 10
    },
    medalNormal: {
        height: 45,
        width: 36,
        marginLeft: 10
    },
    itemPoint: {
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3333ff'
    },
    starPoint: {
        height: 35,
        width: 35,
        marginLeft: 10
    },
    bodyRank: {
        alignItems: 'center',
        height: '80%'
    },
    noPlayerRankImg: {
        height: 200,
        width: 200
    },
    footerRank: {
        justifyContent: 'center'
        ,height: '10%'
    },
    closeButton: {
        justifyContent: 'center',
        height: '60%',
        width: '50%',
        backgroundColor: '#ff0000',
        alignSelf: 'center',
        borderRadius: 5
    },
    closeButtonText: {
        alignSelf: 'center',
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
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
    itemStart: {
        borderRadius: 15,
        flexDirection: 'row',
        marginBottom: 15,
        height: 60
    },
    medalStart: {
        height: 51,
        width: 39,
        marginLeft: 10
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
    noPlayerImg: {
        height: 170,
        width: 170
    },
    noPlayerText: {
        fontSize: 20,
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
    rankResultButton: {
        backgroundColor: '#00ffbf',
        height: 40,
        justifyContent: 'center',
        width: '60%',
        borderRadius: 10
    },
    rankResultText: {
        alignSelf: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16
    },
    footerResult: {
        flexDirection: 'row',
        justifyContent:'space-around',
        height: '20%'
    },
    playAgainButton: {
        backgroundColor: '#66b3ff',
        height: 40,
        justifyContent: 'center',
        width: '40%',
        borderRadius: 10
    },
    playAgainText: {
        alignSelf: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16
    },
    quitGameButton: {
        backgroundColor: '#ff0000',
        height: 40,
        justifyContent: 'center',
        width: '40%',
        borderRadius: 10
    },
    quitGameText: {
        alignSelf: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16
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

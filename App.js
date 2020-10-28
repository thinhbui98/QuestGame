import React from 'react';
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
    useWindowDimensions
} from 'react-native';

const App = () => {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    return (
        <View style={styles.background}>
            <StatusBar hidden={true} />
            <View style={styles.backgroundGame}>
                <ImageBackground source={require('./assets/image/demo.png')} style={styles.demoGame}>
                    <View style={{width:60,height:60,borderRadius:15,backgroundColor:'yellow',marginTop:15, marginLeft:15,justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize: 18,fontWeight:'bold'}}>Time</Text>
                        <Text style={{fontSize: 20}}>120</Text>
                    </View>
                    <View style={{width:60,height:60,borderRadius:15,backgroundColor:'white',marginTop:15, marginLeft:15,justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize: 18,fontWeight:'bold'}}>Score</Text>
                        <Text style={{fontSize: 20}}>10</Text>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.backgroundQuest}>
                <ImageBackground source={require('./assets/image/hexagon.png')} style={styles.quest}>
                    <Text style={{fontSize: 20,color:'white'}}>今何時ですか？</Text>
                </ImageBackground>
                <View style={styles.answer}>
                    <TouchableOpacity style={styles.answerButton}>
                        <Text>A.Dap an la </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.answerButton}>
                        <Text>B.Dap an la </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.answerButton}>
                        <Text>C.Dap an la </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.answerButton}>
                        <Text>D.Dap an la </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity style={styles.quitButton}>
                        <Text style={styles.titleFooterButton}>Thoat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rankButton}>
                        <Text  style={styles.titleFooterButton}>Xep Hang</Text>
                    </TouchableOpacity>
                </View>
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
    footerButton: {
        flexDirection: 'row',
        justifyContent:'space-between',
        height:'10%',
        marginLeft: 10,
        marginRight: 10,
        bottom : 20
    },
    quitButton: {
        backgroundColor: 'red',
        width: '45%',
        borderRadius: 15,
        justifyContent:'center',
        alignItems: 'center'
    },
    rankButton: {
        backgroundColor: 'white',
        width: '45%',
        borderRadius: 15,
        justifyContent:'center',
        alignItems: 'center'
    },
    titleFooterButton: {
    }
});

export default App;

import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet, TextInput, SafeAreaView, FlatList, Button, AccessibilityInfo } from "react-native"

async function chat(userId, chatId, lastMessageId, crsf) {
    const answer = {};
    let data = new FormData();
    data.append('crsf', crsf); 
    data.append('userId', userId);
    data.append('chatId', chatId); 
    data.append('lastMessageId', lastMessageId); 
    
    await axios({
        method: "post",
        url: "http://94.124.78.231:81/lastMessages",
        data: data
    }).then(({ data }) => {
        answer.data = data.data
        answer.status = data.response
    }).catch(error => {
        answer.status = error.response.data.data.response
        answer.errorMessage = `Ошибка: ${error.response.data.data}` || "Ошибка получения чата!"
    });
    return answer;
}

async function send(userId, chatId, messageText, name, crsf) {
    const answer = {};
    let data = new FormData();
    data.append('crsf', crsf); 
    data.append('userId', userId);
    data.append('chatId', chatId); 
    data.append('Name', name); 
    data.append('messageText', messageText); 
    
    await axios({
        method: "post",
        url: "http://94.124.78.231:81/sendMessage",
        data: data
    }).then(({ data }) => {
        answer.data = data.data
        answer.status = data.response
    }).catch(error => {
        answer.status = error.response.data.data.response
        answer.errorMessage = `Ошибка: ${error.response.data.data}` || "Ошибка отправки!"
    });
    return answer;
}

const MyMessage = ({ data }) => (
    <View style={styles.blockMyMessage}>
        <Text style={styles.textMessage}>{data.messageText}</Text>
        <Text style={styles.time}>{moment(data.date).format("LT")}</Text>
    </View>
);

const ParticipantMessage = ({ data }) => (
    <View style={styles.blockParticipantMessage}>
        <Text style={styles.textMessage}>{data.messageText}</Text>
        <Text style={styles.time}>{moment(data.date).format("LT")}</Text>
    </View>
);

export const ScreenChatWithUser = ({ route, navigation }) => {
    const [dataChat, setDataChat] = useState([]);
    const [message, setMessage] = useState();
    const { chatId, lastMessageId, name, userId, crsf } = route.params;
        
    useEffect(() => {
        navigation.setOptions({ title: name });
        const getChat = async () => {
            const getChats = await chat(userId, chatId, lastMessageId, crsf);
            setDataChat(getChats.data.reverse());
        }
        getChat();
    });

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                inverted={true}
                refreshing={true}    
                data={dataChat}
                keyExtractor={item => item.messageId}
                renderItem={({ item }) => {
                    if (item.userId == userId) 
                        return (<MyMessage data={item} />)
                    else
                        return (<ParticipantMessage data={item} />)
                }}
            />
            <View style={styles.blockImput}>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    onChangeText={setMessage}
                    placeholderTextColor="#FFFFFF"
                    placeholder={"Text message"}
                />
                <Button
                    title="Send"
                    style={styles.buttonSend}
                    onPress={() => send(userId, chatId, message, name, crsf)}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#35399A",
    },
    blockMyMessage: {
        maxWidth: "75%",
        alignSelf: "flex-end",
        textAlign: "left",
        marginRight: 5,
        marginVertical: 2,
        borderRadius: 12,
        paddingLeft: 5,
        paddingRight: 5,
        paddingVertical: 9,
        backgroundColor: "#4E54EB",
    },
    blockParticipantMessage: {
        maxWidth: "75%",
        alignSelf: "flex-start",
        marginLeft: 5,
        marginVertical: 2,
        borderRadius: 12,
        paddingLeft: 5,
        paddingRight: 5,
        paddingVertical: 9,
        backgroundColor: "#0F147B",
    },
    blockImput: {
        height: 42,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#45499B",
    },
    textMessage: {
        marginRight: 40,
        color: "#FFFFFF",
        fontSize: 12,
    },
    time: {
        marginTop: 4,
        marginRight: 1,
        color: "#D3D3D3",
        textAlign: "right",
        fontSize: 10,
    },
    input: {
        height: 25,
        width: "75%",
        color: "#FFFFFF",
        borderRadius: 10,
        backgroundColor: "#242649",
    },
    buttonSend: {

    }
});
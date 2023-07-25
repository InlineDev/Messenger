import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity } from "react-native"

async function chats(userId, crsf) {
    const answer = {};
    let data = new FormData();
    data.append('crsf', crsf); 
    data.append('userId', userId); 
    
    await axios({
        method: "post",
        url: "http://94.124.78.231:81/getChats",
        data: data
    }).then(({ data }) => {
        answer.data = data.data
        answer.status = data.response
    }).catch(error => {
        answer.status = error.response.data.data.response
        answer.errorMessage = `Ошибка: ${error.response.data.data}` || "Ошибка входа!"
    });
    return answer;
}

const messageText = (text) => {
    if (text.length >= 35) {
        return text.substring(0, 35) + "...";
    }
    return text;
}

const ChatBlock = ({ data }) => (
    <View style={styles.chatBlock}>
        <Image style={styles.imege} source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}/>
        <View style={styles.contentBlock}>
            <Text style={styles.userName}>{data.lastMessage.Name}</Text>
            <Text style={styles.message}>{messageText(data.lastMessage.messageText)}</Text>
            <Text style={styles.time}>{moment(data.lastMessage.date).format("LT")}</Text>
        </View>
    </View>
);


export const ScreenChats = ({ route, navigation }) => {
    const { userId, crsf } = route.params;
    const [chatsData, setChatsData] = useState([]);

    useEffect(() => {
        const getChats = async () => {
            const getChats = await chats(userId, crsf);
            setChatsData(getChats.data);
        }
        getChats();
    });
    
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={chatsData}
                keyExtractor={item => item.chatId}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("ChatWithUser", { userId, crsf, chatId: item.chatId, lastMessageId: 1, name: item.lastMessage.Name })}>
                        <ChatBlock data={item} />
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#35399A",
    },
    chatBlock: {
        flexDirection: "row",
        borderBottomWidth: 2,
        borderColor: "rgba(159, 159, 159, 0.26)",
        backgroundColor: "#3439B8",
    },
    imege: {
        height: 69,
        width: 69,
        margin: 4,
        borderRadius: 100,
    },
    contentBlock: {
        flex: 1,
        justifyContent: "space-around"
    },
    userName: {
        height: 15,
        fontSize: 16,
        color: "#FFFFFF",
        marginLeft: 4,
        marginVertical: 15
    },
    message: {
        height: 17,
        fontSize: 14,
        marginLeft: 4,
        lineHeight: 17,
        color: "#C7C4C4",
    },
    time: {
        height: 16,
        marginRight: 1,
        color: "#FFFFFF",
        textAlign: "right",
    },
});
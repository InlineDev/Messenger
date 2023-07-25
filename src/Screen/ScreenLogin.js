import axios from "axios";
import FormData from "form-data";
import React, { useState } from "react";
import { TextInput, View, StyleSheet, Alert, Text, Pressable } from "react-native";

async function login(mainKey) {
    const answer = {};
    let data = new FormData();
    data.append('mainKey', `${mainKey}`); 

    await axios({
        method: "post",
        url: "http://94.124.78.231:81/login",
        data: data
    }).then(({ data }) => {
        answer.crsf = data.data.crsf
        answer.status = data.response
        answer.userId = data.data.userId
    }).catch(error => {
        answer.status = error.response.data.data.response
        answer.errorMessage = `Ошибка: ${error.response.data.data}` || "Ошибка входа!"
    });
    return answer;
}

export const ScreenLogin = ({ navigation }) => {
    const [mainKey, setMainKey] = useState();

    return (
        <View style={styles.container}>
            <Text style={styles.nameMessenger}>Nekto</Text>

            <TextInput
                style={styles.input}
                onChangeText={setMainKey}
                placeholderTextColor="#A9A9A9"
                placeholder="Enter your main key"
            />

            <View style={styles.fixToText}>
                <Pressable
                    style={styles.button}
                    onPress={async () => {
                    if (!mainKey) return;
                    const getLogin = await login(mainKey);
                    if (getLogin.status === "ok")
                        navigation.navigate("Chats", { userId: getLogin.userId, crsf: getLogin.crsf });
                    else
                        Alert.alert("Login", getLogin.errorMessage);
                }}
                >
                    <Text style={styles.textButton}>Login</Text>
                </Pressable>
                
                <Pressable
                    style={styles.button}
                    onPress={async () => navigation.navigate("Registration")}
                >
                    <Text style={styles.textButton}>Registration</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: "#35399A",
    },
    nameMessenger: {
        marginTop: 115,
        height: 58,
        width: 137,
        position: "absolute",
        fontSize: 48,
        color: "#FFFFFF",
    },
    input: {
        marginTop: 260,
        height: 58,
        width: 323,
        position: "absolute",
        color: "#FFFFFF",
        borderRadius: 12,
        backgroundColor: "#151853",
    },
    fixToText: {
        marginTop: 315, 
        justifyContent: "center",
    },
    button: {
        height: 34,
        width: 183,
        borderRadius: 12,
        marginTop: 20,
        backgroundColor: "#151853",
        alignItems: 'center',
    },
    textButton: {
        marginTop: 9,
        color: "#FFFFFF",
    },
});

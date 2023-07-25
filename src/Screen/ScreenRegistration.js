import axios from "axios"
import sha256 from 'sha256';
import FormData from "form-data";
import { generate } from "randomstring";
import React, { useState } from "react";
import { TextInput, View, StyleSheet, Alert, Text, Clipboard, Pressable } from "react-native"

async function register(name) {
    const answer = {};
    let data = new FormData();

    const mainKey = generate();
    const publicKey = sha256(mainKey);

    data.append('publicKey', publicKey); 
    data.append('Name', name); 

    await axios({
        method: "post",
        url: "http://94.124.78.231:81/register",
        data: data
    }).then(({ data }) => {
        answer.mainKey = mainKey
        answer.status = data.response
        answer.userId = data.data.userId
    }).catch(error => {
        answer.status = error.response.data.data.response
        answer.errorMessage = `Ошибка: ${error.response.data.data}` || "Ошибка регистрации!"
    });
    return answer;
}

export const ScreenRegistration = ({ navigation }) => {
    const [nameUser, setNameUser] = useState();

    return (
        <View style={styles.container}>
            <Text style={styles.nameMessenger}>Nekto</Text>

            <TextInput
                style={styles.input}
                onChangeText={setNameUser}
                placeholderTextColor="#A9A9A9"
                placeholder="Enter your name"
            />

            <View style={styles.fixToText}>
                <Pressable
                    style={styles.button}
                    onPress={async () => navigation.navigate("Login")}
                >
                    <Text style={styles.textButton}>Login</Text>
                </Pressable>

                <Pressable
                    style={styles.button}
                    onPress={async () => {
                        if (!nameUser) return;
                        const getRegister = await register(nameUser);
                        if (getRegister.status === "ok") {
                            Clipboard.setString(getRegister.mainKey);
                            navigation.navigate("Login");
                        } else return Alert.alert("Registration", getRegister.errorMessage);
                    }}
                >
                    <Text style={styles.textButton}>Registration</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        alignItems: 'center',
        backgroundColor: "#35399A",
    },
    nameMessenger: {
        top: 115,
        height: 58,
        width: 137,
        position: "absolute",
        fontSize: 48,
        color: "#FFFFFF",
    },
    input: {
        top: 261,
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

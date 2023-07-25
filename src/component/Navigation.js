import React from "react";
import { Button } from 'react-native';
import { ScreenLogin } from "../Screen/ScreenLogin.js";
import { ScreenChats } from "../Screen/ScreenChat.js";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenRegistration } from "../Screen/ScreenRegistration.js";
import { ScreenChatWithUser } from "../Screen/ScreenChatWithUser.js";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerBackVisible: false,
                    headerTintColor: "#FFFFFF",
                    headerStyle: {
                        backgroundColor: '#45499B'
                    },
                    headerRight: () => <Button title="Menu" onPress={() => alert("Menu")} />,
                }}
            >
                
                <Stack.Screen name="Login" component={ScreenLogin} options={{ title: "Login" }} />
                <Stack.Screen name="Registration" component={ScreenRegistration} options={{ title: "Registration" }} />
                <Stack.Screen name="Chats" component={ScreenChats} options={{ title: "Nekto" }} />
                <Stack.Screen name="ChatWithUser" component={ScreenChatWithUser} options={{ title: "Nekto" }} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}
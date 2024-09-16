import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Chat from '../screens/Chat';
import Message from '../screens/Message';
import useAuth from '../hooks/useAuth';
import Modal from '../screens/Modal';
import Match from '../screens/Match';

function LoginScreen() {
    return <Login />
}
function HomeScreen() {
    return <Home />
}
function ChatScreen() {
    return <Chat />
}
function MessageScreen() {
    return <Message />
}
function ModalScreen() {
    return <Modal />
}
function MatchScreen() {
    return <Match />
}

const Stack = createNativeStackNavigator();

function StackNavigator() {
    const { user } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {
                user
                    ?
                    (
                        <>
                            <Stack.Group>
                                <Stack.Screen name="Home" component={HomeScreen} />
                                <Stack.Screen name="Chat" component={ChatScreen} />
                                <Stack.Screen name="Message" component={MessageScreen} />
                            </Stack.Group>
                            <Stack.Group screenOptions={{ presentation: "modal", ...TransitionPresets.ModalTransition }}>
                                <Stack.Screen name="Modal" component={ModalScreen} />
                            </Stack.Group>
                            <Stack.Group screenOptions={{ presentation: "transparentModal", ...TransitionPresets.ModalTransition }}>
                                <Stack.Screen name="Match" component={MatchScreen} />
                            </Stack.Group>
                        </>
                    )
                    :
                    (
                        <Stack.Screen name="Login" component={LoginScreen} />
                    )
            }
        </Stack.Navigator>
    );
}

export default StackNavigator;
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import Header from '../../components/Header';
import ChatList from '../../components/ChatList';

function Chat(props) {
    return (
        <SafeAreaView>
            <Header title="Chat"/>
            <ChatList />
        </SafeAreaView>
    );
}

export default Chat;
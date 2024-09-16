import React, { useEffect, useState } from 'react';
import { Button, Text, FlatList, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Header from '../../components/Header';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';
import { useRoute } from '@react-navigation/native';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db, timestamp } from '../../firebase';
import useAuth from '../../hooks/useAuth';
import SenderMessage from '../../components/SenderMessage';
import ReceiveMessage from '../../components/ReceiveMessage';

function Message() {
    const route = useRoute();
    const { user } = useAuth();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const matchDetails = route.params?.matchDetails;

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(db, "matches", matchDetails?.id, "messages"),
                orderBy("timestamp", "desc")
            ),
            (snapShot) => {
                const messagesData = snapShot.docs.map((doc) => ({
                    id: doc?.id,
                    ...doc.data()
                }));
                setMessages(messagesData);
            }
        );

        return unsubscribe;
    }, [matchDetails]);

    const sendMessage = async () => {
        try {
            await addDoc(collection(db, "matches", matchDetails?.id, "messages"), {
                timestamp: timestamp,
                userId: user?.uid,
                displayName: user?.displayName,
                photoURL: user?.photoURL, // Ensure this is available
                message: input
            });
            setInput(""); // Clear the input after sending
        } catch (error) {
            console.error("Error adding message: ", error);
        }
    };

    return (
        <SafeAreaView style={tw.style("pt-5 flex-1")}>
            <Header
                title={getMatchedUserInfo(matchDetails, user)?.displayName}
                callEnabled
            />
            <FlatList
                data={messages.reverse()}
                style={tw.style("pl-4")}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    return item?.userId === user?.uid
                        ? <SenderMessage key={item?.userId} message={item?.message} />
                        : <ReceiveMessage key={item?.userId} message={item?.message} photoURL={item?.photoURL} />
                }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw.style("mb-5")}
                keyboardVerticalOffset={10}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style={tw.style("flex-row justify-between mr-7 ml-7 pl-2 items-center bg-white border-t border-gray-200")}>
                        <TextInput
                            style={tw.style("h-10 text-lg")}
                            placeholder='Send message...'
                            onChangeText={setInput}
                            value={input}
                            onSubmitEditing={sendMessage}
                        />
                        <Button style={tw.style("ml-3")} title="Send" onPress={sendMessage} color="#FF5864" />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {/* <Header
                title={getMatchedUserInfo(matchDetails?.users, user?.uid)}
                callEnabled
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw.style("flex-1")}
                keyboardVerticalOffset={10}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        data={messages}
                        style={tw.style("pl-4")}
                        keyExtractor={(item,index) => index.toString()}
                        inverted={-1}
                        renderItem={({ item }) =>
                            item.userId === user.uid
                                ? <SenderMessage key={item.userId} message={item} />
                                : <ReceiveMessage key={item.userId} message={item} />
                        }
                    />
                </TouchableWithoutFeedback>

                <View style={tw.style("flex-row justify-between items-center bg-white border-t border-gray-200")}>
                    <TextInput
                        style={tw.style("h-10 text-lg")}
                        placeholder='Send message...'
                        onChangeText={setInput}
                        value={input}
                        onSubmitEditing={sendMessage}
                    />
                    <Button title="Send" onPress={sendMessage} color="#FF5864" />
                </View>
            </KeyboardAvoidingView> */}
        </SafeAreaView>
    );
}

export default Message;

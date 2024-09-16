import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from 'tailwind-react-native-classnames';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    if (user && matchDetails) {
      setMatchedUserInfo(getMatchedUserInfo(matchDetails?.users, user?.uid));
    }
  }, [matchDetails, user]);

  useEffect(() => {
    if (user && matchDetails) {
      const messagesRef = collection(db, "users", user?.uid, "swipes", matchDetails?.id, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
      
      const unsubscribe = onSnapshot(q, (snapShot) => {
        const latestMessage = snapShot.docs[0]?.data()?.message;
        setLastMessage(latestMessage || "Say Hi");
      });

      return unsubscribe;
    }
  }, [user, matchDetails]);

  return (
    <TouchableOpacity
      style={tw.style("flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg shadow-lg")}
      onPress={() => navigation.navigate("Message", { matchDetails })}
    >
      <Image
        style={tw.style("rounded-full h-16 w-16 mr-4")}
        source={{ uri: matchDetails?.photoURL }}
      />
      <View>
        <Text style={tw.style("text-lg font-semibold")}>
          {matchDetails?.displayName}
        </Text>
        <Text>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;
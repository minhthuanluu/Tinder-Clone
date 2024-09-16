import React from 'react';
import { Image, View,Text } from 'react-native';

function ReceiveMessage({ photoURL,message }) {
    return (
        <View style={tw.style("bg-red-400 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2", {
            alignSeft: "flex-start"
        })}>
            <Image style={tw.style("h-12 w-12 rounded-full absolute top-0 -left-14")}
                source={{
                    uri:photoURL
                }}
            />
            <Text style={tw.style("text-white mt-1")}>{message}</Text>
        </View>
    );
}

export default ReceiveMessage;
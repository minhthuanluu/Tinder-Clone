import React from 'react';
import { View , Text} from 'react-native';
import tw from 'tailwind-react-native-classnames';

function SenderMessage({message}) {
    
    return (
        <View style={tw.style("bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2")}>
            <Text style={tw.style("text-white")}>{message}</Text>
        </View>
    );
}

export default SenderMessage;
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

function Header(props) {
    const {goBack} = useNavigation();
    return (
       <View style={tw.style("p-2 flex-row items-center justify-between")}>
            <View style={tw.style("flex flex-row items-center")}>
                <TouchableOpacity onPress={()=>goBack()} style={{padding:15}}>
                    <Image source={require("../assets/left-arrow.png")} style={{resizeMode:"contain", width:20,height:20,tintColor:"#FF5864"}}/>
                </TouchableOpacity>
                <Text style={tw.style("text-2xl font-bold pl-2")}>{props.title}</Text>
            </View>
            {
                props.callEnabled && (
                    <TouchableOpacity style={tw.style("rounded-full mr-4 p-3 bg-red-200")}>
                        <Image source={require("../assets/telephone-call.png")} style={{resizeMode:"contain", width:20,height:20,tintColor:"#FF5864"}} />
                    </TouchableOpacity>
                )
            }
       </View>
    );
}

export default Header;
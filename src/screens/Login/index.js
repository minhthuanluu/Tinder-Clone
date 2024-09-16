import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import tw from "tailwind-react-native-classnames";
import { auth } from '../../firebase';

function Login(props) {
    const [type, setType] = useState(1);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        setName("");
        setEmail("");
        setPassword("");
    }, [type]);

    const signIn = () => {
        if (!email.trim() || !password.trim()) {
            return Alert.alert("Ohh!!", "You have not entered all the details");
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then(({ user }) => {
                    console.log(user);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    };

    const signUp = async(email,name,password) => {
        if (!email.trim() || !name.trim() || !password.trim()) {
            return Alert.alert("Ohh!!", "You have not entered all the details");
        } else {
            console.log({email,name,password});
            await createUserWithEmailAndPassword(auth, email, password).then(({ user }) => {
                updateProfile(user, { displayName: name });
                console.log(user);
            })
                .catch((err) => {
                    console.log(JSON.stringify(err));
                })
        }
    };

    if(loading){
        return(
            <View style={tw.style("flex-1 justify-center items-center")}>
                <Text style={tw.style("font-semibold text-red-400 text-2xxl")}>Loading...</Text>
            </View>
        )
    }

    return (
        <ImageBackground
            style={tw.style("flex-1")}
            resizeMode="cover"
            source={require("../../assets/bg.png")}>
            <StatusBar backgroundColor={"transparent"} translucent/>
            {
                type === 1 ? (
                    <View style={tw.style("flex-1 justify-center items-center")}>
                        <Text style={tw.style("font-bold text-2xl")}>Sign in</Text>
                        <Text style={tw.style("text-white")}>Access to your account</Text>

                        <View style={tw.style("w-full p-5")}>
                            <Text style={tw.style("font-semibold pb-2 text-white")}>Email</Text>
                            <TextInput
                                keyboardType="email-address"
                                style={tw.style("bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg w-full p-2.5 mb-4")}
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />

                            <Text style={tw.style("font-semibold pb-2 text-white")}>Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                style={tw.style("bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg w-full p-2.5 mb-4")}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                            <TouchableOpacity onPress={() => signIn()} style={tw.style("w-full rounded-lg mt-8 bg-black py-3")}>
                                <Text style={tw.style("text-center text-white font-bold")}>Sign in</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setType(2)}>
                                <Text style={tw.style("text-center text-gray-100 pt-3")} onPress={() => setType(2)}>
                                    Doesn't have an account?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={tw.style("flex-1 justify-center items-center")}>
                        <Text style={tw.style("font-bold text-2xl")}>Sign up</Text>
                        <Text style={tw.style("text-white")}>Create a new account</Text>
                        <View style={tw.style("w-full p-5")}>
                            <Text style={tw.style("font-semibold pb-2 text-white")}>Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={(value)=>setName(value)}
                                style={tw.style("bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg w-full p-2.5 mb-4")}
                            />

                            <Text style={tw.style("font-semibold pb-2 text-white")}>Email</Text>
                            <TextInput
                                keyboardType="email-address"
                                value={email}
                                onChangeText={(value)=>setEmail(value)}
                                style={tw.style("bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg w-full p-2.5 mb-4")}
                            />

                            <Text style={tw.style("font-semibold pb-2 text-white")}>Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                value={password}
                                onChangeText={(value)=>setPassword(value)}
                                style={tw.style("bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg w-full p-2.5 mb-4")}
                            />
                            <TouchableOpacity onPress={() => signUp(email,name,password)} style={tw.style("w-full rounded-lg mt-8 bg-black py-3")}>
                                <Text style={tw.style("text-center text-white font-bold")}>Sign Up</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setType(1)}>
                                <Text style={tw.style("text-center text-gray-100 pt-3")}>
                                    Already have an account?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </ImageBackground>
    );
}

export default Login;
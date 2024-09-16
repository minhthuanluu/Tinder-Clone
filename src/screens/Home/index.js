import {
  Alert,
    Button,
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import tw from "tailwind-react-native-classnames";
  import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
  import Swiper from "react-native-deck-swiper";
  import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    where,
  } from "firebase/firestore";
import useAuth from "../../hooks/useAuth";
import { db, timestamp } from "../../firebase";
import generateId from "../../lib/generateId";
  
  const DUMMY_DATA = [
    {
      displayName: "Anton Jeejo",
      job: "Software Engineer",
      photoURL:
        "https://pbs.twimg.com/profile_images/1540318789061197825/RiJ0V1sR_400x400.jpg",
      age: 23,
      id: 1,
    },
    {
      displayName: "Mark Zuckerberg",
      job: "Programmer",
      photoURL:
        "https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg",
      age: 39,
      id: 2,
    },
    {
      displayName: "Justin Mateen",
      job: "Software Developer",
      photoURL:
        "https://i.insider.com/606730e3856cd700198a2dd1?width=1136&format=jpeg",
      age: 37,
      id: 3,
    },
  ];
  
  const HomeScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);
  
    useLayoutEffect(() => {
      getDoc(doc(db, "users", user.uid)).then((snapShot) => {
        if (!snapShot.exists()) {
          navigation.navigate("Modal");
        }
      });
    }, []);
  
    useEffect(() => {
      let unsub;
  
      const fetchCards = async () => {
        //comes after doing passes in swipeleft
  
        const passes = await getDocs(
          collection(db, "users", user.uid, "passes")
        ).then((snapShot) => snapShot.docs.map((doc) => doc.id));
  
        console.log(passes);
  
        const swipes = await getDocs(
          collection(db, "users", user.uid, "swipes")
        ).then((snapShot) => snapShot.docs.map((doc) => doc.id));
  
        const passedUserIds = passes.length > 0 ? passes : ["temp"];
        const swipedUserIds = swipes.length > 0 ? swipes : ["temp"];
  
        unsub = onSnapshot(
          query(
            collection(db, "users"),
            where("id", "not-in", [...passedUserIds, ...swipedUserIds])
          ),
          (snapShot) => {
            setProfiles(
              snapShot.docs
                .filter((doc) => doc?.id !== user.uid)
                .map((doc) => ({
                  id: doc?.id,
                  ...doc.data(),
                }))
            );
          }
        );
      };
  
      fetchCards();
  
      return unsub;
    }, []);
  
    const swipeLeft = (cardIndex) => {
      if (!profiles[cardIndex]) {
        return;
      }
  
      const userSwiped = profiles[cardIndex];
      setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
    };
  
    const swipeRight = async (cardIndex) => {
      try {
          if (!profiles[cardIndex]) {
              return;
          }
  
          const userSwiped = profiles[cardIndex];
  
          // Fetch the logged-in user's profile
          const userDoc = await getDoc(doc(db, "users", user.uid));
  
          if (!userDoc.exists()) {
              console.log("Logged-in user's document does not exist.");
              return;
          }
  
          const loggedInProfile = userDoc.data();
          console.log("loggedInProfile:", loggedInProfile);
  
          // Ensure profiles are valid
          if (!loggedInProfile || !userSwiped || !userSwiped.id) {
              console.error("Invalid profile data:", {
                  loggedInProfile,
                  userSwiped
              });
              return;
          }
  
          // Check if userSwiped has already swiped right
          const docSnap = await getDoc(doc(db, "users", userSwiped?.id, "swipes", user.uid));
          if (docSnap.exists()) {
              await setDoc(doc(db, "users", user.uid, "swipes", userSwiped?.id), userSwiped);
              await setDoc(doc(db, "matches", generateId(user.uid, userSwiped?.id)), {
                  users: {
                      [user.uid]: loggedInProfile,
                      [userSwiped?.id]: userSwiped
                  },
                  usersMatched: [user.uid, userSwiped?.id],
                  timestamp
              });
  
              navigation.navigate("Match", {
                  loggedInProfile,
                  userSwiped
              });
          } else {
              await setDoc(doc(db, "users", user.uid, "swipes", userSwiped?.id), userSwiped);
              console.log("Swipe recorded without match.");
          }
      } catch (error) {
          console.error("Error handling swipe right:", error);
      }
  };

  const logoutModal=()=>{
    // logout
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            // Perform the logout action here
            logout();
          },
          style: "destructive"
        }
      ]
    );
  }
  
  
    return (
      <SafeAreaView style={tw.style("flex-1 mt-6")}>
        <StatusBar backgroundColor={"transparent"} translucent barStyle="dark-content"/>
        <View style={tw.style("flex-row items-center justify-between px-5")}>
          <TouchableOpacity onPress={logoutModal}>
            <Image
              style={tw.style("h-7 w-7 ml-3 rounded-full")}
              source={require("../../assets/logout.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
            <Image
              style={tw.style("h-14 w-14")}
              source={require("../../assets/logo.png")}
            />
            <Text style={tw.style("text-sm font-bold")}>{user.displayName}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
            <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
          </TouchableOpacity>
        </View>
  
        <View style={tw.style("flex-1 -mt-6")}>
          <Swiper
            ref={swipeRef}
            containerStyle={{
              backgroundColor: "transparent",
            }}
            cards={profiles}
            stackSize={5}
            cardIndex={0}
            animateCardOpacity
            verticalSwipe={false}
            onSwipedLeft={(cardIndex) => {
              console.log("Swipe Pass");
              swipeLeft(cardIndex);
            }}
            onSwipedRight={(cardIndex) => {
              console.log("Swipe Match");
              swipeRight(cardIndex);
            }}
            backgroundColor="#4FD0E9"
            overlayLabels={{
              left: {
                title: "NOPE",
                style: {
                  label: {
                    textAlign: "right",
                    color: "red",
                  },
                },
              },
              right: {
                title: "MATCH",
                style: {
                  label: {
                    color: "#4DED30",
                  },
                },
              },
            }}
            renderCard={(card) => {
              return card ? (
                <View
                  key={card?.id}
                  style={tw.style("bg-white h-3/4 rounded-xl relative")}
                >
                  <Image
                    style={[tw.style("absolute top-0 h-full w-full rounded-xl"),{resizeMode:"contain"}]}
                    source={{ uri: card.photoURL }}
                  />
  
                  <View
                    style={tw.style(
                      "absolute bottom-0 bg-white w-full h-20 justify-between items-center flex-row px-6 py-2 rounded-b-xl shadow-xl"
                    )}
                  >
                    <View>
                      <Text style={tw.style("text-xl font-bold")}>
                        {card.displayName}
                      </Text>
                      <Text>{card.job}</Text>
                    </View>
                    <Text style={tw.style("text-2xl font-bold")}>{card.age}</Text>
                  </View>
                </View>
              ) : (
                <View
                  style={tw.style(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center shadow-xl"
                  )}
                >
                  <Text style={tw.style("font-bold pb-5")}>No more profiles</Text>
                  <Image
                    style={tw.style("h-20 w-20")}
                    height={100}
                    width={100}
                    source={{
                      uri: "https://cdn.shopify.com/s/files/1/1061/1924/products/Crying_Face_Emoji_large.png?v=1571606037",
                    }}
                  />
                </View>
              );
            }}
          />
        </View>
  
        <View style={tw.style("flex flex-row justify-evenly mb-5")}>
          <TouchableOpacity
            onPress={() => swipeRef.current.swipeLeft()}
            style={tw.style(
              "items-center justify-center rounded-full w-16 h-16 bg-red-200"
            )}
          >
            <Entypo name="cross" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => swipeRef.current.swipeRight()}
            style={tw.style(
              "items-center justify-center rounded-full w-16 h-16 bg-green-200"
            )}
          >
            <Entypo name="heart" size={24} color="green" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };
  
  export default HomeScreen;
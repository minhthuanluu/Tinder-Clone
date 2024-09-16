const getMatchedUserInfo = (users, userLoggedIn) => {
    try {
        const newUsers = { ...users };
        delete newUsers[userLoggedIn];
        console.log('func: ',newUsers);
        const id = newUsers; // Get the first entry from the object

        return { id, ...newUsers }; // Ensure it returns valid data
    } catch (error) {
        console.log("Error in getMatchedUserInfo:", error);
        return {}; // Return a fallback object
    }
};

export default getMatchedUserInfo;
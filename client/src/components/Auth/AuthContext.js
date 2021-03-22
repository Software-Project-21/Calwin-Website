import React, { useContext, useState,useEffect} from 'react';
import { auth} from "../../firbase";
import firebase from "../../firbase";

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}){
    const [currentUser,setCurrentUser] = useState();
    const [loading,setLoading] = useState(true);

    async function googleLogin(){

        const provider = new firebase.auth.GoogleAuthProvider();
        // firebase.auth.useDeviceLanguage();
        await auth.signInWithPopup(provider).then(
        async (result) => {
            //3 - pick the result and store the token
            const token = await auth?.currentUser?.getIdToken(true);                               
            //4 - check if have token in the current user
            if (token) {
            //5 - put the token at localStorage (We'll use this to make requests)
            localStorage.setItem("@token", token);
            //6 - navigate user to the book list
            // history.push("/calendar");
            }
            var user = result.user;
            console.log(user);
        },
        function (err) {
            console.log(err);
        }
        );
    }

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe;
    },[])

    function  logOut() {
        return firebase.auth().signOut();
    }
    const value = {
        currentUser,
        googleLogin,
        logOut
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
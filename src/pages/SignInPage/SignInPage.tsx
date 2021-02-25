import React, {useState} from 'react';
import firebase from "firebase/app";

import './SignInPage.scss'
import loader from '../../assets/loader.gif'
import {getTweets} from "../../functions/getTweets";
import {FirebaseConfigInterface} from "../../interfaces/FirebaseConfigInterface";
import {firebase_config} from "../../firebase_config";

interface Props {
    setUserSignedIn: React.Dispatch<React.SetStateAction<boolean>>
    setTweets: React.Dispatch<React.SetStateAction<Response[]>>
    tweets: Response[]
    setUserId: React.Dispatch<React.SetStateAction<string | null>>
    setUserEmail:  React.Dispatch<React.SetStateAction<string | null>>
}

require("firebase/auth");
require("firebase/firestore");

export interface Response {
    id: string,
    text: string
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseConfigInterface = firebase_config
// Initialize Firebase (only once)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}
// firebase.analytics();


export const SignInPage: React.FC<Props> = ({setUserSignedIn, setTweets, tweets, setUserId, setUserEmail}) => {


        const updateTweets = async () => {
            try {
                const receivedTweets = await getTweets() //getTweets() func send request to Flask REST API and receives an Array ob objects
                await setTweets(receivedTweets)
                console.log(tweets.length)


            } catch (err) {
                console.log(err)
            }

        }

        // update tweets only once, if the array is empty
        if (!tweets.length) {
            updateTweets();
        }

        const [loading, setLoading] = useState<boolean>(true) // Sets spinning loader on the screen
        const [errorMessage, setErrorMessage] = useState('') // Error message which would be displayed under the form informing the User what he/she did wrong

        const [emailInputValue, setEmailInputValue] = useState<string>('') // Form Email Input
        const [passwordInputValue, setPasswordInputValue] = useState<string>('') // Form Password Input


        // Check if User is already signed in
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                setUserId(user.uid)
                setUserEmail(user.email)
                setUserSignedIn(true)
            } else {
                setLoading(false)
            }
        });

        // const user = firebase.auth().currentUser;
        // if (user) {
        //
        //     // User is signed in.
        //     console.log('currentUser', user)
        // } else {
        //     // No user is signed in.
        //     console.log('No user is logged in')
        // }


        const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            // const newValue = event.target.value
            setEmailInputValue(event.target.value)
        }

        const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            // const newValue = event.target.value
            setPasswordInputValue(event.target.value)
        }

        const handleRegister = (email: string, password: string) => {
            setLoading(true)
            setErrorMessage('')
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {

                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        // .then(console.log)
                        .then((userCredential: any) => {
                            const user = userCredential.user;
                            console.log('User: ', user)
                        })
                        .catch((error: any) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log('ERROR', errorCode, '|||', errorMessage)
                            switch (errorCode) {
                                case 'auth/invalid-email':
                                    setErrorMessage('Typed email is invalid. Try another one')
                                    break;
                                case 'auth/weak-password':
                                    setErrorMessage('This password is too weak. Try at least 6 characters')
                                    break;
                                case 'auth/email-already-in-use':
                                    setErrorMessage('Email is already in use. Choose another one')
                                    break;
                                default:
                                    setErrorMessage('')
                                    break;

                            }
                        })
                        .finally(() => {
                                setLoading(false)
                            }
                        )
                })
        }

        const handleSignin = (email: string, password: string) => {
            setLoading(true)    // Put loader  onto the screen
            setErrorMessage('') // Empty by default. Also clears previous Error Message
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    firebase.auth().signInWithEmailAndPassword(email, password) // Sign in user
                        .then((userCredential) => {
                            // Signed in
                            const user = userCredential.user;
                            console.log('USER', user)
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorCode, '|||', errorMessage)
                            // Validation of entered data (happens in Firebase)
                            switch (errorCode) {
                                case 'auth/invalid-email':
                                    setErrorMessage('Typed email is invalid. Try another one')
                                    break;
                                case 'auth/wrong-password':
                                    setErrorMessage('Wrong password')
                                    break;
                                case 'auth/user-not-found':
                                    setErrorMessage('No such user exist')
                                    break;
                                default:
                                    setErrorMessage('')
                                    break;

                            }
                        })
                        .finally(() => {
                                setLoading(false)
                            }
                        )
                })
        }

        return (
            <div className={'signin-page'}>
                <h1>Please sign in to view this page</h1>
                <div className={'signin-form'}>
                    {loading
                        ? <img src={loader} alt="loader"/>
                        : <>
                            <label htmlFor='email-input-id'>Email:</label>
                            <input name={'email'} value={emailInputValue} onChange={handleEmailChange} id={'email-input-id'}
                                   type="email" autoFocus/>
                            <label htmlFor='password-input-id'>Password:</label>
                            <input name={'password'} value={passwordInputValue} onChange={handlePasswordChange}
                                   id={'password-input-id'} type="password"/>
                            <button onClick={() => handleSignin(emailInputValue, passwordInputValue)}>Sign In</button>
                            <button onClick={() => handleRegister(emailInputValue, passwordInputValue)}>Register</button>
                        </>
                    }

                    <h2 className={'error-message'}>{errorMessage}</h2>

                </div>
            </div>
        );
    }
;

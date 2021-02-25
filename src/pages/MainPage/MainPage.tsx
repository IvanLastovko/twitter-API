import React from 'react';
import firebase from "firebase/app";

// @ts-ignore
import {TwitterTweetEmbed} from 'react-twitter-embed'
import './MainPage.scss';
import {Response} from "../SignInPage/SignInPage";
import {CommentSection} from "../../components/CommentSection/CommentSection";


interface Props {
    setUserSignedIn: React.Dispatch<React.SetStateAction<boolean>>
    tweets: Response[]
    setUserId: React.Dispatch<React.SetStateAction<string | null>>
    userId: string | null
    userEmail: string | null
    setUserEmail:  React.Dispatch<React.SetStateAction<string | null>>
}

export const MainPage: React.FC<Props> = ({setUserSignedIn, tweets, setUserId, userId, userEmail, setUserEmail}) => {

    console.log('TWEETS: ', tweets)

    const handleClick = () => {
        firebase.auth().signOut()
            .then(() => console.log('logged out'))
            .catch(error => {
                console.log(error)
            })
        setUserId(null)
        setUserEmail(null)
        setUserSignedIn(false)
    }
    return (

        <div className={'main-page'}>
            <header>
                <h1>Main Page</h1>
                <button onClick={handleClick}>Sign Out</button>
            </header>

            {
                tweets.length > 0 && tweets.map((tweet, index) => {

                    return <section className={'tweet'}>
                        <TwitterTweetEmbed
                            tweetId={`${tweet.id}`}
                            key={`${tweet.id}`}
                        />
                        <CommentSection tweetId={tweet.id} key={`${tweet.id} + 'button`} userId={userId} userEmail={userEmail}/>
                    </section>
                })
            }
        </div>
    )
};

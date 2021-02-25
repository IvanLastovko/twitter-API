import React, {useState} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'

import './App.scss';
import {Response, SignInPage} from "./pages/SignInPage/SignInPage";
import {MainPage} from "./pages/MainPage/MainPage";

function App() {

    const [userSignedIn, setUserSignedIn] = useState(false)

    const [tweets, setTweets] = useState<Response[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    // useEffect(() => {
    //     console.log('userEmail: ', userEmail)
    // }, [userEmail])


    return (
        <div className={'application-container'}>
            <Switch>
                <Route exact path='/'>
                    {userSignedIn ? <MainPage tweets={tweets} setUserSignedIn={setUserSignedIn} setUserId={setUserId} userId={userId} setUserEmail={setUserEmail} userEmail={userEmail}/> : <Redirect to={'/signin'}/>}
                </Route>

                <Route exact path='/signin'>
                    {userSignedIn ? <Redirect to={'/'}/> : <SignInPage tweets={tweets} setTweets={setTweets} setUserSignedIn={setUserSignedIn} setUserId={setUserId} setUserEmail={setUserEmail}/>}
                </Route>

                <Route exact path='/:any'>
                    <Redirect to={'/'}/>
                </Route>
            </Switch>
        </div>
    )
// return (
// <div className="App">
    // <TextField text={'Hello'} handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //             console.log(event.target.value)
    //         }}/>
    //         <Counter>
    //             {(count, setCount) => (
    //                 <div>{count}
    //                     <button
    //                         onClick={() => setCount((prev) => {
    //                         const newCount: number = prev + 1
    //                         console.log('newCount', newCount)
    //                         return newCount
    //                     })}>+
    //                     </button>
    //                 </div>
    //
    //             )}
    //         </Counter>
    //     </div>
    // );
}

export default App;

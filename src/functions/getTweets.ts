import {Response} from "../pages/SignInPage/SignInPage";

let response: Array<Response> = []
export const getTweets = async () => {

    await fetch('http://localhost:5000/getTweets')
        .then((data) => data.json())
        .then(jsonData => {
            response = jsonData
        })
    return response
}

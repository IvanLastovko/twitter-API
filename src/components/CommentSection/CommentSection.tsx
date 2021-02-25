import React, {useEffect, useState} from 'react';

import './CommentSection.scss'
import commentPNG from '../../assets/comment.svg'
import sendIcon from '../../assets/send-icon.svg'
import {PostRequestOptions} from "../../interfaces/PostRequestOptions";
import loader from '../../assets/loader.gif'

// ML Model Imports:
require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const threshold: number = 0.9;


interface Props {
    tweetId: string
    userId: string | null
    userEmail: string | null
}

interface Comments {
    comment: string,
    tweetId: string
    userId: string | null
    time: number
}

export const CommentSection: React.FC<Props> = ({tweetId, userId, userEmail}) => {


    const [commentSectionOpened, setCommentSectionOpened] = useState(false)
    const [typedComment, setTypedComment] = useState('')
    const [dateInMS, setDateInMS] = useState(Date.now())
    const [fetchedComments, setFetchedComments] = useState<Comments[]>([])
    const [checkingForToxicity, setCheckingForToxicity] = useState<boolean>(false)
    const [predictions, setPredictions] = useState<any[]>([])

    const [isCommentToxic, setIsCommentToxic] = useState<null | string>(null)

    const SEND_COMMENTS_POST_REQUEST_OPTIONS: PostRequestOptions = {
        method: 'POST',
        body: JSON.stringify({
            comment: typedComment,
            tweetId: tweetId,
            userId: userId,
            time: dateInMS
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const REQUIRE_COMMENTS_POST_REQUEST_OPTIONS: PostRequestOptions = {
        method: 'POST',
        body: JSON.stringify({
            tweetId: tweetId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const checkToxicity = async (comment: string) => {
        await toxicity.load(threshold)
            .then((model: any) => {
                model.classify(comment)
                    .then((predictions: any) => {
                        setCheckingForToxicity(false)
                        setPredictions(predictions)
                    })
            })
    }
    useEffect(() => {
        console.log('predictions: ', predictions)
        if (predictions.length) {


            const asyncFunc = async () => {
                try {
                    console.log(predictions)
                    let toxicity: boolean = false
                    for (let predict of predictions) {
                        if (predict.results[0].match) {
                            setIsCommentToxic(predict.label)
                            toxicity = true
                            console.log('isCommentToxic: ', isCommentToxic)
                        }
                    }

                    if(!toxicity){
                        await setDateInMS(Date.now())
                        const response = await fetch('http://localhost:5000/addComment', SEND_COMMENTS_POST_REQUEST_OPTIONS).then(res => res.json())
                        console.log('RESPONSE after sending comment: ', response)
                        setFetchedComments(prev => {
                            console.log('prev: ', prev)
                            prev.push({
                                comment: typedComment,
                                tweetId: tweetId,
                                userId: userId,
                                time: dateInMS
                            })
                            return prev
                        })
                    }


                } catch (err) {
                    console.log(err)
                } finally {
                    setTypedComment('')
                }
            }
            asyncFunc()


        }
    }, [predictions])

    useEffect(() => {
        if (commentSectionOpened) {
            (async () => {
                try {
                    fetch('http://localhost:5000/getComments', REQUIRE_COMMENTS_POST_REQUEST_OPTIONS)
                        .then(data => data.json())
                        .then(comments => comments && setFetchedComments(comments.comments))
                        .catch(err => {
                            console.log(err)
                        })
                } catch (err) {
                    console.log(err)
                }
            })()
        }
    }, [commentSectionOpened])

    useEffect(() => {
        console.log('Comments: ', fetchedComments.length, fetchedComments)
    }, [fetchedComments])

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTypedComment(event.target.value)
    }

    const handleSendComment = async () => {
        if (typedComment) {
            try {
                setCheckingForToxicity(true)
                await checkToxicity(typedComment)
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log('Comment is empty. Cannot send')
        }
    }

    const handleOpenCommentsClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setCommentSectionOpened(prev => !prev)
    }

    return (
        <section className={'comment-section'}>
            {
                commentSectionOpened && <div>
                    <div className="comments">
                        {
                            fetchedComments.length
                                ? fetchedComments.map(comment => {
                                    return <div className="single-comment">
                                        <div className="username-comment">{`${userEmail?.split('@')[0]}`}</div>
                                        <div key={`${comment['comment']}`}>{`${comment['comment']}`}</div>
                                        <hr/>
                                    </div>
                                })
                                : <div className="empty-comments">Be the first one to leave a comment</div>
                        }
                    </div>
                    {
                        checkingForToxicity
                            ? <div style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <img className={'commentLoader'} src={loader} alt="loader"/>
                                <p>ML is Analyzing Your Comment...</p>
                            </div>
                            : <div className="add-comment">
                                 <textarea placeholder={'Write comment...'} className={'add-comment-textarea'}
                                           name={"add-comment-textarea"} onChange={handleCommentChange}
                                           value={typedComment} autoFocus
                                           cols={30} rows={1}/>
                                <button className="send-comment-button" onClick={handleSendComment}>
                                    <img className={'send-comment-img'} alt={'send-comment-button'} src={sendIcon}/>
                                </button>
                                {isCommentToxic && <p className={'toxicity-warning'}>Your comment falls into category
                                    "{`${isCommentToxic.toUpperCase()}`}"</p>}
                            </div>
                    }
                </div>
            }
            <div onClick={handleOpenCommentsClick} className={'open-comments-button'}>
                <img className={'comment'} alt={'comment'} src={commentPNG}/>
                {commentSectionOpened ? ' Close' : ' Open'}
            </div>
        </section>
    )
}

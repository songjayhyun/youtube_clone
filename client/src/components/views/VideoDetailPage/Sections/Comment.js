import React, {useEffect, useState} from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment';

function Comment(props) {



    const videoId = props.postId

    const user = useSelector(state => state.user) // get user data info from Redux
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (e) => {
        setcommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: props.postId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setcommentValue("")
                   props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })
    }


    return (
        <div>
            <br />
            <p> Replies </p>
            <br />
            <hr />

            {/* Comment Lists */}

            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo && 
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={props.videoId} commentLists={props.commentLists}/>
                    </React.Fragment>
                )
            ))}
            

            {/* Root Comment Form */}

            <form style={{ display : 'flex' }} onSubmit={onSubmit} >
                <textarea
                    style= {{ width: '100%', borderRadius: '5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder='코멘트를 작성해주세요'                
                />
                < br />
                <button style={{ width : '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>

        </div>
    )
}

export default Comment

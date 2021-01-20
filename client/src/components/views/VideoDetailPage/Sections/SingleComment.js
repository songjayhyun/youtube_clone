import React, { useState } from 'react'
import { Comment, Avatar, Button, Input} from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';


const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user) // get user data info from Redux
    const videoId = props.postId

    const [OpenRelpy, setOpenRelpy] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onClickRelpyOpen = (e) => {
        setOpenRelpy(!OpenRelpy)

    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    props.refreshFunction(response.data.result)
                   
                } else {
                    alert('Failed to save Comment')
                }
            })
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
        <span onClick={onClickRelpyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author = {props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={ <p> {props.comment.content} </p>}
            />
            {OpenRelpy && 
            
            <form style={{ display : 'flex' }} onSubmit={onSubmit} >
            <textarea
                style= {{ width: '100%', borderRadius: '5px'}}
                onChange={onHandleChange}
                value={CommentValue}
                placeholder='코멘트를 작성해주세요'                
            />
            < br />
            <button style={{ width : '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
            
            }
        </div>
    )
}

export default SingleComment

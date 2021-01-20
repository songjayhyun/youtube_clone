import React, {useEffect, useState} from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';



function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikes, setDisLikes] = useState(0)
    const [DisLikesAction, setDisLikesAction] = useState(null)

    let variable = {}

    
    if(props.video) {
        variable = { videoId:props.videoId , userId:props.videoId }
    } else {
        variable = { commentId: props.commentId , userId: props.userId }
    }
   
    useEffect(() => {
        
        Axios.post('/api/like/getLikes', variable )
        .then(response => {
            if(response.data.success) {

                // How many likes did you get
                setLikes(response.data.likes.length)

                // Did I push the like button
                response.data.likes.map(like => {
                    if(like.userId === props.userId) {    // props.userId = Me get from localstorage
                        setLikeAction('liked')
                    }
                })

            } else {
                alert('Failed to get Likes')
            }
        })
            Axios.post('/api/like/getDislikes', variable )
            .then(response => {
                if(response.data.success) {
    
                    // How many dislikes did you get
                    setDisLikes(response.data.dislikes.length)
    
                    // Did I push the dislike button
                    response.data.dislikes.map(dislikes => {
                        if(dislikes.userId === props.userId) {    // props.userId = Me get from localstorage
                            setDisLikesAction('disliked')
                        }
                    })
    
                } else {
                    alert('Failed to get dislikes')
                }
        })
    }, [])

    const onLike =() => {

        if(LikeAction === null) {   // Like이 클릭이 되지 않았을 때

            Axios.post('/api/like/upLike', variable)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes + 1)
                    setLikeAction('liked')
                    
                    if(DisLikesAction !== null ) {
                        setDisLikesAction(null)
                        setDisLikes(DisLikes -1)
                    }
                } else {
                    alert('Failed to like')
                }
            })
        } else { //   Like이 클릭이 된 상태

            Axios.post('/api/like/unLike', variable)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes - 1)
                    setLikeAction(null)
                } else {
                    alert('Failed to unlike')
                }
            })
        }
    }

    const onDislike = () => {
        
        if(DisLikesAction !== null) {  

            Axios.post('/api/like/unDislike', variable)
            .then(response => {
                if(response.data.success) {
                    setDisLikes(DisLikes - 1)
                    setDisLikesAction(null)
                } else {
                    alert('Failed to unDislike')
                }
            })
        } else {
            Axios.post('/api/like/upDislike', variable)
            .then(response => {
                if(response.data.success) {
                    setDisLikes(DisLikes + 1)
                    setDisLikesAction('disliked')
                    
                    if(LikeAction !== null ) {
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    }
                } else {
                    alert('Failed to like')
                }
            })
        }
    }



    return (
        <div>
            <span key="comment-basic-like"> 
                <Tooltip title="Like">
                    <Icon type ="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
            <span style = {{ paddingLeft: '8px', cursor:'auto'}}> {Likes}</span>
            </span> &nbsp;&nbsp;

            <span key="comment-basic-dilike">
                <Tooltip title="Dislike">
                    <Icon type ="dislike"
                        theme={DisLikesAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip> 
            <span style = {{ paddingLeft: '8px', cursor:'auto'}}> {DisLikes}</span>
            </span>&nbsp;&nbsp;

        </div>
    )
}

export default LikeDislikes

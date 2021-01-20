import React, { useEffect, useState } from 'react'
import Axios from 'axios';

function Subscribe(props) {

    const userTo = props.userTo
    const userFrom = props.userFrom

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    const onSubscribe = ( ) => {

        let subscribeVariables = {
                userTo : userTo,
                userFrom : userFrom
        }

        if(Subscribed) {
            //when we are already subscribed 
            Axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success){ 
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to unsubscribe')
                    }
                })

        } else {
            // when we are not subscribed yet
            
            Axios.post('/api/subscribe/subscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to subscribe')
                    }
                })
        }

    }



    useEffect(() => {
        
        let variable = { userTo: props.userTo }
        Axios.post('/api/subscribe/subscribeNumber', variable)
        .then(response => {
            if(response.data.success) {
                setSubscribeNumber(response.data.subscribeNumber)
            } else {
                alert('Failed to bring subscribers')
            }
        })

        let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

        Axios.post('/api/subscribe/subscribed',subscribedVariable )
        .then(response => {
            if(response.data.success) {
                setSubscribed(response.data.subscribed)
            } else {
                alert('Failed to bring information')
            }
        })

    }, [])



    return (
        <div>
            <button
            onClick = {onSubscribe}
            style={{ backgroundColor: `${Subscribed ?  '#AAAAAA':'#CC0000'}` , borderRadius: '4px', color : 'white', padding : '10px 16px',
                     fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'}}>
                        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe

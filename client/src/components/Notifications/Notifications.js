import React,{useEffect, useState} from 'react';
import SearchBar from '../Home/SearchBar';
import Sidebar from '../Sidebar/Sidebar';
import { useAuth } from '../Auth/AuthContext';
import { Redirect } from 'react-router';
import firebase from '../../firbase';
import "./notfications.css";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const _ = require('lodash');

const db = firebase.firestore();

function Notifications() {
    const {currentUser} = useAuth();
    const [invites,setInvites] = useState([]);
    const [invDetails,setInvDetails] = useState([]);

    useEffect(() => {
        db.collection('users').doc(currentUser.uid).onSnapshot((doc) => {
            if(doc.exists){
                setInvites(doc.data().invitations);
            }
        })
    },[currentUser])

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    useEffect(()=> {
        if(invites){
            // var data = [];
            invites.forEach((el) => {
                db.collection('events').doc(el.eventId).get().then((doc) => {
                    if(doc.exists){
                        const data = {
                            ...doc.data(),
                            admin: el.admin,
                            id: el.eventId,
                            primary: false
                        }

                        // invDetails.map(el => {
                        //     console.log(JSON.stringify(el));
                        //     return "";
                        //     // return JSON.stringify(el)!==JSON.stringify(data)
                        // });
                        // console.log(newDet);
                        // setInvDetails(...newDet,data);
                        console.log(JSON.stringify(data));
                        if(!invDetails.some(el => _.isEqual(el,data))){
                           setInvDetails((prev) =>[
                               ...prev,
                               data
                           ]);
                        }
                        // data.push({
                        //     ...doc.data(),
                        //     admin: el.admin
                        // });
                    }
                })
            })
            // setInvDetails(data);
        }
    },[invites])

    const handleCancel =  (invite) => {
        setInvDetails(invDetails.filter(el => !_.isEqual(el,invite)));
        // console.log(invites);
        setInvites(invites.filter(el => el.eventId!==invite.id));
        // console.log(invites);
         db.collection('users').doc(currentUser.uid).set({
            invitations: invites.filter(el => el.eventId!==invite.id)
        },{merge:true})
    }

    const handleAccept = (event) => {
        setInvites(invites.filter(el => el.eventId!==event.id));
        setInvDetails(invDetails.filter(el => !_.isEqual(el,event)));
        var eve = event;
        delete eve.admin;
        delete eve.sharedWith;

        db.collection('users').doc(currentUser.uid).update(
            {events: firebase.firestore.FieldValue.arrayUnion(eve)}
        )

        db.collection('events').doc(event.id).update(
            {acceptedUsers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)}
        )

        db.collection('users').doc(currentUser.uid).set({
            invitations: invites.filter(el => el.eventId!==event.id)
        },{merge:true})
    }

    console.log(invDetails);
    console.log(invites);

    return (
        <>
        {   currentUser ? (
                <div style={{display: "flex"}}>
                    <Sidebar />
                    <div style={{width: "100%"}}>
                        <SearchBar/>
                        <div className="container">
                            <div style={{textAlign: "center", fontWeight: "700",fontSize: "1.5rem"}}>Notifications</div>
                            <div className="invites-list">
                            {console.log(invDetails)}
                                {invDetails && invDetails.map((invite) => (
                                    <div className="card">
                                       <div>
                                        <span style={{fontWeight:"700",marginRight:"5px"}}>{invite.admin} </span> invited you to <span style={{fontWeight:"700",marginLeft:"5px"}}>{invite.title}</span>
                                       </div>
                                       <div>
                                        <div className="date">
                                            <div style={{fontWeight:"700",fontSize:"1.1rem"}}>
                                                {invite.eventDay.toDate().getDate()}
                                            </div>
                                            <div style={{paddingTop:"3px"}}>    
                                                {invite.eventDay.toDate().toLocaleString('default',{month: 'short'})}
                                            </div>
                                            <div style={{paddingTop:"3px"}}>
                                                {invite.eventDay.toDate().toLocaleString('default',{weekday: 'short'})}
                                            </div>
                                        </div>
                                        <div style={{display: "flex",justifyContent:"space-between",flexDirection: "row"}}>
                                            <div>{`${formatAMPM(invite.startTime.toDate())} - ${formatAMPM(invite.endTime.toDate())}`}</div>
                                            <div>
                                                <CheckCircleIcon style={{color:"green"}} onClick={() => handleAccept(invite)} />
                                                <CancelIcon style={{marginLeft:"5px",color:"red"}} onClick={() => handleCancel(invite)}/>
                                            </div>
                                        </div>
                                       </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : <Redirect path="/login"/>
        }
        </>
    );
}

export default Notifications;
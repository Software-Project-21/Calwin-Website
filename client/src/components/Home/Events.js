import React, { useContext, useEffect, useState } from 'react';
import {HolidaysContext} from "./HolidayContext";
import "../Events/Events.css";
import moment from "moment";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SearchBar from './SearchBar';
import Sidebar from '../Sidebar/Sidebar';
import "./events.css";
import firebase from "../../firbase";
import { useAuth } from '../Auth/AuthContext';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditEvent from '../Events/EditEvent';

const db = firebase.firestore();

function Events() {
    // console.log(HolidaysContext);
    const {holidays} = useContext(HolidaysContext);
    const [publicEve,setPublicEve] = useState(true);
    const {currentUser} = useAuth();
    const [events,setEvents] = useState([]);
    const [eventId,setEventId] = useState("");
    const [edit,setEdit] = useState(false);
    // console.log(holidays);
    
    const [expand,setExpand] = useState([]);

    useEffect(() => {
        if(holidays.length>0){
            const ini = holidays.map(obj => (
                obj.open
            ));
            setExpand(ini);
        }
    },[holidays])

    function handleExpand(index){
        const newArr = [...expand];
        newArr[index] = !newArr[index];
        setExpand(newArr);
    }

    function showPublic(e) {
        setPublicEve(true);
        e.target.classList.add("selectedList");
        document.getElementById("own").classList.remove("selectedList");
    }

    function showOwn(e) {
        setPublicEve(false);
        e.target.classList.add("selectedList");
        document.getElementById("public").classList.remove("selectedList");
    }

    function handleEdit(event) {
        setEdit(true);
        setEventId(event.id);
    }

    function handleDelete(event) {

        db.collection("users").doc(currentUser.uid).update({
            events: events.filter(eve => eve.id!==event.id)
        })
        setEvents(events.filter(eve => eve.id!==event.id));
    }

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

    useEffect(() => {
        db.collection("users").doc(currentUser.uid).onSnapshot((doc) => {
            if(doc.exists){
                // console.log(doc.data());
                setEvents(doc.data().events);
            }
        });
    },[currentUser])

    return (
        <>
        
        <div style={{display:"flex"}}>
            <Sidebar
                // show={false}
            />
            <div style={{width:"100%"}} >
                <SearchBar/>
                <div style={{display: "block"}}>
                    <div id="public" className="public selectedList" onClick={showPublic} style={{fontSize:"20px",padding:"3px",display:"inline-block",width:"50%",textAlign:"center"}}>
                        Public Holidays
                    </div>
                    <div id="own" className="own" onClick={showOwn} style={{fontSize:"20px",padding:"3px",display:"inline-block",width:"50%",textAlign:"center"}}>
                        Your Events
                    </div>
                </div>
                {publicEve ? 
                    (<div className="event-list">
                    {holidays.map((holiday,index) => (
                        <div style={{padding:"1%",display:"flex",border:"#dadce0 1px solid"}}>
                            <div style={{display:"flex",flexBasis:"10%"}}>
                                <div style={{flexBasis:"25%",fontWeight:"700",fontSize:"1.1rem"}}>
                                    {holiday.date.datetime.day}
                                </div>
                                <div style={{flexBasis:"30%",paddingTop:"3px"}}>
                                {moment(holiday.date.iso).format('MMMM').substr(0,3)}
                                </div>
                                <div style={{paddingTop:"3px"}}>
                                {moment(holiday.date.iso).format('dddd').substr(0,3)}
                                </div>
                            </div>
                            <div onClick={() => handleExpand(index)} className="content" style={{display:"flex",flexGrow:"3",fontWeight:"600",flexDirection:"column"}}>
                                <div style={{display:"flex"}}>
                                    <div style={{flexBasis:"15%",display:"flex"}}>
                                        <div style={{height:"10px",width:"10px",borderRadius:"100%",backgroundColor:"green",margin:"5px 5px 0 0"}}>
                                        </div>
                                        <div>All Day</div>
                                    </div>
                                    <div>
                                        {holiday.name}
                                    </div>
                                </div>
                                { expand[index] ? (
                                    <div>
                                        <div style={{padding:"20px",paddingLeft:"0"}}>
                                            <div>{holiday.description}</div>
                                        </div>
                                    </div>
                                    ):<div></div>
                                }
                            </div>
                        </div>
                    ))}
                </div>) : (
                    <div className="event-list">
                        {events.length!==0 ? (events.map((event,index) => (
                            <div style={{padding:"1%",display:"flex",border:"#dadce0 1px solid"}}>
                                <div style={{display:"flex",flexBasis:"10%",paddingTop:"3px"}}>
                                    <div style={{flexBasis:"25%",fontWeight:"700",fontSize:"1.1rem"}}>
                                        {event.eventDay.toDate().getDate()}
                                    </div>
                                    <div style={{flexBasis:"30%",paddingTop:"3px"}}>
                                        {event.eventDay.toDate().toLocaleString('default',{month: 'short'})}
                                    </div>
                                    <div style={{paddingTop:"3px"}}>
                                    {event.eventDay.toDate().toLocaleString('default',{weekday: 'short'})}
                                    </div>
                                </div>
                                <div className="content" style={{fontWeight:"600",width:"100%"}}>
                                    <div>
                                        <div style={{display:"inline-block",width:"20%"}}>
                                            <div style={{height:"10px",width:"10px",borderRadius:"100%",backgroundColor:"rgb(3, 155, 229)",margin:"5px 5px 0 0",display:"inline-block"}}>
                                            </div>
                                            {/* <div style={{display:"inline-block"}}>{`${event.startTime.toDate().toLocaleTimeString().split(" ")[0].substr(0,5)} ${event.startTime.toDate().toLocaleTimeString().split(" ")[1]}-${event.endTime.toDate().toLocaleTimeString().split(" ")[0].substr(0,5)} ${event.endTime.toDate().toLocaleTimeString().split(" ")[1]}`}</div> */}
                                            <div style={{display:"inline-block"}}>{`${formatAMPM(event.startTime.toDate())} - ${formatAMPM(event.endTime.toDate())}`}</div>
                                        </div>
                                        <div style={{display:"inline-block",width:"70%"}}>
                                            {event.title}
                                        </div>
                                        <div style={{display:"inline-block",width:"10%",textAlign:"right"}}>
                                            <EditIcon fontSize="small" onClick={() => handleEdit(event)} style={{cursor:"pointer"}}/>
                                            <DeleteIcon fontSize="small" onClick={() => handleDelete(event)} style={{marginLeft: "10px",cursor:"pointer"}}/>
                                            <ExpandMoreIcon fontSize="small" onClick={() => handleExpand(index)} style={{marginLeft:"10px",marginRight:"10px",cursor:"pointer"}}/>
                                        </div>
                                    </div>
                                    { expand[index] ? (
                                        <div>
                                            <div style={{padding:"20px",paddingLeft:"0"}}>
                                                <div>{event.description==="" ? "No Description Provided" : event.description}</div>
                                            </div>
                                        </div>
                                        ):<div></div>
                                    }
                                </div>
                            </div>
                        ))) : 
                        <div>No Events to show</div>
                        }
                    </div>
                )
                }
            </div>
        </div>
        {edit ? <EditEvent events={events} setEvents={setEvents} setEdit={setEdit} edit={edit} eventId={eventId} setEventId={setEventId} scroll='paper'/> : ""}
        </>
    );
}

export default Events;
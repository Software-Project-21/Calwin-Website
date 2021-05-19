import React, { useEffect, useState } from 'react';
import firebase from "../../firbase";
import { useAuth } from '../Auth/AuthContext';
import {HolidaysContext} from "../Home/HolidayContext";
import Sidebar from "../Sidebar/Sidebar";
import SearchBar from "../Home/SearchBar";
import { Redirect } from 'react-router';
import moment from "moment";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import EditEvent from '../Events/EditEvent';

const db = firebase.firestore();

function SearchPage(props) {
    // console.log(window.location.search.substring(1).substring(2));
    var val = window.location.search.substring(1).substring(2);
    val = val.replaceAll("%20"," ");
    console.log(val);
    const [events,setEvents] = React.useState([]);
    // const [holidays,setHolidays] = React.useState([]);
    const {currentUser} = useAuth();
    const {holidays} = React.useContext(HolidaysContext);
    const [res,setRes] = useState([]);
    const [eve,setEve] = useState([]);
    const [expand,setExpand] = useState([]);
    const [eventId,setEventId] = useState("");
    const [edit,setEdit] = useState(false);

    useEffect(() => {
        db.collection("users").doc(currentUser.uid).onSnapshot((doc) => {
            if(doc.exists){
                setEvents(doc.data().events);
            }
        });
    },[currentUser]);

    useEffect(() => {
        if(res.length>0){
            const ini = holidays.map(obj => (
                obj.open
            ));
            setExpand(ini);
        }
    },[res,holidays])

    useEffect(() => {
        if(events){
            var searchEvents = events.filter((ev) => {
                if(ev.title.toLowerCase().includes(val.toLowerCase())===true){
                    return true;
                } else if(ev.description.toLowerCase().includes(val.toLowerCase())===true){
                    return true;
                }
                return false;
            });
            searchEvents.sort(function(a,b) {
                var key1 = a.startTime.toDate();
                var key2 = b.startTime.toDate();
                if(key1<key2) return -1;
                if(key1>key2) return 1;
                return 0;
            });
            setEve(searchEvents);
            // console.log();
        }
        if(holidays){
            var searchHolidays = holidays.filter((holiday) => holiday.name.toLowerCase().includes(val.toLowerCase()));
            setRes(searchHolidays);
        }
        var s = "this is an example";

    },[val,holidays,events])

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

    function handleExpand(index){
        const newArr = [...expand];
        newArr[index] = !newArr[index];
        setExpand(newArr);
    }

    function handleEdit(event) {
        if(event.primary){
            setEdit(true);
            setEventId(event.id);
        } else {
            alert("Cannot edit shared event");
        }
    }

    function handleDelete(event) {

        // console.log(event.id);   

        db.collection("users").doc(currentUser.uid).update({
            events: events.filter(eve => eve.id!==event.id)
        })

        db.collection("events").doc(event.id).delete().then(() => {
            console.log("Document Successfully Deleted");
        }).catch((err) => {
            console.error("Error Removing Document: " + err);
        })
        setEvents(events.filter(eve => eve.id!==event.id));
    }

    return (
         <>
            {currentUser ? 
                <div style={{display:"flex"}}>
                    <Sidebar
                        visible={false}
                        val={props.val}
                        setVal={props.setVal}
                    />
                    <div style={{width:"100%"}} >
                        <SearchBar/>
                        <div>
                            <div className="event-list" style={{paddingLeft:"2%", paddingRight:"2%"}}>
                                {res.map((holiday,index) => (
                                    <div className="card">
                                        <div className="date" >
                                            <div style={{fontWeight:"700",fontSize:"1.1rem"}}>
                                                {holiday.date.datetime.day}
                                            </div>
                                            <div style={{paddingTop:"3px"}}>
                                            {moment(holiday.date.iso).format('MMMM').substr(0,3)}
                                            </div>
                                            <div style={{paddingTop:"3px"}}>
                                            {moment(holiday.date.iso).format('dddd').substr(0,3)}
                                            </div>
                                        </div>
                                        <div onClick={() => handleExpand(index)} className="content" style={{display:"flex",flexGrow:"3",fontWeight:"600",flexDirection:"column"}}>
                                            <div style={{display:"flex"}}>
                                                <div style={{display:"flex",marginRight:"30px"}}>
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
                                {(typeof eve!=="undefined" && eve.length !== 0) ? (eve.map((event,index) => (
                            <div className="card">
                                <div className="date">
                                    <div style={{fontWeight:"700",fontSize:"1.1rem"}}>
                                        {event.eventDay.toDate().getDate()}
                                    </div>
                                    <div style={{paddingTop:"3px"}}>    
                                        {event.eventDay.toDate().toLocaleString('default',{month: 'short'})}
                                    </div>
                                    <div style={{paddingTop:"3px"}}>
                                    {event.eventDay.toDate().toLocaleString('default',{weekday: 'short'})}
                                    </div>
                                </div>
                                <div className="content" >
                                    <div className="main-details">
                                        <div style={{marginRight:"30px",display:"flex"}}>
                                            <div style={{height:"10px",width:"10px",borderRadius:"100%",backgroundColor:"rgb(3, 155, 229)",margin:"5px 5px 0 0",display:"inline-block"}}>
                                            </div>
                                            {/* <div style={{display:"inline-block"}}>{`${event.startTime.toDate().toLocaleTimeString().split(" ")[0].substr(0,5)} - ${event.endTime.toDate().toLocaleTimeString().split(" ")[0].substr(0,5)} `}</div> */}
                                            <div>{`${formatAMPM(event.startTime.toDate())} - ${formatAMPM(event.endTime.toDate())}`}</div>
                                        </div>
                                        <div>
                                            {event.title}
                                        </div>
                                    </div>
                                    { expand[index] ? (
                                        <div>
                                            <div style={{padding:"20px",paddingLeft:"0"}}>
                                                <div>{event.description==="" ? "No Description Provided" : event.description}</div>
                                            </div>
                                        </div>
                                        ): ""
                                    }
                                    <div style={{textAlign:"right"}}>
                                            <EditIcon fontSize="small" onClick={() => handleEdit(event)} style={{cursor:"pointer"}}/>
                                            <DeleteIcon fontSize="small" onClick={() => handleDelete(event)} style={{marginLeft: "10px",cursor:"pointer"}}/>
                                            {!expand[index] ? <ExpandMoreIcon fontSize="small" onClick={() => handleExpand(index)} style={{marginLeft:"10px",marginRight:"10px",cursor:"pointer"}}/> : <ExpandLessIcon fontSize="small" onClick={() => handleExpand(index)} style={{marginLeft:"10px",marginRight:"10px",cursor:"pointer"}}/>}
                                    </div>
                                </div>
                            </div>
                        ))) : ""
                        }
                            </div>
                        </div>
                    </div>
                </div> : 
                <Redirect to="/login"/>
            }
            {edit ? <EditEvent events={events} setEvents={setEvents} setEdit={setEdit} edit={edit} eventId={eventId} setEventId={setEventId} scroll='paper'/> : ""}
        </>
    );
}

export default SearchPage;
import React, { useContext, useEffect, useState} from 'react';
import buildCalendar from './build';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import './calendar.css';
import ControlledOpenSelect from './ControlledOpenSelect';
import {HolidaysContext} from "./HolidayContext";
import { useAuth } from '../Auth/AuthContext';
import firebase from "../../firbase";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EditEvent from '../Events/EditEvent';

// import axios from "axios";
require('dotenv').config();

// const HolidaysContext = createContext();
const db = firebase.firestore();

function Calendar(props) {

    const [homeDisplay,setHomeDisplay] = useState([]);
    const [calendar,setCalendar] = useState([]);
    const [viewType, setviewType] = React.useState("month");
    const {holidays} = useContext(HolidaysContext); 
    const [events,setEvents] = useState([]);
    const {currentUser} = useAuth();
    const [eventId,setEventId] = useState("");
    const [edit,setEdit] = useState(false);

    useEffect(() => {
        setCalendar(buildCalendar(props.val,viewType));
    },[props.val,viewType,holidays]);
    
    useEffect(() => {
        db.collection("users").doc(currentUser.uid).onSnapshot((doc) => {
            if(doc.exists){
                // console.log(doc.data());
                setEvents(doc.data().events);
            }
        });
    },[currentUser]);

    useEffect(() => {
        if(events){
            events.sort(function(a,b) {
                var key1 = a.startTime.toDate();
                var key2 = b.startTime.toDate();
                if(key1<key2) return -1;
                if(key1>key2) return 1;
                return 0;
            });
            setHomeDisplay(events);
        }
    },[events]);

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

    function isSelected(day){
        return props.val.isSame(day,"day");
    }

    function checkMonth(day){
        const startMon = props.val.clone().startOf("month");
        const endMon = props.val.clone().endOf("month");
        if(day.isBefore(startMon) || day.isAfter(endMon)){
            return true;
        } else {
            return false;
        }
    }

    function isToday(day) {
        return day.isSame(new Date(),"day");
    }

    function dayStyles(day){
        if(checkMonth(day)) return "before";
        if(isSelected(day)) return "selected";
        if(isToday(day)) return "today";
        return "";
    }

    function curMonth() {
        return props.val.format("MMMM");
    }

    function curYear() {
        return props.val.format("YYYY");
    }

    function nextMonth(){
        return props.val.clone().add(1,"month");
    }

    function prevMonth(){
        return props.val.clone().subtract(1,"month");
    }
    function handleNext(){
        if(viewType==="month")
        {
            props.setVal(nextMonth());
        }
        else if(viewType==="week")
        {
            props.setVal(props.val.clone().add(1,"week"));
        }
        
    }
    function handlePrev(){
        if(viewType==="month")
        {
            props.setVal(prevMonth());
        }
        else if(viewType==="week")
        {
            props.setVal(props.val.clone().subtract(1,"week"));
        }
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

    function cardStyle(index) {
        if(index%3 ===0) return "event-card purple-card";
        if(index%3 ===1) return "event-card green-card";
        return "event-card orange-card";
    }

    
    var weeklyTime = Array(24).fill(null).map(() => Array(8));
    for(var i=0;i<24;i++)
    {
        for(var j=0;j<8;j++)
        {
            weeklyTime[i][j] = "";
        }
        if(i<10)
        {
            weeklyTime[i][0] = "0"+i+":00";
        }
        else
        {
            weeklyTime[i][0] = i+":00";
        }
    }

    return (
        <div className="main-container" style={{display:"flex"}}>
        <div className="calendar">
        <div className="header">
            <div style={{paddingTop:"20px"}}>
                <div className="navigation" onClick={() => handlePrev()}>
                    <NavigateBeforeIcon />
                </div>
                <div className="navigation" onClick={()=> handleNext()}>
                    <NavigateNextIcon />
                </div>
            </div>
            <div className="current" style={{paddingTop:"25px"}}>
                {curMonth()} {curYear()}
            </div>
            <div>
                <ControlledOpenSelect 
                    viewType = {viewType}
                    setviewType = {setviewType}
                />
            </div>
        </div>
        {viewType==="week" ?
        (<div className="time-body">
        <div className="time-column">
        <div className="body">
            <div className="day-names">
                {["Time","SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => {
                    if(d==="SAT" || d==="SUN"){
                        return (<div className="weekly-week" style={{color:"red"}}>{d}</div>);
                    }
                    else if(d==="Time"){
                        return (<div className="time-week">time</div>);
                    }
                    return (<div className="weekly-week">{d}</div>);
                })}
            </div>
            {calendar.map((week) => (
                <div>
                <div style={{display:"flex", marginLeft:"5.5%"}}>
                    {week.map((day) => (
                        <div className="day" onClick={() => props.setVal(day)}>
                            <div className={dayStyles(day)}>{day.format("D")}</div>
                            {holidays.map((holiday) => {
                                const dayH = holiday.date.datetime.day;
                                const monthH = holiday.date.datetime.month;
                                const month = day.format("M");
                                const curDay = day.format("D");
                                // if(month==monthH && curDay==dayH){
                                //     return <div className="holiday-display">{holiday.name}</div>
                                // } 
                            })}
                        </div>
                    ))}
                </div>
                <div className="time-matrix" style={{display:"flex"}}>
                    {weeklyTime.map((timeRow) => (
                        <div style={{display:"flex"}}>
                            {timeRow.map((timeEvent,index) => (
                                index !== 0 ? 
                                    <div className="timeStampMain timeStamp" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                {timeEvent}
                            </div>
                                    :
                                <div className="timeStamp" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                    <div>
                                    {timeEvent}
                                    </div>
                                </div>
                                
                            ))}
                        </div>
                    ))}

                </div>
                </div>

            ))}
        </div>
        </div>
    </div>)
    : 
        (<div className="body">
            <div className="day-names">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => {
                    if(d==="SAT" || d==="SUN"){
                        return (<div className="week" style={{color:"red"}}>{d}</div>);
                    }
                    return (<div className="week">{d}</div>);
                })}
            </div>
            {calendar.map((week) => (
                <div style={{display:"flex"}}>
                    {week.map((day) => (
                        <div className="day" onClick={() => props.setVal(day)}>
                            <div className={dayStyles(day)}>
                                <span style={{height:"10px", width:"10px"}}>
                                    {day.format("D")}
                                </span>  
                                </div>
                            {holidays.map((holiday) => {
                                const dayH = holiday.date.datetime.day;
                                const monthH = holiday.date.datetime.month;
                                const month = day.format("M");
                                const curDay = day.format("D");
                                // if(month==monthH && curDay==dayH){
                                //     return <div className="holiday-display">{holiday.name}</div>
                                // } 
                            })}
                        </div>
                    ))}
                </div>
            ))}
        </div>)
        }
    </div>
    <div className="divider"></div>
    <div className="events-display">
    <div className="event-title">Your Events</div>
    <div className="event-card-display">
        {homeDisplay.map((event,index) => {
            const month= event.eventDay.toDate().toLocaleString('default',{month: 'long'});
            const curmonth = curMonth();
            if(month === curmonth)
            {
                return (
                    
                    <div className={cardStyle(index)}>
                        <div style={{display:"flex"}}>
                            <div style={{width:"25%"}}>
                                <div>
                                <div className="event-card-day" style={{display:"inline-block", marginRight:"5px"}}>
                                    {event.eventDay.toDate().getDate()}
                                </div>
                                <div style={{display:"inline-block"}}>
                                    {event.eventDay.toDate().toLocaleString('default',{month: 'long'})}
                                </div>
                                </div>
                                <div style={{marginTop:"10px"}}>
                                {event.eventDay.toDate().toLocaleString('default',{weekday: 'long'})}
                                </div>
                                <div style={{display:"inline-block"}}>{`${formatAMPM(event.startTime.toDate())} - ${formatAMPM(event.endTime.toDate())}`}</div>
                            </div>
                            <div style={{display:"flex", flexDirection:"column",width:"75%"}}>
                                <div style={{ fontSize:"2rem", fontWeight:"600"}}>
                                {event.title}
                                </div>
                                <div>
                                {event.description}
                                </div>
                            </div>
                        </div>
                        <div style={{textAlign:"right"}}>
                        <EditIcon fontSize="small" onClick={() => handleEdit(event)} style={{cursor:"pointer"}}/>
                        <DeleteIcon fontSize="small" onClick={() => handleDelete(event)} style={{marginLeft: "10px",cursor:"pointer"}}/>
                        {edit ? <EditEvent events={events} setEvents={setEvents} setEdit={setEdit} edit={edit} eventId={eventId} setEventId={setEventId} scroll='paper'/> : ""}
                        </div>
                    </div>
                );
            }
        })}
    </div>
    </div>
    </div>
    );
}

export default Calendar;
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
import { Tooltip } from '@material-ui/core';
import NativeSelect from "@material-ui/core/NativeSelect";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import AddEvent from "../Events/AddEvent";
import ReactNotification from 'react-notifications-component';
import {store} from 'react-notifications-component';
import 'animate.css'
import moment from 'moment';
import 'react-notifications-component/dist/theme.css'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
}));

// import axios from "axios";
require('dotenv').config();

const db = firebase.firestore();

function Calendar(props) {

    const classes = useStyles();

    const [homeDisplay,setHomeDisplay] = useState([]);
    const [calendar,setCalendar] = useState([]);
    const [viewType, setviewType] = useState("month");
    const {holidays} = useContext(HolidaysContext); 
    const [events,setEvents] = useState([]);
    const {currentUser} = useAuth();
    const [eventId,setEventId] = useState("");
    const [edit,setEdit] = useState(false);
    const [numEvents,setNumEvents] = useState(0);
    const [open,setOpen] = useState(false);
    const [scroll, setScroll] = React.useState('paper');

    useEffect(() => {
        setCalendar(buildCalendar(props.val,viewType));
    },[props.val,viewType,holidays]);
    
    useEffect(() => {
        db.collection("users").doc(currentUser.uid).onSnapshot((doc) => {
            if(doc.exists){
                // let ev = [];
                // console.log(doc.data().events.length);
                // if(doc.data().events){
                //     doc.data().events.forEach((el) => {
                //         el.get().then(res => {
                //             // console.log(res.data());
                //             ev.push(res.data());
                //         })
                //     })
                //     setEvents(ev);
                // }
                // console.log(ev);
                
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

    useEffect(() => {
        const interval = setInterval(() => {
            for(var i=0;i<events.length;i++)
            {
                const A = events[i].startTime.toDate();
                const B = new Date();
                const C = (A - B);
                if ( C < 600000 && C > 540000)
                {
                    var tit = events[i].title;
                    store.addNotification({
                        title: "Event Reminder(10 minutes to go)",
                        message: tit,
                        type: "success",
                        container: "top-right",
                        insert: "top",
                        animationIn: ["animated","fadeIn"],
                        animationOut: ["animated","fadeOut"],
                        width: 450,
                        // dismiss: {
                        //     duration: 10000,
                        //     showIcon: true
                        // }
                    })
                }
            }
          }, 50000);
          return () => clearInterval(interval);
    },[events])

    function  handleAddEvent(scrollType){
        setOpen(true);
        setScroll(scrollType);
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
        var s = "";
        // console.log(events[1].eventDay.toDate());
        if(checkMonth(day)) s = "before";
        if(isSelected(day)) return "selected";
        if(isToday(day)) return "today";
        if(events){
            events.forEach((eve,index) => {
                if(eve.eventDay.toDate().getMonth() === day.toDate().getMonth()){
                    if(eve.eventDay.toDate().getDate() === day.toDate().getDate()){
                        if(index%3 ===0) s = s+" purple-card";
                        else if(index%3 ===1)  s = s + " green-card";
                        else s = s + " orange-card";
                    }
                }
            });
        }
        return s;
    }

    function curMonth() {
        return props.val.format("MMMM");
    }

    // function curWeek() {
    //     return props.val.format("WWWW");
    // }

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
    var timeStyle = Array(24).fill(null).map(() => Array(8));

    const start = props.val.clone().startOf('week');
    const end = props.val.clone().endOf('week');
    var days = [];
    for (var l = 0; l <= 6; l++) {
        days.push(moment(start).add(l, 'days').format("D"));
    }

        for(var i=0;i<24;i++)
    {
        
        
        for(var j=0;j<8;j++)
        {
            weeklyTime[i][j] = "";
            timeStyle[i][j] = "";
            // events.forEach()
            // if(j!==0){
            //     for(var k=0;k<5;k++){

            //     }
            // }
        }
        // events.forEach(ev => {
        //     var start = ev.startTime.toDate().
        // })
        if(i<10)
        {
            weeklyTime[i][0] = "0"+i+":00";
        }
        else
        {
            weeklyTime[i][0] = i+":00";
        }
    }

    for(let k=1;k<8;k++){
        const dt = days[k-1];
        if(events){
            events.forEach((ev,ind) => {
                const st = ev.startTime.toDate().getDate();
                const h = ev.startTime.toDate().getHours();
                const e = ev.endTime.toDate().getHours();
                // const m = ev.startTime.toDate().getMinutes();
                // console.log(e);
                if(st == dt){
                    
                    const lolu =Math.round((h + e)/2);
                    // console.log(lolu);
                    if(weeklyTime[lolu][k]==="")
                        weeklyTime[lolu][k] += ev.title;
                    else
                        weeklyTime[lolu][k] += ", "+ev.title;
                    for(let lol=h;lol<=e;lol++){
                        if(weeklyTime[lol][k]==="")
                            weeklyTime[lol][k] = " ";
                        timeStyle[lol][k] = ind%3;
                    }
                }
                // console.log(st);
                // return "";
            })
        }
    }
    
    const timeStyles = (ind1,ind2) => {
        let s = "timeStampMain timeStamp";
        if(weeklyTime[ind1][ind2] !== ""){
            const index = timeStyle[ind1][ind2];
            if(index%3 ===0) s = s+" purple-card";
            if(index%3 ===1)  s = s + " green-card";
            if(index%3 === 2) s = s + " orange-card";
        }
        return s;
    }

    // console.log(days);

    // console.log(events);
    return (
        <>
        <ReactNotification />
        <div className="main-container" style={{display:"flex"}}>
        <div className="calendar">
        <div className="header">
        
            <div style={{paddingTop:"15px"}}>
                <div className="navigation" onClick={() => handlePrev()}>
                    <NavigateBeforeIcon />
                </div>
                <div className="navigation" onClick={()=> handleNext()}>
                    <NavigateNextIcon />
                </div>
            </div>
            <div className="current" style={{paddingTop:"20px"}}>
                {curMonth()} {curYear()}
            </div>
            <div>
                {/* <ControlledOpenSelect 
                    viewType = {viewType}
                    setviewType = {setviewType}
                /> */}
                <NativeSelect
                    value={viewType}
                    onChange={(e) => setviewType(e.target.value)}
                    name="View"
                    className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'age' }}
                    >
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                </NativeSelect>
            </div>
        </div>
        {viewType==="week" ?
        (<div className="time-body" >
        <div className="time-column">
        <div className="body" style={{borderRadius: "10px"}}>
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
                            <div className="dot-container">  
                                    {holidays.map((holiday) => {
                                        const dayH = holiday.date.datetime.day;
                                        const monthH = holiday.date.datetime.month;
                                        const month = day.format("M");
                                        const curDay = day.format("D");
                                        if(month==monthH && curDay==dayH){
                                            return (
                                                <Tooltip title={holiday.name} placement="bottom">
                                                <div className="dot"></div>
                                                </Tooltip>
                                            );
                                        } else return "";
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="time-matrix" style={{display:"flex"}}>
                    {weeklyTime.map((timeRow,ind) => (
                        <div style={{display:"flex"}}>
                            {timeRow.map((timeEvent,index) => (
                                index !== 0 ? 
                                    <div className={timeStyles(ind,index)} style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
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
        (<div className="body" style={{borderRadius: "10px"}}>
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
                            <div className="dot-container">  
                                    {holidays.map((holiday) => {
                                        const dayH = holiday.date.datetime.day;
                                        const monthH = holiday.date.datetime.month;
                                        const month = day.format("M");
                                        const curDay = day.format("D");
                                        if(month==monthH && curDay==dayH){
                                            return (
                                                <Tooltip title={holiday.name} placement="bottom">
                                                <div className="dot"></div>
                                                </Tooltip>
                                            );
                                        } else return "";
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>)
        }
    </div>
    {/* <div className="divider"></div> */}
    <div className="events-display">
    <div className="event-title">Your Events</div>
    <div className="event-card-display">
        {homeDisplay.map((event,index) => {
            const month= event.eventDay.toDate().toLocaleString('default',{month: 'long'});
            const curmonth = curMonth();
            if(month === curmonth)
            {
                numEvents===0 && setNumEvents(1)  
                return (
                    <div className={cardStyle(index)}>
                        <div style={{display:"flex"}}>
                            <div style={{width:"50%"}}>
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
                                <div style={{display:"inline-block",fontSize:"0.75rem"}}>{`${formatAMPM(event.startTime.toDate())} - ${formatAMPM(event.endTime.toDate())}`}</div>
                            </div>
                            <div style={{display:"flex", flexDirection:"column",width:"50%"}}>
                                <div style={{ fontSize:"1.25rem", fontWeight:"600"}}>
                                {event.title}
                                </div>
                                <div style={{fontSize: "0.75rem"    }}>
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
            return "";
        })}
        {numEvents===0 && <div style={{textAlign:"center", marginTop:"50%"}}><h1>No Event</h1></div> }
    </div>
    <div style={{textAlign:"right"} }>
    <Fab color="primary" aria-label="add" onClick={() => handleAddEvent('paper')}>
        <AddIcon />
    </Fab>
    
    </div>
    </div>
    </div>
    <AddEvent open={open} setOpen={setOpen} scroll={scroll} setScroll={setScroll}/>
    {edit ? <EditEvent events={events} setEvents={setEvents} setEdit={setEdit} edit={edit} eventId={eventId} setEventId={setEventId} scroll='paper'/> : ""}
    </>
    );
}


export default Calendar;
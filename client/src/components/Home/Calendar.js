import React, { useContext, useEffect, useState} from 'react';
import buildCalendar from './build';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import './calendar.css';
import ControlledOpenSelect from './ControlledOpenSelect';
import {HolidaysContext} from "./HolidayContext";
// import axios from "axios";
require('dotenv').config();

// const HolidaysContext = createContext();

function Calendar(props) {

    const [calendar,setCalendar] = useState([]);
    const [viewType, setviewType] = React.useState("month");
    const {holidays} = useContext(HolidaysContext); 
    useEffect(() => {
        setCalendar(buildCalendar(props.val,viewType));
        console.log(holidays);
    },[props.val,viewType,holidays]);
    
    // const [holidays,setHolidays] = useState([]);
    // const [hol,setHol] = useState();
    // const [year,setYear] = useState(2021);

    // useEffect(() =>{
    //     axios.defaults.withCredentials = false;
    //     axios.get(`https://calendarific.com/api/v2/holidays?&api_key=b3f3b4fe3b8cc3e33dd71484fa52cd88bf7cff0d&country=in&year=${year}`)
    //     .then(res => res.data)
    //     .then(data =>{
    //         // setHolidays(data.response.holidays);
    //         // console.log(data.response.holidays);
    //         // const tmp = data.response.holidays;
    //         // console.log(tmp);
    //         setHolidays(data.response.holidays);
    //         // console.log(holidays);
    //     }).catch(err =>{
    //         console.log(err);
    //     })
    // },[year,setHolidays])



    // useEffect(() => {
    //     if(props.val.clone().year()!==year){
    //         console.log(year);
    //         setYear(props.val.clone().year());
    //         console.log(props.val.clone().year());
    //     }
    // },[props.val,year]);

    function isSelected(day){
        return props.val.isSame(day,"day");
    }
        // console.log(setHolidays);
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
    // changeHolidays("bye");
    return (
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
                    else if(d=="Time"){
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
                            <div className={dayStyles(day)}>{day.format("D")}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>)
        }
    </div>
    );
}

export default Calendar;
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import buildCalendar from './build';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import './calendar.css'
import { Button } from '@material-ui/core';

function Calendar() {

    const [calendar,setCalendar] = useState([]);
    const [val,setVal] = useState(moment());

    useEffect(() => {
        setCalendar(buildCalendar(val));

    },[val]);

    function isSelected(day){
        return val.isSame(day,"day");
    }

    function checkMonth(day){
        const startMon = val.clone().startOf("month");
        const endMon = val.clone().endOf("month");
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
        return val.format("MMMM");
    }

    function curYear() {
        return val.format("YYYY");
    }

    function nextMonth(){
        return val.clone().add(1,"month");
    }

    function prevMonth(){
        return val.clone().subtract(1,"month");
    }

    return (
        <div className="calendar">
            <div className="header">
                <div>
                    <div className="navigation" onClick={() => setVal(prevMonth())}>
                        <NavigateBeforeIcon />
                    </div>
                    <div className="navigation" onClick={()=> setVal(nextMonth())}>
                        <NavigateNextIcon />
                    </div>
                </div>
                <div className="current">
                    {curMonth()} {curYear()}
                </div>
                <div>
                    <Button variant="contained" color="primary">View</Button>
                </div>
            </div>
            <div className="body">
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
                            <div className="day" onClick={() => setVal(day)}>
                                <div className={dayStyles(day)}>{day.format("D")}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
import React, { createContext,useEffect, useState } from 'react';
import axios from 'axios';

export const HolidaysContext = createContext();

export default function HolidayContext(props) {

    const [holidays,setHolidays] = useState([]);
    const [location,setLocation] = useState("in");
    useEffect(() =>{
        axios.defaults.withCredentials = false;
        
        // if(navigator.geolocation){
        //     navigator.geolocation.getCurrentPosition(function(pos){

        //     })
        // }
        navigator.geolocation.getCurrentPosition(function(loc){
            console.log(loc);
        })
        axios.get(`https://calendarific.com/api/v2/holidays?&api_key=54ecef6b8ec5f05fe471b4b8029d0c539cf8b67c&country=${location}&year=${props.val.clone().format('YYYY')}`)
        .then(res => res.data)
        .then(data =>{
            let val = data.response.holidays;
            val.forEach(obj => {
                obj.open=false
            });
            setHolidays(val);
            // console.log(data.response.holidays);
        }).catch(err =>{
            console.log(err);
        })
    },[props.val,location])
    const  value = {
        holidays
    }
    return (
        <HolidaysContext.Provider value={value}>
            {props.children}
        </HolidaysContext.Provider>
    );
}

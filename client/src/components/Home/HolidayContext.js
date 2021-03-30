import React, { createContext,useEffect, useState } from 'react';
import axios from 'axios';

export const HolidaysContext = createContext();

export default function HolidayContext(props) {

    const [holidays,setHolidays] = useState([]);

    useEffect(() =>{
        axios.defaults.withCredentials = false;
        
        axios.get(`https://calendarific.com/api/v2/holidays?&api_key=2438b3df4351ba9314c1b43e50a90454c591406d&country=in&year=${props.val.clone().format('YYYY')}`)
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
    },[props.val])
    const  value = {
        holidays
    }
    return (
        <HolidaysContext.Provider value={value}>
            {props.children}
        </HolidaysContext.Provider>
    );
}

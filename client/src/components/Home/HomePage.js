import React from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import Calendar from './Calendar';
// import './home.css';
import Sidebar from '../Sidebar/Sidebar';

export default function HomePage() {
    
    return (
        <div style={{display:"flex"}}>
            <Sidebar/>
            <Calendar/>
        </div>
    );
}

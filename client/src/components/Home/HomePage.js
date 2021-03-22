import React, { useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import Calendar from './Calendar';
// import './home.css';
import Sidebar from '../Sidebar/Sidebar';
import {useAuth} from "../Auth/AuthContext";
import { Redirect } from 'react-router';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddEvent from '../Events/AddEvent';

export default function HomePage() {
    const {currentUser} = useAuth();
    const [open,setOpen] = useState(false);
    const [scroll, setScroll] = React.useState('paper');
    function handleAddEvent(scrollType){
        setOpen(true);
        setScroll(scrollType);
    }
    return (
        <>
            {currentUser ? 
            <div style={{display:"flex"}}>
                <Sidebar/>
                <Calendar/>
                <AddCircleIcon onClick={() => handleAddEvent('paper')}/>    
                <AddEvent open={open} setOpen={setOpen} scroll={scroll} setScroll={setScroll}/>
            </div> : 
            <Redirect to="/login"/>
            }
        </>
    );
}

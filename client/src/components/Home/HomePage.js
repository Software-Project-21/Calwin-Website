import React, { useState } from 'react';
import Calendar from './Calendar';
import Sidebar from '../Sidebar/Sidebar';
import SearchBar from "./SearchBar";
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
                <div style={{width:"100%"}} >
                    <SearchBar/>
                    <Calendar/>
                </div>
                {/* <AddCircleIcon onClick={() => handleAddEvent('paper')}/>     */}
                <AddEvent open={open} setOpen={setOpen} scroll={scroll} setScroll={setScroll}/>
            </div> : 
            <Redirect to="/login"/>
            }
        </>
    );
}

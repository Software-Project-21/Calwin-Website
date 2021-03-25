import React, { useState } from 'react';
import Calendar from './Calendar';
import Sidebar from '../Sidebar/Sidebar';
import SearchBar from "./SearchBar";
import {useAuth} from "../Auth/AuthContext";
import { Redirect } from 'react-router';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddEvent from '../Events/AddEvent';
import moment from 'moment';
import Events from  "./Events";

export default function HomePage() {
    const {currentUser} = useAuth();
    const [open,setOpen] = useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [val,setVal] = useState(moment());
    function handleAddEvent(scrollType){
        setOpen(true);
        setScroll(scrollType);
    }
    return (
        <>
            {currentUser ? 
            <div style={{display:"flex"}}>
                <Sidebar
                    val={val}
                    setVal={setVal}
                />
                <div style={{width:"100%"}} >
                    <SearchBar/>
                    <Calendar
                        val={val}
                        setVal={setVal}
                        // show={true}
                    />
                    {/* <Events/> */}
                </div>
                {/* <AddCircleIcon onClick={() => handleAddEvent('paper')}/>     */}
                <AddEvent open={open} setOpen={setOpen} scroll={scroll} setScroll={setScroll}/>
            </div> : 
            <Redirect to="/login"/>
            }
        </>
    );
}

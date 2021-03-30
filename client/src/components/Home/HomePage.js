import React, { useState } from 'react';
import Calendar from './Calendar';
import Sidebar from '../Sidebar/Sidebar';
import SearchBar from "./SearchBar";
import {useAuth} from "../Auth/AuthContext";
import { Redirect } from 'react-router';

export default function HomePage(props) {
    const {currentUser} = useAuth();
    return (
        <>
            {currentUser ? 
            <div style={{display:"flex"}}>
                <Sidebar
                    val={props.val}
                    setVal={props.setVal}
                />
                <div style={{width:"100%"}} >
                    <SearchBar/>
                    <Calendar
                        val={props.val}
                        setVal={props.setVal}
                        // show={true}
                    />
                    {/* <Events/> */}
                </div>
            </div> : 
            <Redirect to="/login"/>
            }
        </>
    );
}

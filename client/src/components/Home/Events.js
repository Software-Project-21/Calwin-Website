import React, { useContext, useEffect, useState } from 'react';
import {HolidaysContext} from "./HolidayContext";
import "../Events/Events.css";
import moment from "moment";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SearchBar from './SearchBar';
import Sidebar from '../Sidebar/Sidebar';

function Events() {
    // console.log(HolidaysContext);
    const {holidays} = useContext(HolidaysContext);
    // console.log(holidays);
    
    const [expand,setExpand] = useState([]);

    useEffect(() => {
        if(holidays.length>0){
            const ini = holidays.map(obj => (
                obj.open
            ));
            setExpand(ini);
        }
    },[holidays])

    function handleExpand(index){
        const newArr = [...expand];
        newArr[index] = !newArr[index];
        setExpand(newArr);
    }

    return (
        <>
        
        <div style={{display:"flex"}}>
            <Sidebar
                // show={false}
            />
            <div style={{width:"100%"}} >
                <SearchBar/>
                <div className="event-list">
                {/* <div style={{padding:"2%"}}> */}
                    {holidays.map((holiday,index) => (
                        <div style={{padding:"1%",display:"flex",border:"#dadce0 1px solid"}}>
                            <div style={{display:"flex",flexBasis:"10%"}}>
                                <div style={{flexBasis:"25%",fontWeight:"700",fontSize:"1.1rem"}}>
                                    {holiday.date.datetime.day}
                                </div>
                                <div style={{flexBasis:"30%",paddingTop:"3px"}}>
                                {moment(holiday.date.iso).format('MMMM').substr(0,3)}
                                </div>
                                <div style={{paddingTop:"3px"}}>
                                {moment(holiday.date.iso).format('dddd').substr(0,3)}
                                </div>
                            </div>
                            <div onClick={() => handleExpand(index)} className="content" style={{display:"flex",flexGrow:"3",fontWeight:"600",flexDirection:"column"}}>
                                <div style={{display:"flex"}}>
                                    <div style={{flexBasis:"15%",display:"flex"}}>
                                        <div style={{height:"10px",width:"10px",borderRadius:"100%",backgroundColor:"green",margin:"5px 5px 0 0"}}>
                                        </div>
                                        <div>All Day</div>
                                    </div>
                                    <div>
                                        {holiday.name}
                                    </div>
                                </div>
                                { expand[index] ? (
                                    <div>
                                        <div style={{padding:"20px",paddingLeft:"0"}}>
                                            <div>{holiday.description}</div>
                                            <div style={{textAlign:"right"}}>
                                                <ExpandLessIcon />
                                            </div>
                                        </div>
                                    </div>
                                    ):<div></div>
                                }
                            </div>
                        </div>
                    ))}
                {/* </div> */}
            </div>
            </div>
        </div>
        </>
    );
}

export default Events;
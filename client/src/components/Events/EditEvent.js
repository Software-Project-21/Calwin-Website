import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import DatePicker from './DatePicker';
import TimePicker from "./TimePicker";
import firebase from '../../firbase';
import { useAuth } from '../Auth/AuthContext';
import EmailTags from './EmailTags';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


function EditEvent(props) {
    
    const classes = useStyles();
    const [title,setTitle] = useState("");
    const [desc,setDesc] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime,setStartTime] = useState(new Date());
    const [endTime,setEndTime] = useState(new Date());  
    const [pid,setPid] = useState([]);
    const {currentUser} = useAuth();

    const handleClose = () => {
        props.setEdit(false);
        clear();
    };

    const handleSubmit = () => {


        const eve = {
            title: title,
            description: desc,
            eventDay : firebase.firestore.Timestamp.fromDate(selectedDate),
            startTime: firebase.firestore.Timestamp.fromDate(startTime),
            endTime: firebase.firestore.Timestamp.fromDate(endTime)
        }

        const newEvents = [...props.events];
        const id = props.eventId;
        // console.log(id);
        var ind = -1;
        newEvents.forEach((el,index) => {
            if(el.id===id){
                ind = index;
            }
        });
        newEvents[ind] = {...eve,id:id,primary:true};
        // console.log(newEvents);
        db.collection("users").doc(currentUser.uid).update({
            events: newEvents
        });

        db.collection("events").doc(id).set({
           ...eve,sharedWith: pid 
        },{merge:true});
        editEve(id,eve);
        invite(id);
        props.setEvents(newEvents);
        props.setEdit(false);
        props.setEventId("");
        clear();
    } 

    const editEve = (id,eve) => {
        console.log("reached");
        pid.forEach(el => {
            if(el){
                console.log("here");
                // var ev = [];
                // var ev;
                db.collection("users").doc(el.id).get().then((doc) => {
                    if(doc.exists){

                        var ev = doc.data().events;
                        // console.log(ev);
                        if(ev){
                            doc.data().events.forEach((ele,ind) => {
                                // console.log(el.id);
                                if(ele.id===id){
                                    // console.log("now");
                                    ev[ind] = {...eve,id:id,primary:false};
                                    console.log(ev);
                                    db.collection("users").doc(el.id).update({
                                        events: ev
                                    })
                                }
                            })
                        }
                    }
                });
                // Soft e
// softe01035780@gmail.com
                // console.log(ev);
                // if(ev){
                // console.log(ev);
                // }
                // console.log(id);
                // var ind = -1;
                // ev.forEach((el,index)=>{
                //     if(el.id==id){
                //         ind = index;
                //         // console.log(index);
                //     }
                // })
                // console.log(ind);
                // ev[ind] = {...eve,id:id,primary:false};
                // db.collection("users").doc(el.id).update({
                //     events: ev
                // });
            }
        })
    }

    const invite = (id) =>{
        const invite = {
            eventId: id,
            name: currentUser.displayName,
            accepted:false
        }
        // console.log(invite);
        pid.forEach(el => {
            if(el){
                db.collection('users').doc(el.id).update({
                    invitations: firebase.firestore.FieldValue.arrayUnion(invite)
                })
            }
        });
    }

    const clear = () => {
        setTitle("");
        setDesc("");
        setSelectedDate(new Date());
        setStartTime(new Date());
        setEndTime(new Date());
        setPid([]);
    }

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (props.open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [props.open]);

    function handleChange(e){
        // console.log(e.target.id);
        var id = e.target.id;
        var val = e.target.value;
        if(id==='standard-basic title')
            setTitle(val);
        if(id==='standard-basic description')
            setDesc(val);
    }

    useEffect(() => {
        var id = props.eventId;
        if(id!==""){
            db.collection("users").doc(currentUser.uid).get().then((doc) => {
                if(doc.exists){
                    doc.data().events.forEach(el => {
                        // console.log(el);
                        // console.log(id);
                        if(el.id===id){
                            setTitle(el.title);
                            setDesc(el.description);
                            setSelectedDate(el.eventDay.toDate());
                            setStartTime(el.startTime.toDate());
                            setEndTime(el.endTime.toDate());
                        }
                    });
                }
            })
            
            db.collection("events").doc(id).get().then((doc) => {
                if(doc.exists){
                    const el = doc.data();
                    setPid(el.sharedWith);
                }
            })
        }
    },[props.eventId,currentUser])

    return (
        <>
            <Dialog
            open={props.edit}
            onClose={handleClose}
            scroll={props.scroll}
            overlayStyle={{backgroundColor:'transparent'}}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            >
            <DialogTitle id="scroll-dialog-title">Edit Event</DialogTitle>
            <DialogContent dividers={props.scroll === 'paper'}>
                <form className={classes.root} noValidate >
                    <TextField required id="standard-basic title" placeholder="Title" value={title} onChange={(e) => handleChange(e)}/>
                    <TextField
                        id="standard-basic description"
                        placeholder="Description"
                        multiline
                        // rows={4}
                        // variant="outlined"
                        value={desc}
                        onChange={(e) => handleChange(e) }
                        inputProps={{maxLength: 100}}
                        fullWidth
                        // style={{margin: "2% 0"}}
                    />
                    <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} setStartTime={setStartTime} setEndTime={setEndTime}/>
                    <TimePicker startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} />
                    <EmailTags pid={pid} setPid={setPid} />
                </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
                Save
            </Button>
            </DialogActions>
            </Dialog>
         
    </>
    );
}

export default EditEvent;
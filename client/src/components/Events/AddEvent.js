import React, { useState } from 'react';
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
import nextId from "react-id-generator";

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


function AddEvent(props) {
    
    const classes = useStyles();
    const [title,setTitle] = useState("");
    const [desc,setDesc] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime,setStartTime] = useState(new Date());
    const [endTime,setEndTime] = useState(new Date());  
    const {currentUser} = useAuth();

    const handleClose = () => {
        props.setOpen(false);
        clear();
    };

    const handleSubmit = () => {
        const eve = {
            id: nextId(),
            title: title,
            description: desc,
            eventDay : firebase.firestore.Timestamp.fromDate(selectedDate),
            startTime: firebase.firestore.Timestamp.fromDate(startTime),
            endTime: firebase.firestore.Timestamp.fromDate(endTime)
        }
        db.collection('users').doc(currentUser.uid).update({
            events: firebase.firestore.FieldValue.arrayUnion(eve)
        });
        props.setOpen(false);
        clear();
    } 

    const clear = () => {
        setTitle("");
        setDesc("");
        setSelectedDate(new Date());
        setStartTime(new Date());
        setEndTime(new Date());
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

    return (
        <div>
            <Dialog
            open={props.open}
            onClose={handleClose}
            scroll={props.scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            >
            <DialogTitle id="scroll-dialog-title">Add Event</DialogTitle>
            <DialogContent dividers={props.scroll === 'paper'}>
                <form className={classes.root}>
                    <TextField required id="standard-basic title" placeholder="Title" value={title} onChange={(e) => handleChange(e)}/>
                    <TextField
                        id="standard-basic description"
                        placeholder="Description(max 64 char)"
                        multiline
                        // rows={4}
                        // variant="outlined"
                        value={desc}
                        onChange={(e) => handleChange(e) }
                        inputProps={{maxLength: 64}}
                        fullWidth
                        // style={{margin: "2% 0"}}
                    />
                    <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} setStartTime={setStartTime} setEndTime={setEndTime}/>
                    <TimePicker startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} />
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
        </div>
    );
}

export default AddEvent;
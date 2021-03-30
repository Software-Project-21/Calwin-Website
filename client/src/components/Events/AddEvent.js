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
    // const [title,setTitle] = useState("");
    // const [desc,setDesc] = useState("");
    // const [selectedDate, setSelectedDate] = useState(new Date());
    // const [startTime,setStartTime] = useState(new Date());
    // const [endTime,setzEndTime] = useState(new Date());  

    const handleClose = () => {
        props.setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (props.open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [props.open]);

    // function handleTitle(e){
    //     setTitle(e.target.value);
    // }

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
                <form className={classes.root} noValidate >
                    <TextField required id="standard-basic" placeholder="Title" />
                    <TextField
                        id="standard-basic"
                        placeholder="Description"
                        multiline
                        // rows={4}
                        // variant="outlined"
                        
                        // value={props.desc}
                        // onChange={(e) =>{props.setDesc(e.target.value)}}
                        inputProps={{maxLength: 100}}
                        fullWidth
                        // style={{margin: "2% 0"}}
                    />
                    <DatePicker/>
                    <TimePicker/>
                </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
                Save
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default AddEvent;
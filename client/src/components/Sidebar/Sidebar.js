import React,{useState} from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import ListItem from "@material-ui/core/ListItem";
import IconButton from '@material-ui/core/IconButton';
import { MdFingerprint } from 'react-icons/md';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import "./sidebar.css";
import TodayIcon from '@material-ui/icons/Today';
import EventNoteIcon from '@material-ui/icons/EventNote';
import moment from 'moment';
import { useHistory } from "react-router";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {useAuth} from "../Auth/AuthContext";
import AddEvent from "../Events/AddEvent";
import Tooltip from '@material-ui/core/Tooltip';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh"
  },
  paper: {
    background: "#494DC4",
    width: "60px"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
    
  },
  tooltip: {
    fontSize: "2em",
  }
}));


export default function Sidebar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const {currentUser} = useAuth();
  const [open,setOpen] = useState(false);
  const [scroll, setScroll] = React.useState('paper');
  function handleAddEvent(scrollType){
      setOpen(true);
      setScroll(scrollType);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className={classes.drawerClose}
        classes={{paper:classes.paper}}
        // classes={classes.drawerClose}
      >
        <div className={classes.toolbar}>
          <IconButton style={{padding:"0"}}>
            {/* <MdFingerprint className='icon' onClick={() => history.push('/')}/> */}
            <img src="/images/logo.svg" alt="logo" style={{height:"40px",width:"40px"}} onClick={() => history.push('/')}></img>
          </IconButton>
        </div>
        <List className="list">
          <Tooltip title="Go To Today" placement="right" className={classes.tooltip}>
          <ListItem button className="list-item" onClick={() => props.setVal(moment())} disabled={true}>
            <TodayIcon style={{color:"#ffffff"}}/>
          </ListItem>
          </Tooltip>
          <Tooltip title="Events List" placement="right">
          <ListItem button className="list-item" onClick={() => history.push("/events")}>
            <EventNoteIcon style={{color:"#ffffff"}}/>
          </ListItem>
          </Tooltip>
          <Tooltip title="Calendar" placement="right">
          <ListItem button className="list-item" onClick={() => history.push(`/calendar/${currentUser.providerData[0].uid}`)}>
            <CalendarTodayIcon style={{color:"#ffffff"}}/>
          </ListItem>
          </Tooltip>
          <Tooltip title="Add Event" placement="right">
          <ListItem button className="list-item" onClick={() => handleAddEvent('paper')}>
            <AddCircleIcon style={{color:"#ffffff"}}/>
          </ListItem>
          </Tooltip>
        </List>
      </Drawer>
      <AddEvent open={open} setOpen={setOpen} scroll={scroll} setScroll={setScroll}/>
    </div>
  );
}

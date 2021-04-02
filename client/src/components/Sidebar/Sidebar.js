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

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#6f51ed"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
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
        classes={classes.drawerClose}
      >
        <div className={classes.toolbar}>
          <IconButton >
            <MdFingerprint className='icon' onClick={() => history.push('/')}/>
          </IconButton>
        </div>
        <List className="list">
          <ListItem button className="list-item" onClick={() => props.setVal(moment())}>
            <TodayIcon/>
          </ListItem>
          <ListItem button className="list-item" onClick={() => history.push("/events")}>
            <EventNoteIcon/>
          </ListItem>
          <ListItem button className="list-item" onClick={() => history.push(`/calendar/${currentUser.providerData[0].uid}`)}>
            <CalendarTodayIcon />
          </ListItem>
          <ListItem button className="list-item" onClick={() => handleAddEvent('paper')}>
            <AddCircleIcon/>
          </ListItem>
        </List>
      </Drawer>
      <AddEvent open={open} setOpen={setOpen} scroll={scroll} setScroll={setScroll}/>
    </div>
  );
}

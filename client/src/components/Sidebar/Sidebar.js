import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import "./sidebar.css";

function Sidebar() {
    return (
        <div>
            <div className="sidebar">
                <div className="content">
                    <List disablePadding dense>
                        <div className='list-item'>
                            <ListItem button>
                                <ListItemText><CalendarTodayIcon/></ListItemText>
                            </ListItem>
                        </div>
                        <div className='list-item'>
                            <ListItem button>
                                <ListItemText><CalendarTodayIcon/></ListItemText>
                            </ListItem>
                        </div>
                        <div className='list-item'>
                            <ListItem button>
                                <ListItemText><CalendarTodayIcon/></ListItemText>
                            </ListItem>
                        </div>
                    </List>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
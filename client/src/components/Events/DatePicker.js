import React from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function DatePicker(props) {

    const handleDateChange = (date) => {
        props.setSelectedDate(date);
        props.setStartTime(date);
        props.setEndTime(date);
    };

    return (
        <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                {/* <Grid container justify="space-around"> */}
                    <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date"
                    value={props.selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    />
                    
                {/* </Grid> */}
            </MuiPickersUtilsProvider>
        </div>
    );
}

export default DatePicker;
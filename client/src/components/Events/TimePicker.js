import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function TimePicker(props) {
  // The first commit of Material-UI

  const handleDateChangeS = (date) => {
    props.setStartTime(date);
  };

  const handleDateChangeE = (date) => {
    props.setEndTime(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {/* <Grid container justify="space-around"> */}
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="Start Time"
          value={props.startTime}
          onChange={handleDateChangeS}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="End Time"
          value={props.endTime}
          onChange={handleDateChangeE}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      {/* </Grid> */}
    </MuiPickersUtilsProvider>
  );
}

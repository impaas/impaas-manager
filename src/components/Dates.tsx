import Grid from '@mui/material/Grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';

export const Dates = () => {
    const [startDate, setStartDate] = useState(null);
    const [freezeDate, setFreezeDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    return (<>
        <Grid container spacing={3}>
            <Grid item xs>
                <DateSelect dateType="Start Date" selectedDate={startDate} onChange={setStartDate} maxDate={freezeDate} />
            </Grid>
            <Grid item xs>
                <DateSelect dateType="Freeze Date" selectedDate={freezeDate} onChange={setFreezeDate} minDate={startDate} maxDate={endDate} />
            </Grid>
            <Grid item xs>
                <DateSelect dateType="End Date" selectedDate={endDate} onChange={setEndDate} minDate={freezeDate} />
            </Grid>
        </Grid></>)
}

const DateSelect = ({ dateType, selectedDate, onChange, minDate, maxDate }: { dateType: string, selectedDate: any, onChange: any, minDate?: any, maxDate?: any }) => {
    return (<>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={dateType}
                format="DD-MM-YYYY"
                value={selectedDate}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
            />
        </LocalizationProvider>
    </>)
}

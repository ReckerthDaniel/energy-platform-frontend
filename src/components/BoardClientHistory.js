import React, { useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import UserService from "../services/user.service";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem, Box } from "@material-ui/core";
import Moment from 'moment';


const BoardClientHistory = props => {
  const [startDate, setStartDate] = useState(new Date());
  const [measurements, setMeasurements] = useState([]);
  const [devices, setDevices] = useState([]);
  const [value, setValue] = useState([]);

  const getMeasurements = (device_id, day) => {
    UserService.getMeasurementByDeviceAndDate(device_id, Moment(day).format("DD-MM-yyyy"))
      .then(response => {
        setMeasurements(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      })
  }
  
  const getCurrentUserDevices = id => {
    UserService.getUserDevices(id)
      .then(response => {
        setDevices(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCurrentUserDevices(props.match.params.id);
  }, [props.match.params.id]);

  useEffect(() => {
    getMeasurements(value, startDate);
  }, [value, startDate]);
  

  let data = []
  let measurementsSorted = measurements.sort((m1, m2) => m2.timestamp - m1.timestamp);
  data = measurementsSorted.map(m => {
    var timestamp = new Date(m.timestamp);
    var hours = timestamp.getHours();
    var minutes = timestamp.getMinutes();
    var id = hours + ":" + minutes;
    let item = {
      name: id,
      h: hours * 60 + minutes,
      kWh: m.energyConsumption,
    }
    return item;
  });
  console.log(data);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  console.log("value ", value);
  console.log("value.id ", value.id);
  return (
    <div>
      
      <div className="block">
        <div>
          <label htmlFor="time">Select date</label>
            <DatePicker
              selected={startDate}
              dateFormat = "yyyy-MM-dd"
              onChange={date => {setStartDate(date)}}
            />
        </div>

        <Box sx={{ minWidth: 120 }}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Device</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={value}
              label="Device"
              onChange={handleChange}
            >
              {devices.map(d => (<MenuItem key = {d.id} value={d.id}> {d.deviceDescription} </MenuItem>))}
            </Select>
          </FormControl>
        </Box>
      </div>


      <div style={styles.container}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis datakey="kWh" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="kWh" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>

        {/* <button onClick={() => {handler();}}> Click me! </button> */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "white",
    width: 500,
    height: 650,
  }
}

export default BoardClientHistory;
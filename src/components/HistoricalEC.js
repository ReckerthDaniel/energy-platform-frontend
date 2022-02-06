import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem, Box } from "@material-ui/core";
import { TextField } from '@material-ui/core';
import { JSONRPCClient } from "json-rpc-2.0";

const API_URL = "https://ds2021-energy-daniel-backend.herokuapp.com/api/";
//const API_URL = "http://localhost:8080/api/";

const client = new JSONRPCClient((jsonRPCRequest) =>
fetch(API_URL + "rpc", {
  method: "POST",
  headers: {
    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken,
    "content-type": "application/json",
  },
  body: JSON.stringify(jsonRPCRequest),
}).then((response) => {
  if (response.status === 200) {
    return response
      .json()
      .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
  } else if (jsonRPCRequest.id !== undefined) {
    return Promise.reject(new Error(response.statusText));
  }
})
);


const HistoricalEC = props => {

  const device_id = props.match.params.id;
  const [baseline, setBaseline] = useState([]);
  const [days, setDays] = useState(7);
  const [historicalEC, setHistoricalEC] = useState([]);

  useEffect(() => {
    client
      .request("historicalEC", { days:days, device_id:device_id })
      .then((result) => {
        console.log(result)
        setHistoricalEC(result)
      });

    client
      .request("baselineEC", { device_id:device_id })
      .then((result) => {
        console.log(result)
        setBaseline(result.map((value,index)=>({index,value})))
      });
  }, [days]);

  return (
    <div>
      <label for="days">Days: </label>
      <input id='days' style={{width: '150px'}} type="number" value={days} onChange={(event) => {
          if(event.target.value>0){
            setDays(event.target.value)
          }
        }
      }/>

      <p>Historical Energy Consumption</p>

      <div style={styles.container}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={historicalEC}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" interval={'preserveStartEnd'}/>
            <YAxis datakey="energyConsumption" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="energyConsumption" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p> Baseline Energy Consumption </p>

      <div style={styles.container}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={baseline}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" interval={'preserveStartEnd'} />
            <YAxis/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
    
    
  );

}

const styles = {
  container: {
    background: "white",
    width: 1000,
    height: 450,
  }
}

export default HistoricalEC;
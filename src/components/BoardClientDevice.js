import React, { useState, useEffect } from "react";
import { forwardRef } from 'react';
import Grid from '@material-ui/core/Grid'

import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import UserService from "../services/user.service";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import {useHistory} from "react-router-dom";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const BoardClientDevice = props => {
  const history = useHistory();

  var columns = [
    {title: "Id", field: "id", hidden: true},
    {title: "Device Description", field: "deviceDescription", cellStyle: {width: 20, maxWidth: 50}, headerStyle: {width: 50, maxWidth: 50}},
    {title: "Sensor Description", field: "sensorDescription"},
    {title: "Sensor max value", field: "sensorMaxValue"},
    {title: "Location", field: "locationAddress"},
    {title: "Max Consumption", field: "maxEnergyConsumption"},
    {title: "Avg. Consumption", field: "baselineEnergyConsumption"},
  ]

  var columnsMeasurement = [
    {title: "Id", field: "id", hidden: true},
    {title: "Energy Consumption", field: "energyConsumption", width: "10%"},
    {title: "Timestamp", field: "timestamp", type: 'datetime'}
  ]

  const [currentUser, setCurrentUser] = useState([]);

  const getCurrentUserDevices = id => {
    UserService.getUserDevices(id)
      .then(response => {
        setCurrentUser(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCurrentUserDevices(props.match.params.id);
  }, [props.match.params.id]);
  

  const [measurements, setMeasurements] = useState([]);

  const getCurrentDeviceMeasurements = id => {
    UserService.getDeviceMeasurements(id)
      .then(response => {
        setMeasurements(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}} >
      <Grid container spacing={1}>
          <Grid item xs={1}></Grid>
          <Grid item xs={20}>
            <MaterialTable
              title="Devices"
              columns={columns}
              data={currentUser}
              icons={tableIcons}
              onRowClick={(event, rowData) => {getCurrentDeviceMeasurements(rowData.id)}}
              actions={[
                {
                  icon: ()=> <ShowChartIcon/>,
                  tooltip: 'Chart',
                  onClick: (event, rowData) => {
                    let path = `/historical-ec/${rowData.id}`;
                    history.push(path);
                  }
                }
              ]}
              detailPanel={(rowData) => {
                return (
                  <MaterialTable
                    options = {{
                      draggable: false,
                      filtering: false,
                      search: false,
                      sorting: false,
                      selectrion: false,
                      paging: false
                    }}
                    title="Measurements"
                    columns={columnsMeasurement}
                    data={measurements}

                  />
                );
      
              }}
            />
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
    </div>
  );
};

export default BoardClientDevice;
import React, { useState, useEffect } from "react";

import EventBus from "../common/EventBus";

import { forwardRef } from 'react';
// import Avatar from 'react-avatar';
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
import Alert from '@material-ui/lab/Alert';
import UserService from "../services/user.service";

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

const BoardUser = () => {


  const [data, setData] = useState([]); //table data
  const [users, setUsers] = useState([]);
  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  useEffect(() => {
    UserService.getDevices().then(
      (response) => {
        setData(response.data);
      },
      (error) => {
        const _data =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

          setData(_data);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  useEffect(() => {
    UserService.getUsers().then(
      (response) => {
        setUsers(response.data);
      },
      (error) => {
        const _data =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

          setUsers(_data);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  const mapped = {};
  users.map(user => {
    const {id, fullName} = user;
    mapped[id] = fullName;
  })

  console.log(mapped);

  var columns = [
    {title: "Id", field: "id", hidden: true},
    {title: "Device Description", field: "deviceDescription", cellStyle: {width: 20, maxWidth: 50}, headerStyle: {width: 50, maxWidth: 50}},
    {title: "Sensor Description", field: "sensorDescription"},
    {title: "Sensor max value", field: "sensorMaxValue"},
    {title: "Location", field: "locationAddress"},
    {title: "Max Consumption", field: "maxEnergyConsumption"},
    {title: "Avg. Consumption", field: "baselineEnergyConsumption"},
    {title: "User", field: "user.id", lookup: mapped}
  ]

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = []
    if(newData.deviceDescription === ""){
      errorList.push("Please enter description")
    }
    if(newData.location === ""){
      errorList.push("Please enter location")
    }
    if(newData.baselineEnergyConsumption === ""){
      errorList.push("Please enter average consumption")
    }

    if(errorList.length < 1){
      UserService.updateDevice(oldData.id, newData)
      .then(res => {
        const dataUpdate = [...data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setData([...dataUpdate]);
        resolve()
        setIserror(false)
        setErrorMessages([])
      })
      .catch(error => {
        setErrorMessages(["Update failed! Server error"])
        setIserror(true)
        resolve()
        
      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }
    
  }

  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = []
    if(newData.deviceDescription === ""){
      errorList.push("Please enter description")
    }
    if(newData.location === ""){
      errorList.push("Please enter location")
    }
    if(newData.baselineEnergyConsumption === ""){
      errorList.push("Please enter average consumption")
    }

    if(errorList.length < 1){ //no error
      UserService.addDevice(newData)
      .then(res => {
        let dataToAdd = [...data];
        dataToAdd.push(newData);
        setData(dataToAdd);
        resolve()
        setErrorMessages([])
        setIserror(false)
      })
      .catch(error => {
        setErrorMessages(["Cannot add data. Server error!"])
        setIserror(true)
        resolve()
      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }

  const handleRowDelete = (oldData, resolve) => {
    
    UserService.deleteDevice(oldData.id)
      .then(res => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }

  return (
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '60vh'}} >
      <Grid container spacing={1}>
          <Grid item xs={1}></Grid>
          <Grid item xs={20}>
          <div>
            {iserror && 
              <Alert severity="error">
                  {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>
                  })}
              </Alert>
            }       
          </div>
            <MaterialTable
              title="Clients"
              columns={columns}
              data={data}
              icons={tableIcons}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                      handleRowUpdate(newData, oldData, resolve);
                      
                  }),
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    handleRowAdd(newData, resolve)
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    handleRowDelete(oldData, resolve)
                  }),
              }}
            />
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
    </div>
  );
};

export default BoardUser;
import React, { useEffect, useState } from "react";
import { listReservations,updateReservation, listTables, delTblSeat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import ReservationTable from "./ReservationTable"
import TablesTable from "./TablesTable";
import {next, today, previous} from "../utils/date-time"
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reloadResTbls, setReloadResTbls] = useState(null)
  const [tableFinishId, setTableFinishId] = useState();
  const [callDelApi, setCallDelApi] = useState(null);
  const [canclResId, setCanclResId] = useState(null);
  const [callResApi, setCallResApi] = useState(null)
  const [apiError, setApiError] = useState(null);
  const [newDate, setNewDate] = useState();
  const query = useQuery();
  const searchDate = query.get("date");

   // react dep [date] omitted to prevent loop; Render once on the value of useQuery()
   useEffect(()=>{
    if(searchDate){
      return setNewDate(searchDate);
    }
    setNewDate(date)
  },[searchDate]);

  const dayButtonHandler = ({ target }) => {

    if(target.name === "previous"){
      setNewDate(previous(newDate));
    };

    if(target.name === "next"){
      setNewDate(next(newDate));
    };

    if(target.name === "today"){
      setNewDate(today(newDate));
    };
  };

  useEffect(loadDashboard, [newDate,date,reloadResTbls]);
  function loadDashboard() {
    const dateObj = {"date": date}
    if(newDate){
      dateObj.date = newDate
    };
    const abortController = new AbortController();
    setApiError(null);
    listReservations(dateObj , abortController.signal)
      .then( data => {
        setReservations(data.filter(res=> res.status === "booked" || res.status === "seated"))
      })
      .catch(error=> setApiError([error]));
    return () => abortController.abort();
  }
  useEffect(loadTables,[reloadResTbls]);
  function loadTables(){
    const abortController  = new AbortController();
    setApiError(null);
    listTables(abortController.signal)
      .then(tableData => {
          setTables(tableData);
          setReloadResTbls(false);
      })
      .catch(error=> setApiError([error]));
    return () => abortController.abort();
  };

  // delete table assignment
  useEffect(()=>{
    if(callDelApi){
      const abortController  = new AbortController();
      setApiError(null);
      delTblSeat(tableFinishId,abortController.signal)
        .then(()=>{
          setCallDelApi(null)
          setTableFinishId(null)
          setReloadResTbls(true)
        })
        .catch(error=> setApiError([error]));
      return () => abortController.abort();
    }
  },[callDelApi,tableFinishId]);


   // need a click handler, a popup, an api call and reRender.
   const finishHandler = (table_id) => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
        setTableFinishId(table_id)
        setCallDelApi(true)
    } 
   };

   const cancelHandler = (reservation_id) => {
     if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
        setCanclResId(reservation_id)
        setCallResApi(true)
     } 
    };

    useEffect(()=>{
      if(callResApi){
        const params = `${canclResId}/status`
        const data = { status: "cancelled" }
        const abortController  = new AbortController();
        setApiError(null);
        updateReservation(params,data,abortController.signal)
          .then(()=>{
            setCallResApi(null)
            setCanclResId(null)
            setReloadResTbls(true)
          })
          .catch(error=> setApiError([error]));
        return () => abortController.abort();
      }
    },[callResApi,canclResId]);

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations</h4>
      </div>
      {
        reservations?
        (<div>
          <button name="previous" className="btn btn-outline-secondary" onClick={dayButtonHandler}>Previous</button>
          <button name="next" className="btn btn-outline-secondary" onClick={dayButtonHandler}>Next</button>
          <button name="today" className="btn btn-outline-secondary" onClick={dayButtonHandler}>Today</button>
        </div>):null
        }
      <div>
      <ErrorAlert error={apiError} />
      </div>
      <div>
      <TablesTable tables={tables} finishHandler={finishHandler} />
      </div>
      <div>
      <ReservationTable reservations={reservations} cancelHandler={cancelHandler} />
      </div>
      {/*JSON.stringify(reservations)*/}
    </main>
  );
}

export default Dashboard;

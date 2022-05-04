import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
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
  const [tables, setTables] = useState([])
  const [apiError, setApiError] = useState(null);
  const [newDate, setNewDate] = useState()
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

  useEffect(loadDashboard, [newDate,date]);
  function loadDashboard() {
    const dateObj = {"date": date}
    if(newDate){
      dateObj.date = newDate
    };
    const abortController = new AbortController();
    setApiError(null);
    listReservations(dateObj , abortController.signal)
      .then(setReservations)
      .catch(setApiError);
    return () => abortController.abort();
  }

  useEffect(loadTables,[]);
  function loadTables(){
    const abortController  = new AbortController();
    setApiError(null);
    listTables(abortController.signal)
      .then(tableData => {
          return setTables(tableData);
      })
      .catch(setApiError)
    return () => abortController.abort();
  };
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations</h4>
      </div>
      <ErrorAlert error={apiError} />
      <div>
      <TablesTable tables={tables} />
      </div>
      <div>
      <ReservationTable reservations={reservations} />
      </div>
      {/*JSON.stringify(reservations)*/}
      {
        reservations?
        (<div>
          <button name="previous" onClick={dayButtonHandler}>Previous</button>
          <button name="next" onClick={dayButtonHandler}>Next</button>
          <button name="today" onClick={dayButtonHandler}>Today</button>
        </div>):null
        }
    </main>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import ReservationTable from "./ReservationTable"
import {next, today, previous} from "../utils/date-time"
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [newDate, setNewDate] = useState()
  const query = useQuery();
  const searchDate = query.get("date")

   // react dep [date] omitted to prevent loop; Render once on the value of useQuery()
   useEffect(()=>{
    if(searchDate){
      return setNewDate(searchDate);
    }
    setNewDate(date)
  },[searchDate]) 

  const dayButtonHandler = ({ target }) => {

    if(target.name === "previous"){
      setNewDate(previous(newDate))
    }
    if(target.name === "next"){
      setNewDate(next(newDate))
    }

    if(target.name === "today"){
      setNewDate(today(newDate))
    }
  };

  useEffect(loadDashboard, [newDate,date]);
  function loadDashboard() {
    const dateObj = {"date": date}
    if(newDate){
      dateObj.date = newDate
    }
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(dateObj , abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationTable reservations={reservations} />
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

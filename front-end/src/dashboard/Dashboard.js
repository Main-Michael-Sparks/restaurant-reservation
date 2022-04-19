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
function Dashboard({ dateProp }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(dateProp)
  const query = useQuery();
  const searchDate = query.get("date")

  const dayButtonHandler = ({ target }) => {
    if(target.name === "previous"){
      setDate(previous(date))
    }
    if(target.name === "next"){
      setDate(next(date))
    }

    if(target.name === "today"){
      setDate(today(date))
    }
  };

  useEffect(()=>{
    if(searchDate){
      setDate(searchDate);
    }
  },[dateProp,searchDate])

  useEffect(loadDashboard, [date]);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
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

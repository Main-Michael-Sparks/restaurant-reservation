import React, { useEffect, useState } from "react";
import { listReservations, updateReservation, listTables, delTblSeat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import ReservationTable from "./ReservationTable";
import TablesTable from "./TablesTable";
import { next, today, previous } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reloadResTbls, setReloadResTbls] = useState(null);
  const [tableFinishId, setTableFinishId] = useState();
  const [callDelApi, setCallDelApi] = useState(null);
  const [canclResId, setCanclResId] = useState(null);
  const [callResApi, setCallResApi] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [newDate, setNewDate] = useState();

  const query = useQuery();
  const searchDate = query.get("date");

  // Set the date as today unless a new reservation is accepted.
  useEffect(() => {
    if (searchDate) {
      return setNewDate(searchDate);
    };
    setNewDate(date);
  }, [searchDate]);

  // Handles the today, next and previous buttons setting the date for reservations to load.  
  const dayButtonHandler = ({ target }) => {
    if (target.name === "previous") {
      setNewDate(previous(newDate));
    };

    if (target.name === "next") {
      setNewDate(next(newDate));
    };

    if (target.name === "today") {
      setNewDate(today(newDate));
    };
  };

  // API Call: Populates the reservation table comp. 
  useEffect(loadDashboard, [newDate, date, reloadResTbls]);
  function loadDashboard() {
    const dateObj = { date: date };
    if (newDate) {
      dateObj.date = newDate;
    };
    const abortController = new AbortController();
    setApiError(null);
    listReservations(dateObj, abortController.signal)
      .then((data) => {
        setReservations(
          data.filter((res) => res.status === "booked" || res.status === "seated")
        );
      })
      .catch((error) => setApiError([error]));
    return () => abortController.abort();
  };

  // API Call: Populates the tables table comp.
  useEffect(loadTables, [reloadResTbls]);
  function loadTables() {
    const abortController = new AbortController();
    setApiError(null);
    listTables(abortController.signal)
      .then((tableData) => {
        setTables(tableData);
        setReloadResTbls(false);
      })
      .catch((error) => setApiError([error]));
    return () => abortController.abort();
  }

  // API Call: Removes table assignment from an reservation.
  useEffect(() => {
    if (callDelApi) {
      const abortController = new AbortController();
      setApiError(null);
      delTblSeat(tableFinishId, abortController.signal)
        .then(() => {
          setCallDelApi(null);
          setTableFinishId(null);
          setReloadResTbls(true);
        })
        .catch((error) => setApiError([error]));
      return () => abortController.abort();
    }
  }, [callDelApi, tableFinishId]);

  // Pop-up warning that triggers the API call to remove table assignment from a reservation.
  const finishHandler = (table_id) => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      setTableFinishId(table_id);
      setCallDelApi(true);
    };
  };

  // Pop-up warning that triggers the API call to cancel a booked reservation. 
  const cancelHandler = (reservation_id) => {
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      setCanclResId(reservation_id);
      setCallResApi(true);
    };
  };

  // API Call: Changes the the status of a reservation to cancelled. 
  useEffect(() => {
    if (callResApi) {
      const params = `${canclResId}/status`;
      const data = { status: "cancelled" };
      const abortController = new AbortController();
      setApiError(null);
      updateReservation(params, data, abortController.signal)
        .then(() => {
          setCallResApi(null);
          setCanclResId(null);
          setReloadResTbls(true);
        })
        .catch((error) => setApiError([error]));
      return () => abortController.abort();
    };
  }, [callResApi, canclResId]);

  return (
    <main className="pb-2 pt-2">
      <h1>Dashboard</h1>
      <div className="pb-1 pt-1">
        <h4>Reservations</h4>
      </div>
      <div>
        <ErrorAlert error={apiError} />
      </div>
      {reservations ? (
        <div>
          <button name="previous" className="btn btn-outline-secondary" onClick={dayButtonHandler}> Previous </button>
          <button name="today" className="btn btn-outline-secondary" onClick={dayButtonHandler}> Today </button>
          <button name="next" className="btn btn-outline-secondary" onClick={dayButtonHandler}> Next </button>
        </div>
      ) : null}
      <div>
        <TablesTable tables={tables} finishHandler={finishHandler} />
      </div>
      <div>
        <ReservationTable reservations={reservations} cancelHandler={cancelHandler} />
      </div>
    </main>
  );
}

export default Dashboard;

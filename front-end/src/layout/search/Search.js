import React from "react";
import ReservationTable from "../../dashboard/ReservationTable";
import { useEffect, useState } from "react";
import { listReservations, updateReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function Search() {

  const initForm = {
    mobile_number: ''
  }
  const initReslt = [];

  /* useEffect deps left out to prevent render loops and other problems */
  const [formData, setFormData] = useState(initForm);
  const [dataToSend, setDataToSend] = useState(null);
  const [srchReslt, setSrchReslt] = useState(initReslt);
  const [apiRes, setApiRes] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [callApi, setCallApi] = useState(null);
  const [reloadResTbls, setReloadResTbls] = useState(null);
  const [canclResId, setCanclResId] = useState(null);
  const [callResApi, setCallResApi] = useState(null);

  // Grabs the form data from inputs and stores the data.
  const formChangeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

// Hands off data to API call
  const formSubmitHandler = (event) => {
    event.preventDefault();
    setDataToSend(formData);
    setCallApi(true);
    setFormData(initForm);
    setApiRes(null);
  };

  // API Call: gets search results from database. 
  useEffect(() => {
    if (callApi || reloadResTbls) {
      const abortController = new AbortController();
      setApiError(null);
      listReservations(dataToSend, abortController.signal)
        .then((data) => {
          setCallApi(null);
          setReloadResTbls(null);
          setSrchReslt(data);
          setApiRes(true);
        })
        .catch(error => setApiError([error]));
      return () => abortController.abort();
    }
  }, [callApi, dataToSend, reloadResTbls]);

  // Pop-up warning that triggers the API call to cancel a booked reservation.
  const cancelHandler = (reservation_id) => {
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      setCanclResId(reservation_id);
      setCallResApi(true);
      setReloadResTbls(null);
    };
  };

  // API Call: Changes the the status of a reservation to cancelled. 
  useEffect(() => {
    if (callResApi) {
      const params = `${canclResId}/status`
      const data = { status: "cancelled" }
      const abortController = new AbortController();
      setApiError(null);
      updateReservation(params, data, abortController.signal)
        .then(() => {
          setCallResApi(null);
          setCanclResId(null);
          setReloadResTbls(true);
        })
        .catch(error => setApiError([error]));
      return () => abortController.abort();
    }
  }, [callResApi, canclResId]);

  return (
    <div className="pb-1 pt-2">
      <h1>Search Reservations</h1>
      {apiError ? <ErrorAlert error={apiError} /> : null}
      <form className="form-floating" onSubmit={formSubmitHandler}>
        <label htmlFor="mobile_number" className="form-label">Mobile Number:</label>
        <input name="mobile_number" id="mobile_number" className="form-control" type="text" placeholder="Enter a customer's phone number" value={formData.mobile_number} onChange={formChangeHandler} required />
        <button type="submit" className="btn btn-outline-secondary mt-1">Search</button>
      </form>
        {apiRes && srchReslt.length > 0 ? <ReservationTable reservations={srchReslt} cancelHandler={cancelHandler} /> :
        apiRes && srchReslt.length === 0 ? (<p className="mt-2">No reservations found</p>) : null}
    </div>
  )
};


export default Search;
import React from "react";
import ReservationTable from "../../dashboard/ReservationTable";
import {useEffect, useState} from "react";
import { listReservations, updateReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function Search(){

    const initForm = {
        mobile_number: ''
    }
    const initReslt = [];

    const [formData, setFormData] = useState(initForm);
    const [dataToSend, setDataToSend] = useState(null)
    const [srchReslt, setSrchReslt] = useState(initReslt);
    const [apiRes, setApiRes] = useState(null)
    const [apiError, setApiError] = useState(null)
    const [callApi, setCallApi] = useState(null)
    const [reloadResTbls, setReloadResTbls] = useState(null)
    const [canclResId, setCanclResId] = useState(null);
    const [callResApi, setCallResApi] = useState(null)

    // captures data from user input
    const formChangeHandler = ({target}) => {
        setFormData({
            ...formData,
            [target.name]:target.value,
        });
    };

     // handles the form submit process
     const formSubmitHandler = (event) => {
        event.preventDefault();
        setDataToSend(formData);
        setCallApi(true);
        setFormData(initForm);
        setApiRes(null)
    };

    // gets the search results from db
    useEffect(()=>{
        if(callApi || reloadResTbls) {
        const abortController = new AbortController();
        setApiError(null);
        listReservations(dataToSend, abortController.signal)
          .then((data)=>{
              setCallApi(null)
              setReloadResTbls(null)
              setSrchReslt(data)
              setApiRes(true)
            })
          .catch(error=> setApiError([error]));
        return () => abortController.abort();
        }
    },[callApi,dataToSend,reloadResTbls]);

    // handles cancel reservation
    const cancelHandler = (reservation_id) => {
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
           setCanclResId(reservation_id)
           setCallResApi(true)
           setReloadResTbls(null)
        } 
    };

    // updates reservation status
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

    return(
        <div className="pb-1 pt-2">
            <h1>Search Reservations</h1>
            {apiError?<ErrorAlert error={apiError} />:null}
            <form onSubmit={formSubmitHandler}>
                <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                <br />
                <input name="mobile_number" id="mobile_number" className="form-control" type="text" placeholder="Enter a customer's phone number" value={formData.mobile_number} onChange={formChangeHandler} />
                <button type="submit" className="btn btn-outline-secondary mt-1">Search</button>
            </form>
           {apiRes && srchReslt.length > 0?<ReservationTable reservations={srchReslt} cancelHandler={cancelHandler} />:
           apiRes && srchReslt.length == 0? (<p>No reservations found</p>): null }
        </div>
    )
};


export default Search;
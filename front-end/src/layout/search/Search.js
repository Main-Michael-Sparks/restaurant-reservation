import React from "react";
import ReservationTable from "../../dashboard/ReservationTable";
import {useEffect, useState} from "react";
import { listReservations } from "../../utils/api";
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

    useEffect(()=>{
        if(callApi) {
        const abortController = new AbortController();
        setApiError(null);
        listReservations(dataToSend, abortController.signal)
          .then((data)=>{
              setCallApi(null)
              setSrchReslt(data)
              setApiRes(true)
            })
          .catch(error=> setApiError([error]));
        return () => abortController.abort();
        }
    },[callApi,dataToSend]);

    return(
        <div>
            <h1>Search Reservations</h1>
            {apiError?<ErrorAlert error={apiError} />:null}
            <form onSubmit={formSubmitHandler}>
                <label htmlFor="mobile_number">Mobile Number</label>
                <br />
                <input name="mobile_number" id="mobile_number" type="text" placeholder="Enter a customer's phone number" value={formData.mobile_number} onChange={formChangeHandler} /><button type="submit">Find</button>
            </form>
           {apiRes && srchReslt.length > 0?<ReservationTable reservations={srchReslt} />:
           apiRes && srchReslt.length == 0? (<p>No reservations found</p>): null }
        </div>
    )
};


export default Search;
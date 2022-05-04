import React from "react";
import {useState, useEffect} from "react"
import { useParams,useHistory } from "react-router";
import { listTables, readReservation } from "../../utils/api";

function Seat(){

    const initForm = {
        table_id:""
    }

    const [formData, setFormData] = useState(initForm)
    const [tables, setTables] = useState([])
    const [reservation, setReservation] = useState([])
    const [apiError, setApiError] = useState(null)
    const { reservationId } = useParams();
    const history = useHistory();

    //validation on capacity. 

    //need route to assign reservationFK 

 
    // cancel button handler
    const cancelHandler = () => {
        setFormData({...initForm});
        return history.goBack();
    };

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

    useEffect(loadReservation,[]);
    function loadReservation(){
      const abortController  = new AbortController();
      setApiError(null);
      readReservation(reservationId, abortController.signal)
        .then(resData => {
            return setReservation(resData);
        })
        .catch(setApiError)
      return () => abortController.abort();
    };

    return (
        <div>
            <h1>Seat Table</h1>
            <h2>{`#${reservation.reservation_id} - ${reservation.first_name} ${reservation.first_name} on ${reservation.reservation_date} at ${reservation.reservation_time} for ${reservation.people}`}</h2>
        <form>
            <label htmlFor="seatTable">Table Number:</label>
            <br />
            <select id="table_id" name="seatTable">
                <option value="" disabled selected>Select a table</option>
                {tables?tables.map(table=>{
                    return (
                        <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                    )
                }):null}
            </select>
            <br />
            <button type="cancel" onClick={cancelHandler}>Cancel</button><button type="submit">Submit</button>
        </form>
        </div>
    )
}

export default Seat
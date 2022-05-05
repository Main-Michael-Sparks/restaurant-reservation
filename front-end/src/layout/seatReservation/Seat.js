import React from "react";
import {useState, useEffect} from "react"
import { useParams,useHistory } from "react-router";
import { listTables, readReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert.js"

function Seat(){

    const initForm = {
        table_id:"",
    }
    const initErrors = [];

    const [formData, setFormData] = useState(initForm)
    const [tables, setTables] = useState([])
    const [reservation, setReservation] = useState([])
    const [dataToPost, setDataToPost] = useState(null);
    const [dataToValidate, setDataToValidate] = useState(initForm);
    const [dataValidationStage, setDataValidationStage] = useState(null);
    const [dataIsValid, setDataIsValid] = useState(null)
    const [activeErrorState, setActiveErrorState] = useState(null);
    const [displayError, setDisplayError] = useState(initErrors)
    const [errorHandoff, setErrorHandoff] = useState(null);
    const [errorStateComplete, setErrorStateComplete] = useState(null);
    const [dataValidationComplete, setDataValidtionComplete] = useState(null);
    const { reservationId } = useParams();
    const history = useHistory();

    // grabs user input from the form
    const formChangeHandler = ({target}) => {
        setFormData({ [target.name]:target.value });
    };

    // cancel button handler
    const cancelHandler = () => {
        setFormData({...initForm});
        return history.goBack();
    };

    // load all tables 
    useEffect(loadTables,[]);
    function loadTables(){
      const abortController  = new AbortController();
      listTables(abortController.signal)
        .then(tableData => {
            return setTables(tableData);
        })
        .catch(error => {
            setDisplayError([error]);
            setActiveErrorState(true);
        });
      return () => abortController.abort();
    };

    // load active reservation
    useEffect(loadReservation,[]);
    function loadReservation(){
      const abortController  = new AbortController();
      readReservation(reservationId, abortController.signal)
        .then(resData => {
            return setReservation(resData);
        })
        .catch(error => {
            setDisplayError([error]);
            setActiveErrorState(true);
        });
      return () => abortController.abort();
    };

    // handles the form submit process
    const formSubmitHandler = (event) => {

        event.preventDefault();
            // error & validation cleanup
         if(errorStateComplete){
            setActiveErrorState(null);
            setErrorHandoff(null);
            setDataValidationStage(null);
            setDataValidtionComplete(null);
            setErrorStateComplete(null);
        }; 
    
        setDataToValidate({
            table_id: Number(formData.table_id)
        });
    
        setDataValidationStage(true)
    
    };

    // validates form data
    useEffect(()=>{
        if(dataValidationStage){
            const selectedTable = tables.find(table => dataToValidate.table_id == table.table_id);
            if(formData.table_id === '') {
                setDisplayError([{
                    message: "please select a table"
                }])
            }

            if(selectedTable && selectedTable.capacity < reservation.people){
                setDisplayError([{
                    message: "selected table is not big enough for reservation size"
                }])
            }
            setDataValidtionComplete(true)
        };
    },[dataValidationStage,dataToValidate])

    // sends valid data to api or errors to render
    useEffect(()=>{
        if(dataValidationComplete){
            if (displayError.length) {
                setActiveErrorState(true);
                setDataIsValid(false);

            } else {
               setActiveErrorState(false)
               setDataIsValid(true);
            };
        };
    },[dataValidationComplete]);

    // directs error traffic to ErrorAlert comp and triggers error var clean up. 
    useEffect(()=>{
        if(activeErrorState){
            setErrorHandoff(displayError);
            setDisplayError(initErrors);
            setFormData(initForm)
            setErrorStateComplete(true);
        };
    },[activeErrorState]);
    
    // directs form data traffic to api call if form data passes validation. 
    useEffect(()=>{
        if(dataIsValid){
            setDataToPost({
                table_id:formData.table_id,
                reservation_id: reservation.reservation_id
            });
        };
    
    },[dataIsValid]);


    //console.log API for testing validated data send off
    useEffect(()=>{
        if(dataToPost){
            console.log("validated data is ready to send", dataToPost)
        }
    },[dataToPost])

    return (
        <div>
            <h1>Seat Table</h1>
            <h2>{`#${reservation.reservation_id} - ${reservation.first_name} ${reservation.first_name} on ${reservation.reservation_date} at ${reservation.reservation_time} for ${reservation.people}`}</h2>
            {activeErrorState && errorHandoff? <ErrorAlert error={errorHandoff} />:null}
        <form onSubmit={formSubmitHandler}>
            <label htmlFor="table_id">Table Number:</label>
            <br />
            <select id="table_id" name="table_id" value={formData.table_id} onChange={formChangeHandler}>
                        <option value={null} >Select a table</option>
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
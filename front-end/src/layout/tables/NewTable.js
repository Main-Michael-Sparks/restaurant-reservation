import React from "react";
import {useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import {createTable} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function NewTable(){

    const initForm = {
        table_name:"",
        capacity:""
    };
    const initErrors = []

    const [formData, setFormData] = useState(initForm);
    const [dataToPost, setDataToPost] = useState(null);
    const [dataToValidate, setDataToValidate] = useState(initForm);
    const [dataValidationStage, setDataValidationStage] = useState(null);
    const [dataIsValid, setDataIsValid] = useState(null)
    const [activeErrorState, setActiveErrorState] = useState(null);
    const [displayError, setDisplayError] = useState(initErrors)
    const [errorHandoff, setErrorHandoff] = useState(null);
    const [errorStateComplete, setErrorStateComplete] = useState(null);
    const [dataValidationComplete, setDataValidtionComplete] = useState(null);
    
    
    // cancel button handler
    const cancelHandler = () => {
        setFormData({...initForm});
        return history.goBack();
    }; 

    // captures form data
    const formChangeHandler = ({target}) => {
        setFormData({
            ...formData,
            [target.name]:target.value,
        });

        if (target.name === "capacity"){
            setFormData({
                ...formData,
                [target.name]: Number(target.value)
            });
        };
    };

    /*const formSubmitHandler = (event) => {

        event.preventDefault();
        if(errorsComplete){
            setActiveErrorState(false);
            setErrorHandover(null);
            setErrorsComplete(null);
            setDataValidationStage(false);
            setDataValidtionComplete(false);
            setErrorsComplete(null)
         };

        setDataToValidate({...formData,
             people: Number(formData.people)
        });

        setDataValidationStage(true)
    }; */

    


   /* useEffect(() => {
        if (dataToPost){
        const abortController = new AbortController();
        createReservation(dataToPost,abortController.signal)
            .then(resObj =>{
                if(resObj.reservation_date){
                    const date = resObj.reservation_date;
                    setDataToPost(null);
                    history.push(`/dashboard?date=${date}`);
                };
                return resObj
            })
            .catch();
        return () => abortController.abort()
        };
      }, []); */


    return (
        <div>
            <h1>New Table</h1>
            <form onSubmit={null}>
                <label htmlFor="table_name">Table Name:</label>
                <br/>
                <input name="table_name" type="text" id="table_name" placeholder="Enter table name" onChange={formChangeHandler} value={formData.table_name} required />
                <br/>
                <label htmlFor="capacity" min="1">Capacity:</label>
                <br/>
                <input name="capacity" type="number" id="capacity" placeholder="Number of people" onChange={formChangeHandler} value={null} required/>
                <br/>
                <br/>
                <button type="cancel" onClick={cancelHandler}>Cancel</button><button type="submit">Submit</button>
            </form>
        </div>
    )
}


export default NewTable;
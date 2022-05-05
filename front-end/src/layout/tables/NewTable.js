import React from "react";
import {useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import {createTable} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function NewTable(){

    const initForm = {
        table_name:"",
        capacity:""
        //possibly add seated here.
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
    
    const history = useHistory();
    
    // Cancel button handler
    const cancelHandler = () => {
        setFormData({...initForm});
        return history.goBack();
    }; 

    // Captures form data
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

        setDataToValidate({...formData,
             capacity: Number(formData.capacity)
        });

        setDataValidationStage(true)

    };

    useEffect(()=>{
        if(dataValidationStage){

            if(!dataToValidate.table_name){
                if(!displayError.find(errMsg => errMsg.message === "Table_name cannot be empty or missing")){
                    setDisplayError([
                       ...displayError,
                       {message: "Table_name cannot be empty or missing"}
                   ]);
                }
            };

            if(dataToValidate.table_name && dataToValidate.table_name.length == 1){
                if(!displayError.find(errMsg => errMsg.message === "Table_name must be longer than one chacter")){
                    setDisplayError([
                       ...displayError,
                       {message: "Table_name must be longer than one chacter"}
                   ]);
                }
            };

            if(!dataToValidate.capacity){
                if(!displayError.find(errMsg => errMsg.message === "Capacity cannot be missing, and greater than zero")){
                    setDisplayError([
                    ...displayError,
                    {message: "Capacity cannot missing, or less than zero"}
                ]);
                }
            };

            if(isNaN(dataToValidate.capacity)){
                if(!displayError.find(errMsg => errMsg.message === "Capacity must be a number")){
                    setDisplayError([
                    ...displayError,
                    {message: "Capacity must be a number"}
                ]);
                };
            };

            setDataValidtionComplete(true)
        }

    },[dataValidationStage,dataToValidate]);

    // sends data to api call or error handler depending on result of validation
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
            setErrorStateComplete(true);
        };
    },[activeErrorState]);

    // directs form data traffic to api call if form data passes validation. 
    useEffect(()=>{
        if(dataIsValid){
            setDataToPost(dataToValidate);

        };

    },[dataIsValid]);

    // api call
    useEffect(() => {
 
        if (dataToPost){
        const abortController = new AbortController();
        createTable(dataToPost,abortController.signal)
            .then(apiResponse => {
                if(apiResponse.table_id){
                    setDataToPost(null);
                    history.push(`/dashboard`);
                };
                return apiResponse;
            }) 
            .catch(error => {
                setDisplayError([error]);
                setActiveErrorState(true);
            });
        return () => abortController.abort()
        };
      },[dataToPost]);


    return (
        <div>
            <h1>New Table</h1>
            {activeErrorState && errorHandoff? <ErrorAlert error={errorHandoff} />:null}
            <form onSubmit={formSubmitHandler}>
                <label htmlFor="table_name">Table Name:</label>
                <br/>
                <input name="table_name" type="text" id="table_name" placeholder="Enter table name" onChange={formChangeHandler} value={formData.table_name} />
                <br/>
                <label htmlFor="capacity" min="1">Capacity:</label>
                <br/>
                <input name="capacity" type="number" id="capacity" placeholder="Number of people" onChange={formChangeHandler} value={null} />
                <br/>
                <br/>
                <button type="cancel" onClick={cancelHandler}>Cancel</button><button type="submit">Submit</button>
            </form>
        </div>
    )
}


export default NewTable;
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import { convertTime } from "../../utils/convertTime";
import ReservationForm from "./ReservationForm";

function NewReservation(){

    const initForm = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    };
    const initErrors = [];

    // State variables and other hooks.
    const [formData, setFormData] = useState(initForm);
    const [dataToPost, setDataToPost] = useState(null);
    const [dataToValidate, setDataToValidate] = useState(initForm)
    const [resDate, setResDate] = useState(null);
    const [displayError, setDisplayError] = useState(initErrors);
    const [errorHandover, setErrorHandover] = useState(null);
    const [activeErrorState, setActiveErrorState] = useState(false);
    const [errorsComplete, setErrorsComplete] = useState(null);
    const [dataIsValid, setDataIsValid] = useState(null);
    const [dataValidationStage, setDataValidationStage] = useState(false);
    const [dataValidationComplete, setDataValidtionComplete] = useState(false);

    const history = useHistory();
    const currentDay = new Date();
    const resTime = convertTime(dataToValidate.reservation_time,true);
    const curTime = convertTime(`${currentDay.getHours()}:${currentDay.getMinutes()}`,true);

    // Sets the reservations which triggers the form data validation. 
    useEffect(()=>{
        if(dataValidationStage){
            const resDateFormat = dataToValidate.reservation_date.split("-")
            setResDate(new Date(resDateFormat[0],resDateFormat[1]-1,resDateFormat[2]));
        };
    },[dataValidationStage,dataToValidate]);

    // Validates time and date storing any errors into an array for rendering. 
    useEffect(()=>{
        if(resDate){

            if(resDate.getDay() === 2){
                setDisplayError([{message: "Reservation cannot be on Tuesday"}]);
            };

            if(((((resDate.getTime()/1000)/60)/60) - (((currentDay.getTime()/1000)/60)/60)) < (-24)){
                setDisplayError([{message: "Reservation must be in the future"}]);
            };

            if(resDate.getDay() === 2 && resDate.getTime() < currentDay.getTime()){
                 setDisplayError([
                    {message: "Reservation cannot be on Tuesday"},
                    {message: "Reservation must be in the future"}
                ]);
            };
        };

        if(resTime.length){

            if(resTime[0] < ((10*60)+30)){
                if(!displayError.find(errMsg => errMsg.message === "Reservation time must be when we are open.")){
                     setDisplayError([
                        ...displayError,
                        {message: "Reservation time must be when we are open."}
                    ]);
                };
            };

            if (resTime[0] > ((21*60)+30)) {
                if(!displayError.find(errMsg => errMsg.message === "Reservation time must be before we close.")){
                    setDisplayError([
                        ...displayError,
                        {message: "Reservation time must be before we close."}
                    ]);
                };
            };
        };

        if(resDate && resTime.length){

            if(!(((((resDate.getTime()/1000)/60)/60) - (((currentDay.getTime()/1000)/60)/60)) > (24)) && 
            (((resTime[0] < ((10*60)+30)) || (resTime[0] > ((21*60)+30))) || (resTime[0] < curTime[0]))){

                if(!displayError.find(errMsg => errMsg.message === "Reservation time must be in the future")){
                    setDisplayError([
                        ...displayError,
                        {message: "Reservation time must be in the future"}
                    ]);
                };
            };
        };

        if(resDate) {
            setDataValidtionComplete(true);
        };

    },[dataToValidate,resDate]);

    // Starts the error state or starts the API call for valid data.
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

    // Cancel button handler sends user back to previous page.
    const cancelHandler = () => {
        setFormData({...initForm});
        return history.goBack();
    };

    // Grabs the form data from inputs and stores the data.
    const formChangeHandler = ({target}) => {
        setFormData({
            ...formData,
            [target.name]:target.value,
        });

        if (target.name === "people"){
            setFormData({
                ...formData,
                [target.name]: Number(target.value)
            });
        };
    };

    // Starts the form data validation process and cleans up previous data submit attempts. 
    const formSubmitHandler = (event) => {

        event.preventDefault();
        if(errorsComplete){
            setActiveErrorState(false);
            setErrorHandover(null);
            setErrorsComplete(null);
            setDataValidationStage(false);
            setDataValidtionComplete(false);
            setErrorsComplete(null);
         };

        setDataToValidate({...formData,
             people: Number(formData.people)
        });

        setDataValidationStage(true);
    };

  // Error state handler: delivers errors to ErrorAlert and begins cleaning up error state variables. 
    useEffect(()=>{
        if(activeErrorState){
            setErrorHandover(displayError);
            setDisplayError(initErrors);
            setResDate(null);
            setErrorsComplete(true);
        };
    },[activeErrorState]);

  // Hands validated form data off to the 'create' API call.
    useEffect(()=>{
        if(dataIsValid){
            setDataToPost(dataToValidate)
        };

    },[dataIsValid]);

    // API Call: Creates new reservations with validate form data. 
    useEffect(() => {
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
            .catch(error=>{
                setDisplayError([error])
                setActiveErrorState(true);
            });
        return () => abortController.abort();
        };
      }, [dataToPost,history]);

    return (
        <div className="pt-2 pb-3">
            <h1>Create New Reservation</h1>
            { activeErrorState && errorHandover?<ErrorAlert error={errorHandover}/>: null }
            <ReservationForm formData={formData} formChangeHandler={formChangeHandler} formSubmitHandler={formSubmitHandler} cancelHandler={cancelHandler}/>
        </div>
    )

};


export default NewReservation;
import React from "react";
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {createReservation} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import {today} from "../../utils/date-time";
import {convertTime} from "../../utils/convertTime";
import ReservationForm from "./ReservationForm";

function NewReservation(){

    //initial state for state variables
    const initForm = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    };
    const initValidForm = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",

    };

    const initErrors = [];

    //state variables and other hooks
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
    //const formatToday = today().split("-")
    const currentDay = new Date(/*formatToday[0],formatToday[1] - 1,formatToday[2]*/); //removed today() fucntion
    const resTime = convertTime(dataToValidate.reservation_time,true);
    const curTime = convertTime(`${currentDay.getHours()}:${currentDay.getMinutes()}`,true);
    //console.log("current Time hours",currentDay.getHours(),"current time mins",currentDay.getMinutes() )
    //console.log("current day",currentDay, "res",resDate)
    //console.log('currentDay Get TIme',currentDay.getTime())

    // sets stage for form validation: reservation date to check
    useEffect(()=>{
        if(dataValidationStage){
            const resDateFormat = dataToValidate.reservation_date.split("-")
            setResDate(new Date(resDateFormat[0],resDateFormat[1]-1,resDateFormat[2]/*dataToValidate.reservation_date*/));
            console.log("res Date from form",dataToValidate.reservation_date)
        };
    },[dataValidationStage,dataToValidate]);

    // validates reservation time and date, stores any validation failures into an array
    useEffect(()=>{
        if(resDate){

            if(resDate.getDay() === 2/*chaned from one*/){
                setDisplayError([{message: "Reservation cannot be on Tuesday"}]);
            };

            if(((((resDate.getTime()/1000)/60)/60) - (((currentDay.getTime()/1000)/60)/60)) < (-24)/*resDate.getTime() < currentDay.getTime()*/){
                console.log("res in future",((((resDate.getTime()/1000)/60)/60) - (((currentDay.getTime()/1000)/60)/60)) < (-24))
                setDisplayError([{message: "Reservation must be in the future"}]);
            };

            if(resDate.getDay() === 2/*chaned from one*/ && resDate.getTime() < currentDay.getTime()){
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
            if(!(((((resDate.getTime()/1000)/60)/60) - (((currentDay.getTime()/1000)/60)/60)) > (24)) /*&& ((((resDate.getTime()/1000)/60)/60) - (((currentDay.getTime()/1000)/60)/60)) > (-24)*//*(resDate.getTime() === currentDay.getTime())*/ && (((resTime[0] < ((10*60)+30)) || (resTime[0] > ((21*60)+30))) || (resTime[0] < curTime[0]))){
                console.log("reservation Evalutation",((((resDate.getTime()/1000)/60)/60) - (((currentDay.getTime()/1000)/60)/60)))
                console.log("reservation time",resTime[0], "current time",curTime[0])
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

    // post validation: either actives send off to ErrorAlert comp or api call. 
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

    // cancel button handler
    const cancelHandler = () => {
        setFormData({...initForm});
        return history.goBack();
    };

    // grabs user input from the form
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

    // starts the form data validation process, and cleans up previous data submit attempts. 
    const formSubmitHandler = (event) => {

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
    };

    // sends error array to ErrorAlert Comp and begins cleaning up error handler state vars. 
    useEffect(()=>{
        if(activeErrorState){
            setErrorHandover(displayError);
            setDisplayError(initErrors);
            setResDate(null);
            setErrorsComplete(true);
        };
    },[activeErrorState]);

    // if form data passes validation this sends the formData to the api
    useEffect(()=>{
        if(dataIsValid){
            setDataToPost(dataToValidate)
        };

    },[dataIsValid]);

    // api call to send send form data over, and catch any server side errors for ErrorAlert to render. 
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
        return () => abortController.abort()
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
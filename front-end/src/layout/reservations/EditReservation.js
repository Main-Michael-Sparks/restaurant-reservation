import React from "react"
import ReservationForm from "./ReservationForm"
import ErrorAlert from "../ErrorAlert";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { readReservation, updateReservation } from "../../utils/api";


function EditReservation(){
 //PROPS FOR RESFORM
 //formData={formData} formChangeHandler={formChangeHandler} formSubmitHandler={formSubmitHandler}  cancelHandler={cancelHandler}
 // GET /reservations/:reservationID
 // PUT /reservations/:resrvationsID
 // copy-paste create validation/functionaility
    const initForm = {

        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    }
    const [formData, setFormData] = useState(initForm);
    const [dataToPut, setDataToPut] = useState(null)
    const [apiErrors, setApiErrors] = useState(null)
    const history = useHistory();
    const { reservationId } = useParams();
    
    //API GET request for reservation to edit 
    useEffect(()=>{
        const abortController = new AbortController();
        setApiErrors(null);
        readReservation(reservationId,abortController.signal)
            .then(setFormData)
            .catch(error=>setApiErrors([error]));
        return () => abortController.abort()
    },[reservationId])

    const formSubmitHandler = (event) => {
        event.preventDefault();
      /*  if(errorsComplete){
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

        setDataValidationStage(true) */
    };

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

    
    return (
        <div>
        <h1>Edit Reservation</h1>
        {apiErrors? <ErrorAlert error={apiErrors}/>:null}
        <ReservationForm formData={formData} formChangeHandler={formChangeHandler} formSubmitHandler={formSubmitHandler}  cancelHandler={cancelHandler} /> 
        </div>
    )
}

export default EditReservation
import React from "react";
import {useEffect, useState} from "react"; //might need to check syntax
import {useHistory} from "react-router-dom";
import {createReservation} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import {today} from "../../utils/date-time";
import {convertTime} from "../../utils/convertTime";

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

    const initErrors = [];

    //state variables and other hooks
    const [formData, setFormData] = useState(initForm);
    const [dataToPost, setDataToPost] = useState(null);
    const [resDate, setResDate] = useState(null);
    const [displayError, setDisplayError] = useState(initErrors);
    const [errorHandover, setErrorHandover] = useState(null);
    const [activeErrorState, setActiveErrorState] = useState(false);

    const history = useHistory();
    const currentDay = new Date(today());
    const resTime = convertTime(formData.reservation_time);

    //reservation date validation
    useEffect(()=>{
        if(formData.reservation_date){
            setResDate(new Date(formData.reservation_date));
        };

        if(resDate){
            if(resDate.getDay() === 1 && resDate.getTime() < currentDay.getTime()){
                return setDisplayError([
                    {message: "Reservation cannot be on Tuesday"},
                    {message: "Reservation must be in the future"}
                ]);
            };

            if(resDate.getDay() === 1){
                return setDisplayError([{message: "Reservation cannot be on Tuesday"}]);

            };

            if(resDate.getTime() < currentDay.getTime()){
                return setDisplayError([{message: "Reservation must be in the future"}]);
            };
        };

        if(resTime.length){
            if(resTime[0] <= 10 && resTime[1] <= 30){
                if(!displayError.find(errMsg => errMsg.message === "Reservation time must be when we are open.")){
                    return setDisplayError([
                        ...displayError,
                        {message: "Reservation time must be when we are open."}
                    ]);
                } else {
                    return null;
                }
            };

            if (resTime[0] >= 21 && resTime[1] >= 30) {
                if(!displayError.find(errMsg => errMsg.message === "Reservation time must be before we close.")){
                    setDisplayError([
                        ...displayError,
                        {message: "Reservation time must be before we close."}
                    ]);
                } else {
                    return null;
                }
            };
        };

    },[formData]);

    // cancel button handler
    const cancelHandler = () => {
        setFormData({...initForm});
        return history.goBack();
    };

    //grabs user input from the form
    const formChangeHandler = ({target}) => {
        setFormData({
            ...formData,
            [target.name]:target.value,
        });
        if (target.name === "people"){
            setFormData({
                ...formData,
                [target.name]: Number(target.value)
            })
        }
    };

    // gets form data ready to be sent off to api
    const formSubmitHandler = (event) => {
        event.preventDefault();
        if(!displayError.length) {
            setActiveErrorState(false)
            setFormData({...formData,
                people: Number(formData.people)
            })
            setDataToPost(formData);
            setFormData({...initForm});
        }
        if (displayError.length) {
            setActiveErrorState(true);
            setFormData({...formData,
                "reservation_date":initForm.reservation_date
            });
        }
    };

    // validation error(s) handler
    useEffect(()=>{
        if(activeErrorState){
            setErrorHandover(displayError);
            setDisplayError(initErrors);
            setResDate(null);
        }

    },[activeErrorState]) 

    //api call
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
            .catch(error=>setDisplayError([error]));
        return () => abortController.abort()
        };
      }, [dataToPost,history]);

    return (
        <div>
            <h1>Create New Reservation</h1>
            { activeErrorState && errorHandover?<ErrorAlert error={errorHandover}/>: null }
            <form onSubmit={formSubmitHandler}>
                <label htmlFor="first_name">First Name:</label> 
                <br/>
                <input name="first_name" type="text" id="first_name" placeholder="Enter first name" onChange={formChangeHandler} value={formData.first_name} required />
                <br/>
                <label htmlFor="last_name">Last Name:</label>
                <br/>
                <input name="last_name" type="text" id="last_name" placeholder="Enter last name" onChange={formChangeHandler} value={formData.last_name} required/>
                <br/>
                <label htmlFor="mobile_number">Mobile Number:</label>
                <br/>
                <input type="text" id="mobile_number" name="mobile_number" placeholder="Enter mobile number" onChange={formChangeHandler} value={formData.mobile_number} required/>
                <br/>
                {/*might need to come back and fix format and inputs for date/time */}
                <label htmlFor="reservation_date">Date of Reservation:</label>
                <br/>
                <input name="reservation_date" type="date" id="reservation_date" placeholder="Enter reservation date" onChange={formChangeHandler} value={formData.reservation_date} required/>
                <br/>
                <label htmlFor="reservation_time">Time of Reservation:</label>
                <br/>
                <input name="reservation_time" type="time" id="reservation_time" placeholder="Enter reservation time" onChange={formChangeHandler} value={formData.reservation_time} required/>
                <br />
                <label htmlFor="people" min="1" >Number of people in the party:</label>
                <br/>
                <input name="people" type="number" id="people" placeholder="Enter number of people" onChange={formChangeHandler} value={formData.people} required/>
                <br />
                <br />
                <button type="cancel" onClick={cancelHandler}>Cancel</button><button type="submit">Submit</button>
            </form>
        </div>
    )

};


export default NewReservation;
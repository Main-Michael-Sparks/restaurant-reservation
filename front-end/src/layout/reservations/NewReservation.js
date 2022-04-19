import React from "react";
import {useEffect, useState} from "react"; //might need to check syntax
import {useHistory} from "react-router-dom"
import {createReservation} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function NewReservation(){

    const initForm = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",

    };

    const [formData, setFormData] = useState(initForm);
    const [dataToPost, setDataToPost] = useState(null);
    const [displayError, setDisplayError] = useState(null)
    const history = useHistory();

    const cancelHandler = () => {
        setFormData({...initForm});
        return history.goBack();
    };

    const formChangeHandler = ({target}) => {
        setFormData({
            ...formData,
            [target.name]:target.value
        });
    };

    const formSubmitHandler = (event) => {
        event.preventDefault();
        setDataToPost(formData);
        setFormData({...initForm});
    };

    useEffect(() => {
        if (dataToPost){
        const abortController = new AbortController();
        createReservation(dataToPost,abortController.signal)
            .then(returnArray =>{
                if(returnArray.length){
                    const date = dataToPost.reservation_date;
                    setDataToPost(null);
                    history.push(`/dashboard?date=${date}`)
                };
                return returnArray;
            })
            .catch(setDisplayError);
        return () => abortController.abort()
        };
      }, [dataToPost,history]);

    return (
        <div>
            <h1>Create New Reservation</h1>
            {displayError?<ErrorAlert error={displayError}/>:null}
            <form onSubmit={formSubmitHandler}>
                <label htmlFor="first_name">First Name:</label> 
                <br/>
                <input type="text" id="first_name" name="first_name" placeholder="Enter first name" onChange={formChangeHandler} value={formData.first_name} required />
                <br/>
                <label htmlFor="last_name">Last Name:</label>
                <br/>
                <input type="text" id="last_name" name="last_name" placeholder="Enter last name" onChange={formChangeHandler} value={formData.last_name} required/>
                <br/>
                <label htmlFor="mobile_number">Mobile Number:</label>
                <br/>
                <input type="text" id="mobile_number" name="mobile_number" placeholder="Enter mobile number" onChange={formChangeHandler} value={formData.mobile_number} required/>
                <br/>
                {/*might need to come back and fix format and inputs for date/time */}
                <label htmlFor="reservation_date">Date of Reservation:</label>
                <br/>
                <input type="date" id="reservation_date" name="reservation_date" placeholder="Enter reservation date" onChange={formChangeHandler} value={formData.reservation_date} required/>
                <br/>
                <label htmlFor="reservation_time">Time of Reservation:</label>
                <br/>
                <input type="time" id="reservation_time" name="reservation_time" placeholder="Enter reservation time" onChange={formChangeHandler} value={formData.reservation_time} required/>
                <br />
                <label htmlFor="people" min="1" >Number of people in the party:</label>
                <br/>
                <input type="number" id="people" name="people" placeholder="Enter number of people" onChange={formChangeHandler} value={formData.people} required/>
                <br />
                <br />
                <button type="cancel" onClick={cancelHandler}>Cancel</button><button type="submit">Submit</button>
            </form>
        </div>
    )

};


export default NewReservation;
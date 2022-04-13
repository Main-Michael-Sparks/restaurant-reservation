import React from "react";
import {useEffect, useState} from "react"; //might need to check syntax




function NewReservation(){

    const initForm = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",

    }

    const [formData, setFormData] = useState(initForm);

    const formChangeHandler = ({target}) => {
        setFormData({
            ...formData,
            [target.name]:target.value
        })
    };

    const formSubmitHandler = (event) => {
        event.preventDefault();
        setFormData({...initForm});
    };
/*TO Do */
//form elements
//form handlers
//api calls
//catch api errors, and display them on page.
 console.log(formData.reservation_date !== ""?formatReservationDate(formData):formData)

    return (
        <div>
            <h1>Create New Reservation</h1>
            <form onSubmit={formSubmitHandler}>
                <label htmlFor="first_name">First Name:</label> 
                <br/>
                <input type="text" id="first_name" name="first_name" onChange={formChangeHandler} value={formData.first_name} />
                <br/>
                <label htmlFor="last_name">Last Name:</label>
                <br/>
                <input type="text" id="last_name" name="last_name" onChange={formChangeHandler} value={formData.last_name}/>
                <br/>
                <label htmlFor="mobile_number">Mobile Number:</label>
                <br/>
                <input type="text" id="mobile_number" name="mobile_number" onChange={formChangeHandler} value={formData.mobile_number}/>
                <br/>
                {/*might need to come back and fix formate and inputs for date/time */}
                <label htmlFor="reservation_date">Date of Reservation:</label>
                <br/>
                <input type="date" id="reservation_date" name="reservation_date" onChange={formChangeHandler} value={formData.reservation_date}/>
                <br/>
                <label htmlFor="reservation_time">Time of Reservation:</label>
                <br/>
                <input type="time" id="reservation_time" name="reservation_time" onChange={formChangeHandler} value={formData.reservation_time}/>
                <br />
                {/*info: "must be at lest 1 person" */}
                <label htmlFor="people">Number of people in the party:</label>
                <br/>
                <input type="number" id="people" name="people" onChange={formChangeHandler} value={formData.people}/>
                <br />
                {/* cancel button on click should take user to previous page, useHistory to move back to whatever page they used to get here */}
                <br />
                <button type="cancel">Cancel</button><button type="submit">Submit</button>
            </form>
        </div>
    )

};


export default NewReservation;
import React from "react";
import {useEffect, useState} from "react"; //might need to check syntax



function NewReservation(){
/*TO Do */
//form elements
//form handlers
//api calls
//catch api errors, and display them on page.
return (
    <div>
        <h1>Create New Reservation</h1>
        <form>
            <label htmlfor="first_name">First Name:</label> 
            <br/>
            <input type="text" id="first_name" name="first_name" />
            <br/>
            <label htmlfor="last_name">Last Name:</label>
            <br/>
            <input type="text" id="last_name" name="last_name" />
            <br/>
            <label htmlfor="mobile_number">Mobile Number:</label>
            <br/>
            <input type="text" id="mobile_number" name="mobile_number" />
            <br/>
            {/*might need to come back and fix formate and inputs for date/time */}
            <label htmlfor="reservation_date">Date of Reservation:</label>
            <br/>
            <input type="text" id="reservation_date" name="reservation_date" />
            <br/>
            <label htmlfor="reservation_time">Time of Reservation:</label>
            <br/>
            <input type="text" id="reservation_time" name="reservation_time" />
            <br />
            {/*info: "must be at lest 1 person" */}
            <label htmlFor="people">Number of people in the party:</label>
            <br/>
            <input type="text" id="people" name="people"/>
            <br />
            {/* cancel button on click should take user to previous page, useHistory to move back to whatever page they used to get here */}
            <br />
            <button type="cancel">Cancel</button><button type="submit">Submit</button>
        </form>
    </div>
)

};


export default NewReservation;
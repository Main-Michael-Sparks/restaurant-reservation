import React from "react";




function ReservationForm({ formData, formChangeHandler, formSubmitHandler, cancelHandler  }){


    return (
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
    )

};

export default ReservationForm;
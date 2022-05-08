import React from "react";




function ReservationForm({ formData, formChangeHandler, formSubmitHandler, cancelHandler  }){


    return (
              <form onSubmit={formSubmitHandler}>
                <label htmlFor="first_name" className="form-label">First Name:</label> 
                <br/>
                <input name="first_name" type="text" id="first_name" className="form-control" placeholder="Enter first name" onChange={formChangeHandler} value={formData.first_name} required />
                <br/>
                <label htmlFor="last_name" className="form-label">Last Name:</label>
                <br/>
                <input name="last_name" type="text" id="last_name" className="form-control"  placeholder="Enter last name" onChange={formChangeHandler} value={formData.last_name} required/>
                <br/>
                <label htmlFor="mobile_number" className="form-label">Mobile Number:</label>
                <br/>
                <input type="text" id="mobile_number" className="form-control"  name="mobile_number" placeholder="Enter mobile number" onChange={formChangeHandler} value={formData.mobile_number} required/>
                <br/>
                <label htmlFor="reservation_date" className="form-label">Date of Reservation:</label>
                <br/>
                <input name="reservation_date" type="date" id="reservation_date" className="form-control"  placeholder="Enter reservation date" onChange={formChangeHandler} value={formData.reservation_date} required/>
                <br/>
                <label htmlFor="reservation_time" className="form-label">Time of Reservation:</label>
                <br/>
                <input name="reservation_time" type="time" id="reservation_time" className="form-control"  placeholder="Enter reservation time" onChange={formChangeHandler} value={formData.reservation_time} required/>
                <br />
                <label htmlFor="people" min="1" className="form-label">Number of people in the party:</label>
                <br/>
                <input name="people" type="number" id="people" className="form-control" placeholder="Enter number of people" onChange={formChangeHandler} value={formData.people} required/>
                <br />
                <button type="cancel" className="btn btn-outline-secondary" onClick={cancelHandler}>Cancel</button><button type="submit" className="btn btn-outline-secondary">Submit</button>
            </form>
    )

};

export default ReservationForm;
import React from "react"
import ReservationForm from "./ReservationForm"


function EditReservation(){
 //PROPS FOR RESFORM
 //formData={formData} formChangeHandler={formChangeHandler} formSubmitHandler={formSubmitHandler}  cancelHandler={cancelHandler}
    return (
        <div>
        <h1>Edit Reservation</h1>
        <ReservationForm />
        </div>
    )
}

export default EditReservation
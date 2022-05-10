import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../ErrorAlert";
import { useHistory, useParams } from "react-router";
import { readReservation, updateReservation } from "../../utils/api";

function EditReservation() {

  const initForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState(initForm);
  const [dataToPut, setDataToPut] = useState(null);
  const [sendUpdate, setSendUpdate] = useState(null);
  const [apiErrors, setApiErrors] = useState(null);

  const history = useHistory();
  const { reservationId } = useParams();

  // API Call: Gets the reservation to edit then populates the input fields with the data. 
  useEffect(() => {
    const abortController = new AbortController();
    setApiErrors(null);
    readReservation(reservationId, abortController.signal)
      .then(setFormData)
      .catch((error) => setApiErrors([error]));
    return () => abortController.abort();
  }, [reservationId]);

  // API Call: Sends the updated reservation to the backend. 
  useEffect(() => {
    if (sendUpdate) {
      const abortController = new AbortController();
      setApiErrors(null);
      updateReservation(reservationId, dataToPut, abortController.signal)
        .then(() => {
          const { reservation_date } = dataToPut;
          setFormData(initForm);
          setDataToPut(null);
          setSendUpdate(null);
          history.push(`/dashboard?date=${reservation_date}`);
        })
        .catch((error) => setApiErrors([error]));
      return () => abortController.abort();
    }
  }, [sendUpdate]);

  // Form submit handler, hands form data off to the update API call.
  const formSubmitHandler = (event) => {
    event.preventDefault();
    setDataToPut(formData);
    setSendUpdate(true);
  };

  // Cancel button handler, sends user back to previous page.
  const cancelHandler = () => {
    setFormData({ ...initForm });
    return history.goBack();
  };

  // Grabs the form data from inputs and stores the data. 
  const formChangeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });

    if (target.name === "people") {
      setFormData({
        ...formData,
        [target.name]: Number(target.value),
      });
    };

  };

  return (
    <div>
      <h1>Edit Reservation</h1>
      {apiErrors ? <ErrorAlert error={apiErrors} /> : null}
      <ReservationForm formData={formData} formChangeHandler={formChangeHandler} formSubmitHandler={formSubmitHandler} cancelHandler={cancelHandler}/>
    </div>
  );
};

export default EditReservation;

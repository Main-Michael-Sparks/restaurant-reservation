import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { listTables, readReservation, seatTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert.js";
import formatReservationDate  from "../../utils/format-reservation-date";
import formatReservationTime from "../../utils/format-reservation-time";

function Seat() {

  const initForm = {
    table_id: "",
  };
  const initErrors = [];

  /* useEffect deps left out to prevent render loops and other problems */
  const [formData, setFormData] = useState(initForm);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [dataToPost, setDataToPost] = useState(null);
  const [dataToValidate, setDataToValidate] = useState(initForm);
  const [dataValidationStage, setDataValidationStage] = useState(null);
  const [dataIsValid, setDataIsValid] = useState(null);
  const [activeErrorState, setActiveErrorState] = useState(null);
  const [displayError, setDisplayError] = useState(initErrors);
  const [errorHandoff, setErrorHandoff] = useState(null);
  const [errorStateComplete, setErrorStateComplete] = useState(null);
  const [dataValidationComplete, setDataValidtionComplete] = useState(null);

  const { reservationId } = useParams();
  const history = useHistory();

  // Collects info entered into the form.
  const formChangeHandler = ({ target }) => {
    setFormData({ [target.name]: target.value });
  };

  // Sends user back to the previous page via the history hook.
  const cancelHandler = () => {
    setFormData({ ...initForm });
    return history.goBack();
  };

  // API call to set the table data.
  useEffect(loadTables, []);
  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then((tableData) => {
        return setTables(tableData);
      })
      .catch((error) => {
        setDisplayError([error]);
        setActiveErrorState(true);
      });
    return () => abortController.abort();
  };

  // API call to set the reservation data.
  useEffect(loadReservation, []);
  function loadReservation() {
    const abortController = new AbortController();
    readReservation(reservationId, abortController.signal)
    // .then(fomatReservationTime)
    // .then(formatReservationDate)
      .then((resData) => {
        resData = formatReservationDate(resData);
        return setReservation(resData);
      })
      .catch((error) => {
        setDisplayError([error]);
        setActiveErrorState(true);
      });
    return () => abortController.abort();
  };

  // Form submit handler: starts the front-end validation.
  const formSubmitHandler = (event) => {
    event.preventDefault();
    // error & validation cleanup
    if (errorStateComplete) {
      setActiveErrorState(null);
      setErrorHandoff(null);
      setDataValidationStage(null);
      setDataValidtionComplete(null);
      setErrorStateComplete(null);
    };

    setDataToValidate({
      table_id: Number(formData.table_id),
    });

    setDataValidationStage(true);
  };

  // Validates form data, and sets any errors found.
  useEffect(() => {
    if (dataValidationStage) {

      const selectedTable = tables.find((table) => Number(dataToValidate.table_id) === Number(table.table_id));

      if (formData.table_id === "") {
        setDisplayError([{
            message: "please select a table",
          }]);
      };

      if (selectedTable && selectedTable.capacity < reservation.people) {
        setDisplayError([{
            message: "selected table is not big enough for reservation size",
          }]);
      };

      if (selectedTable && selectedTable.occupied) {
        setDisplayError([{
            message: "selected table is already occupied",
          }]);
      };
      setDataValidtionComplete(true);
    };
  }, [dataValidationStage, dataToValidate]);

  // Starts the error state or starts the API call for valid data.
  useEffect(() => {
    if (dataValidationComplete) {

      if (displayError.length) {
        setActiveErrorState(true);
        setDataIsValid(false);
      } else {
        setActiveErrorState(false);
        setDataIsValid(true);
      };

    };
  }, [dataValidationComplete]);

  // Error state handler: delivers errors to ErrorAlert and begins cleaning up error state variables.
  useEffect(() => {
    if (activeErrorState) {
      setErrorHandoff(displayError);
      setDisplayError(initErrors);
      setFormData(initForm);
      setErrorStateComplete(true);
    }
  }, [activeErrorState]);

  // Hands validated form data off to the "seat" API call.
  useEffect(() => {
    if (dataIsValid) {
      setDataToPost({
        table_id: formData.table_id,
        reservation_id: reservation.reservation_id,
      });
    };
  }, [dataIsValid]);

  // API "Seat" Call
  useEffect(() => {
    if (dataToPost) {
      const abortController = new AbortController();
      const data = {
        reservation_id: dataToPost.reservation_id,
      };
      seatTable(dataToPost.table_id, data, abortController.signal)
        .then(() => {
          setDataToPost(null);
          history.push(`/dashboard`);
        })
        .catch((error) => {
          setDisplayError([error]);
          setActiveErrorState(true);
        });
      return () => abortController.abort();
    }
  }, [dataToPost, history]);

  return (
    <div>
      <h1>Seat Table</h1>
      <h2 className="text-muted">{`#${reservation.reservation_id} - ${reservation.first_name} ${reservation.first_name} on ${reservation.reservation_date} at ${reservation.reservation_time} for ${reservation.people}`}</h2>
      {activeErrorState && errorHandoff ? (<ErrorAlert error={errorHandoff} />) : null}
      <form onSubmit={formSubmitHandler}>
        <label htmlFor="table_id">Table Number:</label>
        <br />
        <select name="table_id" id="table_id" className="form-control" aria-label="Default select" value={formData.table_id} onChange={formChangeHandler}>
          <option value={null}>Select a table</option>
          {tables?tables.map((table) => {
                            return (
                                <option key={table.table_id} value={table.table_id}>
                                    {table.table_name} - {table.capacity}
                                </option>
                            );
                        })
            : null}
        </select>
        <br />
        <button type="cancel" className="btn btn-outline-secondary" onClick={cancelHandler}>Cancel</button>
        <button type="submit" className="btn btn-outline-secondary">Submit</button>
      </form>
    </div>
  );
};

export default Seat;

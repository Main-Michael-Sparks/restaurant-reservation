import React from "react";
import {useEffect, useState} from "react"; //might need to check syntax
import {useHistory} from "react-router-dom"
import {createReservation} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import {today} from "../../utils/date-time"

function NewReservation(){

    const initForm = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",

    };
    //need to disable the activeErrorState var after rendering the errorAlert comp. 
    const [formData, setFormData] = useState(initForm);
    const [dataToPost, setDataToPost] = useState(null);
    const [displayError, setDisplayError] = useState([]);
    const [resDate, setResDate] = useState();
    const [activeErrorState, setActiveErrorState] = useState(false)
    const history = useHistory();
    const currentDay = new Date(today());
    useEffect(()=>{

        if(formData.reservation_date){
            setResDate(new Date(formData.reservation_date))
        }

        if(resDate){
            if(resDate.getDay() === 1 && resDate.getTime() < currentDay.getTime()){
                return setDisplayError([
                    ...displayError,
                    {message: "Reservation cannot be on Tuesday"},
                    {message: "Reservation must be in the future"}
                ])
            }
            if(resDate.getDay() === 1){
                return setDisplayError([...displayError,{message: "Reservation cannot be on Tuesday"}])
            }

            if(resDate.getTime() < currentDay.getTime()){
                return setDisplayError([...displayError,{message: "Reservation must be in the future"}])
            }
        }
    
    },[formData])

    const cancelHandler = () => {
        setFormData({...initForm});
        return history.goBack();
    };

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

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if(!displayError.length) {
            setFormData({...formData,
                people: Number(formData.people)
            })
            setDataToPost(formData);
            setFormData({...initForm});
        }
        if (displayError.length) {
            setActiveErrorState(true);
        }
    };

    useEffect(() => {
        if (dataToPost){
        const abortController = new AbortController();
        createReservation(dataToPost,abortController.signal)
            .then(resObj =>{
                if(resObj.reservation_date){
                    const date = resObj.reservation_date;
                    setDataToPost(null);
                    history.push(`/dashboard?date=${date}`)
                };
                return resObj
            })
            .catch(error=> setDisplayError([...displayError,error]));
        return () => abortController.abort()
        };
      }, [dataToPost,history]);

    return (
        <div>
            <h1>Create New Reservation</h1>
            { activeErrorState?<ErrorAlert error={displayError}/>: null }
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
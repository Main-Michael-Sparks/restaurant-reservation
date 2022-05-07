import React from "react";
import ReservationTable from "../../dashboard/ReservationTable";
import {useEffect, useState} from "react-router-dom"

function Search(){

    const [formData, setFormData] = useState(initForm)

    return(
        <div>
            <h1>Search Reservations</h1>
            <form>
            <label htmlFor="mobile_number">Mobile Number</label>
            <br />
            <input name="mobile_number" id="mobile_number" type="text" placeholder="Enter a customer's phone number" /><button type="submit">Find</button>
            </form>
            <ReservationTable />
        </div>
    )
};


export default Search;
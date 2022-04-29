import React from "react";


function NewTable(){

    return (
        <div>
            <h1>New Table</h1>
            <form onSubmit={null}>
                <label htmlFor="table_name">Table Name:</label>
                <br/>
                <input name="table_name" type="text" id="table_name" placeholder="Enter table name" onChange={null} value={null} required />
                <br/>
                <label htmlFor="capacity" min="1">Capacity:</label>
                <br/>
                <input name="capacity" type="number" id="capacity" placeholder="Number of people" onChange={null} value={null} required/>
                <br/>
                <br/>
                <button type="cancel" onClick={null}>Cancel</button><button type="submit">Submit</button>
            </form>
        </div>
    )
}


export default NewTable;
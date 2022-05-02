import React from "react";



function TablesTable({tables}) {
//write jsx table
//map array to fill table
// add buttons
// change the db to manipulate the FK on res, and use it to do the rest UNLESS jest insists on a TBALES col.

    if(tables) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Table Name</th>
                        <th>Capacity</th>
                        <th>Free/Occupied</th>
                        <th>Table Finished</th>
                    </tr>
                </thead>
                <tbody>
                {tables.map((table, index) =>{
                    return (
                    <tr key={index}>
                        <td>
                            {table.table_name}
                        </td>
                        <td>
                            {table.capacity}
                        </td>
                        <td>
                            to be determed
                        </td>
                        <td>
                            to be determed
                        </td>
                    </tr>
                    ) 
                })}
                </tbody>
            </table>
        )
    } else {
        return null;
    }
};


export default TablesTable;
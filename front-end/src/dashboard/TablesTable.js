import React from "react";



function TablesTable({tables, finishHandler}) {


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
                {tables.map(table =>{
                    return (
                        <tr key={table.table_id}>
                            <td>
                                {table.table_name}
                            </td>
                            <td>
                                {table.capacity}
                            </td>
                            <td>
                                {table.occupied?(<span data-table-id-status={table.table_id}>occupied</span>):
                                (<span data-table-id-status={table.table_id}>free</span>)}
                            </td>
                            <td>
                                {table.occupied?(<button data-table-id-finish={table.table_id} name="finished" onClick={()=>finishHandler(table.table_id)}>Finish</button>): null}
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
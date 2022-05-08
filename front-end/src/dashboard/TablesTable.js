import React from "react";



function TablesTable({tables, finishHandler}) {


    if(tables) {
        return (
            <table className="table">
                <thead>
                    <tr className="table-light">
                        <th scope="col">Name</th>
                        <th scope="col">Capacity</th>
                        <th scope="col">Availability</th>
                        <th scope="col">Clear Table</th>
                    </tr>
                </thead>
                <tbody>
                {tables.map(table =>{
                    return (
                        <tr key={table.table_id}>
                            <td scope="row">
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
                                {table.occupied?(<button data-table-id-finish={table.table_id} name="finished" className="btn btn-outline-secondary" onClick={()=>finishHandler(table.table_id)}>Finish</button>): null}
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
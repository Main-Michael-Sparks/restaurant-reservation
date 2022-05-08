import React  from "react";
import {Link} from "react-router-dom"

function ReservationTable({reservations, cancelHandler}) {


    if (reservations) {
        return (
            <table className="table">
                <thead>
                    <tr className="table-light">
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">People</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
        {reservations && reservations.length == 0?(<tr><td colSpan={7}>No Reservations for date specified..</td></tr>): null}
        {reservations.map(reservation =>{
            return (
              <tr key={reservation.reservation_id}>
                  <td>
                    {reservation.first_name}
                  </td>
                  <td>
                    {reservation.last_name}
                  </td>
                  <td>
                    {reservation.mobile_number}
                  </td>
                  <td>
                    {reservation.reservation_date}
                  </td>
                  <td>
                    {reservation.reservation_time}
                  </td>
                  <td>
                    {reservation.people}
                  </td>
                  <td>
                    {reservation.status === "booked"?<span data-reservation-id-status={reservation.reservation_id}>{reservation.status}</span>:null}
                    {reservation.status ==="seated"?<span data-reservation-id-status={reservation.reservation_id}>{reservation.status}</span>:null}
                    {reservation.status === "cancelled"? <span>{reservation.status}</span>: null}
                    {reservation.status === "finished"? <span>{reservation.status}</span>:null}
                  </td>
                  <td>
                    {reservation.status === "booked"?<Link to={`/reservations/${reservation.reservation_id}/seat`}><button type="button" className="btn btn-outline-secondary">Seat</button></Link>:null}
                    {reservation.status === "booked"?<Link to={`/reservations/${reservation.reservation_id}/edit`}><button type="button" className="btn btn-outline-secondary">Edit</button></Link>:null}
                    {reservation.status === "booked"?<button data-reservation-id-cancel={reservation.reservation_id} name="cancel" className="btn btn-outline-secondary" onClick={()=>cancelHandler(reservation.reservation_id)}>Cancel</button>:null}
                  </td>
              </tr>
            ) 
          })}
          </tbody>
    </table>
        )
    } else {
        return null
    }
};
export default ReservationTable;
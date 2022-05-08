import React  from "react";
import {Link} from "react-router-dom"

function ReservationTable({reservations, cancelHandler}) {


    if (reservations) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile Number</th>
                        <th>Reservation Date</th>
                        <th>Reservation Time</th>
                        <th>Number of People</th>
                        <th>Status</th>
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
                    {
                      reservation.status === "booked"?
                      (<><span data-reservation-id-status={reservation.reservation_id}>booked</span> 
                        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                        <button type="button">Seat</button></Link>
                        <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                        <button type="button">Edit</button>
                        </Link>
                        <button type="button" data-reservation-id-cancel={reservation.reservation_id} onClick={()=>cancelHandler(reservation.reservation_id)}>Cancel</button>
                      </>):
                      reservation.status ==="seated"?(<span data-reservation-id-status={reservation.reservation_id}>seated</span>):
                      reservation.status === "cancelled"? ("cancelled"): null
                    }
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
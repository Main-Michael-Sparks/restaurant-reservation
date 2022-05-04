import React  from "react";

function ReservationTable({reservations}) {

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
                    to be determed
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
import React  from "react";

function ReservationTable({reservations}) {

    if (reservations.length) {
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
                    </tr>
                </thead>
                <tbody>
        {reservations.map((reservation, index) =>{
            return (
              <tr key={index}>
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
import React, { useState } from "react";
import "./App.css";

const initialSeats = [
  [1, 0, 0, 1, 0, 0, 0],  // Row 1: Seats 1, 4 booked
  [0, 0, 0, 0, 0, 0, 0],  // Row 2: All available
  [0, 1, 0, 0, 0, 0, 0],  // Row 3: Seat 2 booked
  [0, 0, 0, 0, 0, 0, 0],  // Row 4: All available
  [0, 0, 0, 0, 1, 0, 0],  // Row 5: Seat 5 booked
  [0, 0, 0, 0, 0, 0, 0],  // Row 6: All available
  [0, 0, 0, 0, 0, 0, 0],  // Row 7: All available
  [0, 0, 0, 0, 0, 0, 0],  // Row 8: All available
  [0, 0, 0, 0, 0, 0, 0],  // Row 9: All available
  [0, 0, 0, 0, 0, 0, 0],  // Row 10: All available
  [0, 0, 0, 0, 0, 0, 0],  // Row 11: All available
  [0, 0, 0]               // Row 12 (Last row with 3 seats): All available
];

function SeatMap({ seats }) {
  return (
    <div className="seat-map">
      {seats.map((row, rowIndex) => (
        <div className="seat-row" key={rowIndex}>
          {row.map((seat, seatIndex) => {
            let seatStatus = "";
            if (seat === 1) {
              seatStatus = "Booked";
            } else if (seat === 2) {
              seatStatus = "Your Seat";
            } else {
              seatStatus = "Available";
            }

            return (
              <div className="seat-container" key={seatIndex}>
                <div
                  className={`seat ${
                    seat === 1 ? "booked" :
                    seat === 2 ? "user-booked" :
                    "available"
                  }`}
                >
                  {seatIndex + 1}
                </div>
                <div className="tooltip">{seatStatus}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [seats, setSeats] = useState(initialSeats);
  const [numSeats, setNumSeats] = useState(1);

  const bookSeats = () => {
    if (numSeats < 1 || numSeats > 7) {
      alert("You can only book between 1 to 7 seats.");
      return;
    }

    let seatsCopy = [...seats];
    let seatsToBook = numSeats;
    let userBookedSeats = [];

    // First, try to find enough seats in one row
    for (let row = 0; row < seatsCopy.length; row++) {
      let availableInRow = 0; // Counter for available seats in the current row
      let seatsToReserve = [];

      for (let col = 0; col < seatsCopy[row].length; col++) {
        if (seatsCopy[row][col] === 0) { // Check for available seat
          availableInRow++;
          seatsToReserve.push(col);
        }

        // If we have enough available seats in this row, we can stop looking
        if (availableInRow >= seatsToBook) {
          for (let i = 0; i < seatsToBook; i++) {
            seatsCopy[row][seatsToReserve[i]] = 2; // Mark as booked by user
            userBookedSeats.push(`Row ${row + 1} Seat ${seatsToReserve[i] + 1}`);
          }
          setSeats(seatsCopy);
          alert(`Successfully booked ${numSeats} seats: ${userBookedSeats.join(', ')}`);
          return; // Exit after booking
        }
      }
    }

    // If not enough seats in one row, find nearby available seats
    for (let row = 0; row < seatsCopy.length && seatsToBook > 0; row++) {
      for (let col = 0; col < seatsCopy[row].length; col++) {
        if (seatsCopy[row][col] === 0) { // Check for available seat
          seatsCopy[row][col] = 2; // Mark as booked by user
          userBookedSeats.push(`Row ${row + 1} Seat ${col + 1}`);
          seatsToBook--;
          if (seatsToBook === 0) break; // Exit loop if booked enough seats
        }
      }
    }

    // Check if all requested seats were booked
    if (userBookedSeats.length === numSeats) {
      setSeats(seatsCopy);
      alert(`Successfully booked ${numSeats} seats: ${userBookedSeats.join(', ')}`);
    } else {
      alert("Not enough seats available.");
    }
  };

  return (
    <div className="App">
      <h1>Seat Reservation System</h1>
      <SeatMap seats={seats} />
      <div className="booking-form">
        <label>
          Number of Seats to Book:
          <input
            type="number"
            value={numSeats}
            min="1"
            max="7"
            onChange={(e) => setNumSeats(Number(e.target.value))}
          />
        </label>
        <button onClick={bookSeats}>Book Seats</button>
      </div>
    </div>
  );
}

export default App;

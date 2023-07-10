import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import { useEffect } from "react";
export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);
  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }
  async function bookPlace() {
    const data = {
      checkIn,
      checkOut,
      phone,
      numberOfGuests,
      name,
      place: place._id,
      price: numberOfDays * place.price,
    };
    const response = await axios.post("/bookings", data);
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
          Price : ${place.price} / per night
        </div>
        <div className="border rounded-2xl mt-4">
          <div className="flex">
            <div className="py-3 px-4 ">
              <label>Check in : </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="py-3 px-4 border-l">
              <label>Check out : </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="py-3 px-4 border-t">
            <label>Number of Guests : </label>
            <input
              type="number"
              onChange={(e) => setNumberOfGuests(e.target.value)}
              value={numberOfGuests}
            />
          </div>
          {numberOfDays > 0 && (
            <div className="py-3 px-4 border-t">
              <label>Your Name : </label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <label>Phone Number : </label>
              <input
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>
          )}
        </div>

        <button onClick={bookPlace} className="primary mt-4">
          Book this place
          {numberOfDays > 0 && (
            <>
              <span> ${numberOfDays * place.price}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

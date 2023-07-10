import AccountNav from "../AccountNav";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import PlaceImg from "../PlaceImg";
import { format, differenceInCalendarDays } from "date-fns";
import { Link } from "react-router-dom";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              to={`/account/bookings/${booking._id}`}
              className="flex gap-4 items-center bg-gray-200 rounded-2xl overflow-hidden"
              key={booking._id}
            >
              <div className="w-48">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3 grow pr-3">
                <h2 className="text-xl">{booking.place.title}</h2>
                <div className="flex gap-2 items-center border-t border-gray-300 mt-2 py-2">
                  {format(new Date(booking.checkIn), "yyyy-MM-dd")} &rarr;{" "}
                  {format(new Date(booking.checkOut), "yyyy-MM-dd")}
                </div>
                <div>
                  Number of nights :{" "}
                  {differenceInCalendarDays(
                    new Date(booking.checkOut),
                    new Date(booking.checkIn)
                  )}{" "}
                  nights | Total Price : ${booking.price}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

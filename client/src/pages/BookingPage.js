import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import PlaceGallery from "../PlaceGallery";
import { format, differenceInCalendarDays } from "date-fns";
export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        setBooking(foundBooking);
      });
    }
  }, [id]);
  if (!booking) return "";
  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <div className="my-3 bg-gray-200 p-4 mb-4 rounded-2xl">
        <h2 className="text-xl">Your Booking Information : </h2>
        <div className="py-3 grow pr-3">
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
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}

import { useState } from "react";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
export default function PlacesForm() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);

  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (!id) return;
    console.log("id : ", id);
    axios.get("http://localhost:3000/places/" + id).then((response) => {
      const { data } = response;
      console.log(data);
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
  async function savePlace(e) {
    e.preventDefault();
    const placeData = {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      //update place
      try {
        await axios.put("http://localhost:3000/places", {
          id,
          ...placeData,
        });
        setRedirect(true);
      } catch (err) {
        console.log("addnew place err : ", err);
      }
    } else {
      //create new place
      try {
        await axios.post("http://localhost:3000/places", placeData);
        setRedirect(true);
      } catch (err) {
        console.log("addnew place err : ", err);
      }
    }
  }
  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput("Title", " title for your place should be catchy")}
        <input
          type="text"
          placeholder="title : My apartment"
          className="py-2 px-3 border-2 border-gray rounded-full w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {preInput("Address", "address to this place")}
        <input
          type="text"
          placeholder="address"
          className="py-2 px-3 border-2 border-gray rounded-full w-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {preInput("Photos", "More the better")}
        <PhotosUploader onChange={setAddedPhotos} addedPhotos={addedPhotos} />
        {preInput("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {preInput("Perks", "select all the perks")}
        <Perks selected={perks} onChange={setPerks} />
        {preInput("Extra Info", "House Rules, etc.")}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
        {preInput(
          "CheckIn & CheckOut Time, Max Guests",
          "Add CheckIn & CheckOut Time, remember to have some window forguests to claim their room"
        )}
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">CheckIn Time</h3>
            <input
              type="text"
              placeholder="16:00"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">ChecOut Time</h3>
            <input
              type="text"
              placeholder="18:00"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max Guests</h3>
            <input
              type="number"
              placeholder="1"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              placeholder="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <button className="my-4 primary">Save</button>
      </form>
    </div>
  );
}

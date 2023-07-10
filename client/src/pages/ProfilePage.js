import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";
export default function ProfilePage() {
  const { user, ready } = useContext(UserContext);
  let { subpage } = useParams();
  console.log(subpage);

  if (!ready) {
    return "...Loading";
  }
  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }
  if (!subpage) {
    subpage = "profile";
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})
          <br />
          <Link
            to="https://backend-water-bnb.onrender.com/logout"
            className="primary max-w-sm mt-2"
          >
            <button className="bg-primary text-white text-center py-2 px-8 rounded-full mt-4">
              Logout
            </button>
          </Link>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}

import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./Layout";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import PlacesPage from "./pages/PlacesPage";
import PlacesForm from "./pages/PlacesForm";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <IndexPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/account",
          element: <ProfilePage />,
        },
        {
          path: "/account/places",
          element: <PlacesPage />,
        },
        {
          path: "/account/places/new",
          element: <PlacesForm />,
        },
        {
          path: "/account/places/:id",
          element: <PlacesForm />,
        },
        {
          path: "/place/:id",
          element: <PlacePage />,
        },
        {
          path: "/account/bookings",
          element: <BookingsPage />,
        },
        {
          path: "/account/bookings/:id",
          element: <BookingPage />,
        },
      ],
    },
  ]);

  return (
    <UserContextProvider>
      <RouterProvider router={router} />;
    </UserContextProvider>
  );
}

export default App;

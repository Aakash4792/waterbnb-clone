import GoogleButton from "react-google-button";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="flex justify-center grow items-center py-40">
      <div>
        <Link
          to="http://localhost:3000/auth/google"
          style={{ display: "block" }}
        >
          <GoogleButton />
        </Link>
      </div>
    </div>
  );
}
// import GoogleButton from "react-google-button";

// export default function LoginPage() {
//   const handleGoogleButtonClick = () => {
//     console.log("Google button clicked");
//     fetch("http://localhost:3000/auth/google", { credentials: "include" })
//       .then((response) => {
//         // Handle the response from the server
//         if (response.ok) {
//           // Successful response, navigate to a new page or handle the data
//           // history.push("/success"); // Replace "/success" with the desired route

//           console.log("logged in");
//         } else {
//           // Handle error response from the server
//           console.error("Error:", response.status);
//         }
//       })
//       .catch((error) => {
//         // Handle any network or fetch error
//         console.error("Error:", error);
//       });
//   };

//   return (
//     <div className="flex justify-center grow items-center py-40">
//       <div>
//         <GoogleButton onClick={handleGoogleButtonClick} />
//       </div>
//     </div>
//   );
// }

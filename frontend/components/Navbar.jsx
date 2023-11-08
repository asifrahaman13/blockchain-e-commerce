import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

require("dotenv").config();

const Navbar = () => {
  const [sender, setSender] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    fullName: "",
    companyName: "",
    role: "",
    department: "",
  });

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    async function fetchDetails(accessToken) {
      try {
        const response = await axios.get("http://localhost:8000/user-details", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Replace with the actual access token
          },
        });

        const userDetails = response.data.userDetails;
        console.log(response);
        return userDetails;
      } catch (error) {
        console.log(error);
      }
    }

    if (access_token) {
      setIsLoggedIn(true);
      fetchDetails(access_token).then((userDetails) => {
        setUserDetails(userDetails);
      });
    }
  }, []);

  useEffect(() => {
    const main = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // Request the user's accounts
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setSender(accounts[0]);
        } catch (error) {
          console.error("Error requesting accounts:", error);
        }
      } else {
        console.error("MetaMask is not installed or not available.");
      }
    };

    main();
  }, []);

  function deleteLocalStorage() {
    localStorage.removeItem("access_token");
    router.push("/");
    // window.location.reload();
  }

  return (
    <header>
      <div className="container mx-auto flex flex-wrap p-5 items-center">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            className="w-10 h-10 text-gray p-2 text-gray-100 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl text-gray-100">Block-verse</span>
        </div>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-xl justify-center">
          <Link href="/" className="mr-5 text-gray-100 hover:text-indigo-500">
            Home
          </Link>

          <Link href="/about" className="mr-5 text-gray-100 ">
            About
          </Link>
          <Link href="/contact" className="mr-5 text-gray-100">
            Contact
          </Link>
          {isLoggedIn === true ? (
            // If the user is logged in, display "Logout" link
            <>
              <Link href="/sell" className="mr-5 text-gray-100">
                Sell
              </Link>
              <Link href="/orders" className="mr-5 text-gray-100 ">
                Orders
              </Link>
              <Link href="/sell" className="mr-5 text-white">
                Sell
              </Link>
              <Link
                href="/"
                className="mr-5 text-white"
                onClick={() => {
                  deleteLocalStorage();

                  setIsLoggedIn(false);
                }}
              >
                Logout
              </Link>
              <Link href="/userdetails" className="mr-5 text-white">
                User
              </Link>
            </>
          ) : (
            // If the user is not logged in, display "Signup" and "Login" links
            <>
              <Link href="/signup" className="mr-5 text-white">
                Signup
              </Link>
              <Link href="/login" className="mr-5 text-white">
                Login
              </Link>
            </>
          )}
        </nav>
        <button className="bg-purple-500 text-gray py-2 px-4 rounded hover:bg-purple-500">
          {sender}
        </button>
      </div>
    </header>
  );
};

export default Navbar;

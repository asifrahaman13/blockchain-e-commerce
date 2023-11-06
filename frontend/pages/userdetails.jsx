import React,{useState, useEffect} from "react";
import axios from "axios";

const userdetails = () => {
    const [sender, setSender] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState({
      email: "",
      contractAddress: "",
      buyersPan: "",
      sellersPan: "",
      fullName: "",
      companyName: "",
      role: "",
      department: "",
    });
  
    useEffect(() => {
      const access_token = localStorage.getItem("access_token");
      console.log("Access token: " + access_token);
  
      async function fetchDetails(accessToken) {
        console.log("The access token is", accessToken);
        try {
          const response = await axios.get("http://localhost:8000/user-details", {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Replace with the actual access token
            },
          });
  
          const userDetails = response.data.userDetails;
          console.log("The response is",response.data.userDetails);
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
      console.log(userDetails);
    }, []);

  return (
    <>
      <div class="0">
        <div class="container mx-auto py-8">
          <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div class="col-span-4 sm:col-span-3">
              <div class="product shadow rounded-lg p-6">
                <div class="flex flex-col items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/94.jpg"
                    class="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                  ></img>
                  <h1 class="text-xl font-bold text-white "> {userDetails.fullName}</h1>
                  <p class="text-gray-600"> {userDetails.role}</p>
                  <div class="mt-6 flex flex-wrap gap-4 justify-center">
                    <a
                      href="#"
                      class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                     {userDetails.email}
                    </a>
                    <a
                      href="#"
                      class="text-white bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
                    >
                     {userDetails.fullName}
                    </a>
                  </div>
                </div>
                <hr class="my-6 border-t border-gray-300" />
                <div class="flex flex-col">
                  <span class="text-gray-600 uppercase font-bold tracking-wider mb-2">
                    Company Name
                  </span>
                  <ul>
                    <li class="mb-2 text-white ">{userDetails.companyName}</li>
                   
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-span-4 sm:col-span-9">
              <div class="product shadow rounded-lg p-6">
               

                <h3 class="font-semibold text-center mt-3 -mb-2 text-white ">Your details</h3>
                

                <h2 class="text-xl font-bold mt-6 mb-4 text-white ">Experience</h2>
                <div class="mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">Contract Address Registered</span>
                  </div>
                  <p class="mt-2 text-white ">
                    {userDetails.contractAddress}
                  </p>
                </div>
                <div class="mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">Buyers Pan</span>
                  
                  </div>
                  <p class="mt-2 text-white ">
                    {userDetails.buyersPan}
                  </p>
                </div>
                <div class="mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">Seller Pan</span>
               
                  </div>
                  <p class="mt-2 text-white ">
                    {userDetails.sellersPan}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default userdetails;

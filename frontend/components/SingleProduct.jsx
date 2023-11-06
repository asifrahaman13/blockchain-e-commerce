import React, { useState, useEffect } from "react";
import getContractObject from "./contractobject/contractobject";
import Loader from "./Loader";
import axios from "axios";

const Singleprod = ({ product }) => {
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

  const [isLoading, setIsLoading] = useState(false);
  const [buyers_pan, setBuyers_pan] = useState("");
  const [buyersName, setBuyersName] = useState("");
  const [contract, setContract] = useState("");

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    console.log("Access token: " + access_token);

    async function fetchDetails(accessToken) {
      console.log("The access token is as follows", accessToken);
      try {
        const response = await axios.get("http://localhost:8000/user-details", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Replace with the actual access token
          },
        });

        const userDetails = response.data.userDetails;
        console.log("The response data is: ", response.data.userDetails);
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

  console.log(product);
  useEffect(() => {
    async function fetchData() {
      const res_contract = await getContractObject();
      setContract(res_contract);
    }

    fetchData();
  }, []);

  const BuyOnchain = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      console.log(prod_details.id, userDetails.buyersPan, userDetails.fullName);
      const tx = await contract.Buy(
        prod_details.id,
        userDetails.buyersPan,
        userDetails.fullName
      );
      console.log(tx);
      if (tx != null) {
        if (tx.length != 0) {
          console.log("You brought this product successfully");
          setIsLoading(false);
        }
      } else {
        console.error("Something went wrong.");
      }
    } catch (err) {
      console.error("Something went wrong.", err);
    }
  };

  const prod_details = {
    id: product.product_id,
    owner: product.Product_Owner,
    product_name: product.Product_Name,
    description: product.Product_Description,
    price: product.price,
    imageUrl: `https://sapphire-bloody-ant-105.mypinata.cloud/ipfs/${product.product_id}`,
  };
  return (
    <>
      {isLoading && <Loader />}
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-wrap -m-4">
            <div class="xl:w-1/2 md:w-1/2 p-4">
              <div class="product p-6 rounded-lg">
                <img
                  class="h-100 rounded w-full object-cover object-center mb-6"
                  src={prod_details.imageUrl}
                  alt="content"
                />
                <h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">
                  ₹ {prod_details.price}
                </h3>
                <h2 class="text-lg text-gray-100 font-medium title-font mb-4">
                  {prod_details.product_name}
                </h2>
                <h2 class="text-lg text-gray-100 font-medium title-font mb-4">
                  {prod_details.id}
                </h2>
                <p class="leading-relaxed text-gray-100 overflow-hidden">
                  {prod_details.description}
                </p>
                <div className="p-2 w-full">
                  <button
                    className="flex mx-auto text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-purple-400 rounded text-lg"
                    onClick={BuyOnchain}
                  >
                    BUY THIS PRODUCT NOW
                  </button>
                </div>
              </div>
            </div>

            <div class=" xl:w-1/2 md:w-1/2 p-4">
              <div class="product p-6 rounded-lg">
                <section className="text-white body-font relative">
                  <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
                        Buy any product
                      </h1>
                      <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
                        { prod_details.id}
                      </p>
                    </div>
                   
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Singleprod;

import React, { useState, useEffect } from "react";
import getContractObject from "./contractobject/contractobject";
import Loader from "./Loader";
import axios from "axios";
import { useRouter } from "next/router";

const Singleprod = ({ product }) => {
  const router = useRouter();

  const prod_details = {
    id: product.product_id,
    owner: product.Product_Owner,
    product_name: product.Product_Name,
    description: product.Product_Description,
    price: product.price,
    imageUrl: `https://sapphire-bloody-ant-105.mypinata.cloud/ipfs/${product.product_id}`,
  };

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
  const [contract, setContract] = useState(null);
  const [isAvailable, setIsAvailable] = useState(-1);
  const [isAvailablee, setIsAvailablee] = useState(false);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    async function fetchDetails(accessToken) {
      try {
        const response = await axios.get("http://localhost:8000/user-details", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userDetails = response.data.userDetails;
        return userDetails;
      } catch (error) {
        console.log(error);
      }
    }

    const trackStatus = async (productid) => {
      try {
        const tx = await contract.track_Status(productid);

        if (tx.status === 0) {
          setIsAvailablee(true);
        }

        setIsAvailable(tx.Status);
        console.log("The status is: ", tx.Status);
        console.log(tx.Buyer_Owner);
      } catch (err) {
        console.error("No such product is available");
      }
    };


    

    if (access_token) {
      setIsLoggedIn(true);
      fetchDetails(access_token).then((userDetails) => {
        setUserDetails(userDetails);
        const { slug } = router.query;
        console.log("The slug", slug);
        trackStatus(slug);
    
        
      });
    }
  }, [contract]);

  useEffect(() => {
    async function fetchData() {
      const res_contract = await getContractObject();
      setContract(res_contract);
    }

    

    fetchData();
  }, []);

  const BuyOnchain = async (e) => {
    e.preventDefault();

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 15000);

    setIsLoading(true);
    try {
      console.log(prod_details.id, userDetails.buyersPan, userDetails.fullName);
      const tx = await contract.Buy(
        prod_details.id,
        userDetails.buyersPan,
        userDetails.fullName
      );
      setIsLoading(false);
      if (tx) {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
        if (tx.length !== 0) {
          clearTimeout(loadingTimeout);
          setIsLoading(false);
        }
      } else {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    } catch (err) {
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    }
  };

  

  return (
    <>
      {isLoading && <Loader />}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="xl:w-1/2 md:w-1/2 p-4">
              <div className="product p-6 rounded-lg">
                <img
                  className="h-100 rounded w-full object-cover object-center mb-6"
                  src={prod_details.imageUrl}
                  alt="content"
                />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                  ₹ {prod_details.price}
                </h3>
                <h2 className="text-lg text-gray-100 font-medium title-font mb-4">
                  {prod_details.product_name}
                </h2>
                <h2 className="text-lg text-gray-100 font-medium title-font mb-4">
                  {prod_details.id} 
                </h2>
                <p className="leading-relaxed text-gray-100 overflow-hidden">
                  {prod_details.description}
                </p>

                {isAvailable === 0 && (
                  <div className="p-2 w-full">
                    <button
                      className="flex mx-auto text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-purple-400 rounded text-lg"
                      onClick={BuyOnchain}
                    >
                      BUY THIS PRODUCT NOW
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="xl:w-1/2 md:w-1/2 p-4">
              <div className="product p-6 rounded-lg">
                <section className="text-white body-font relative">
                  <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                      {isAvailable===0 ? <>
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
                        🤩 Buy this product
                      </h1>
                      <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
                        {prod_details.id}
                      </p></>: <>
                      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
                      ✅ You already bought or ordered this product. 
                      </h1>
                      <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
                      
                      </p>
                      </>}
                    
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

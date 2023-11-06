import React, { useState, useEffect } from "react";
import axios from "axios";
import getContractObject from "../components/contractobject/contractobject";
import { ethers } from "ethers";

const userdetails = () => {
  const [contract, setContract] = useState("");
  const [data, setData] = useState([]);
  const [pan, setPan] = useState("");

  const [sellerspan, setSellerspan] = useState("");
  const [sellersdata, setSellersData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res_contract = await getContractObject();
      console.log(res_contract);
      setContract(res_contract);
    }

    fetchData();
  }, []);

  const sellersData = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.SellersDetails(sellerspan);
      setSellersData(tx);
      if (tx.length == 0) {
        console.error("Something went wrong");
      } else {
        console.success("Sellers data is successfulluy available");
      }
    } catch (err) {
      console.error("Something went wrong fetching sellers data.");
    }
  };

  const display = async (e) => {
    e.preventDefault();
    const tx = await contract.DetailsFromPan(pan);
    setData(tx);
  };

  const owner_address = process.env.NEXT_PUBLIC_OWNER;

  useEffect(() => {
    const main = async () => {
      if (typeof window !== "undefined") {
        const contract = await getContractObject();
        const result = await contract.TotalProducts();

        console.log(ethers.utils.formatEther(result, 18) * 1e18);
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setSender(accounts[0]);
          if (accounts[0] == owner_address) {
            setIsOwner(true);
          }
        } catch (error) {
          console.error("Error requesting accounts:", error);
        }
      }
    };

    main();
  }, []);

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
        console.log("The response is", response.data.userDetails);
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
                  <h1 class="text-xl font-bold text-white ">
                    {" "}
                    {userDetails.fullName}
                  </h1>
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
                      {userDetails.department}
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
                <h3 class="font-semibold text-center mt-3 -mb-2 text-white ">
                  {userDetails.fullName}
                </h3>

                <h2 class="text-xl font-bold mt-6 mb-4 text-white ">
                  My Detaails
                </h2>
                <div class="mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">
                      Contract Address Registered
                    </span>
                  </div>
                  <p class="mt-2 text-white ">{userDetails.contractAddress}</p>
                </div>
                <div class="mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">Buyers Pan</span>
                  </div>
                  <p class="mt-2 text-white ">{userDetails.buyersPan}</p>
                </div>
                <div class="mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">Seller Pan</span>
                  </div>
                  <p class="mt-2 text-white ">{userDetails.sellersPan}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white-600">
              See all the previous invoice from the pan
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
              All the informations displayed here are protected and we do not
              have any rights over it. Your personal information over the
              blockchain is secured and we do not intervene in the process.
              Please do not however disclose your pan number with anyone else.
            </p>
          </div>
          <section className="text-gray-600 body-font relative">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-col text-center w-full mb-12">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white-600">
                  TRACK BUYERS INVOICE THROUGH YOUR PAN
                </h1>
                <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
                  Whatever cardigan tote bag tumblr hexagon brooklyn
                  asymmetrical gentrify.
                </p>
              </div>
              <div>
                <div>
                  <div>
                    <div className="relative">
                      <label
                        for="name"
                        className="leading-7 text-sm text-white"
                      >
                        Enter your buyers pan
                      </label>
                      <input
                        name="pan"
                        onChange={(e) => {
                          setPan(e.target.value);
                        }}
                        type="text"
                        placeholder="Track your invoice through buyer's pan"
                        id="name"
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-gray focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>

                  <div className="p-2 w-full">
                    <button
                      onClick={display}
                      className="flex mx-auto text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-pnk-600 rounded text-lg"
                    >
                      CHECK INVOICES
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap -m-4">
                {data.map((item, idx) => {
                  return (
                    <>
                      <div className="p-4 lg:w-1/3">
                        <div className="product shadow-lg h-fullbg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden relative text-justify">
                          <div className="text-xs font-bold text-white-500">
                            INVOICE NO: {idx + 1}
                          </div>
                          <br />
                          <h1>Product name</h1>
                          <p className="tracking-widest text-xl title-font font-medium text-white mb-1 py-2">
                            {item.name}
                          </p>
                          <br />

                          <h1>Time stamp</h1>
                          <p> {item.invoiceDate.toString()}</p>
                          <br />
                          <h1 className="tracking-widest text-xl title-font font-medium text-white mb-1 py-2">
                            Product Price
                          </h1>
                          <p className="tracking-widest text-xl title-font font-medium text-white mb-1 py-2">
                            {" "}
                            {item.invoiceAmount.toString()}
                          </p>
                          <br />
                          <h1>Product Description</h1>
                          <p className="tracking-widest text-xl title-font font-medium text-white mb-1 py-2">
                            {item.ProductDescription.toString()}
                          </p>
                          <br />
                          <h1>Sellers Transaction Id</h1>
                          <p className="tracking-widest text-xl title-font font-medium text-white mb-1">
                            {" "}
                            {item.transactionFrom.toString()}
                          </p>

                          <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4"></div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="text-gray-600 body-font relative">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-col text-center w-full mb-12">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white-600">
                  TRACK SELLERS INVOICE THROUGH YOUR PAN
                </h1>
                <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
                  Whatever cardigan tote bag tumblr hexagon brooklyn
                  asymmetrical gentrify.
                </p>
              </div>
              <div>
                <div>
                  <div>
                    <div className="relative">
                      <label
                        for="name"
                        className="leading-7 text-sm text-white"
                      >
                        Enter your sellers pan
                      </label>
                      <input
                        name="pan"
                        onChange={(e) => {
                          setSellerspan(e.target.value);
                        }}
                        type="text"
                        placeholder="Track your invoices through sellers pan"
                        id="name"
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-gray focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>

                  <div className="p-2 w-full">
                    <button
                      onClick={sellersData}
                      className="flex mx-auto text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-pnk-600 rounded text-lg"
                    >
                      CHECK INVOICES
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap -m-4">
                {sellersdata.map((item, idx) => {
                  return (
                    <>
                      <div className="p-4 lg:w-1/3">
                        <div className="product  shadow-lg h-full bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden relative text-justify">
                          <div className="text-xs font-bold text-white-500">
                            INVOICE NO: {idx + 1}
                          </div>
                          <br />
                          <h1 className="">Product name</h1>
                          <p className="tracking-widest text-xl title-font font-medium text-white ">
                            {item.name}
                          </p>
                          <br />

                          <h1>Time stamp</h1>
                          <p className="tracking-widest text-xl title-font font-medium text-white mb-1 py-2">
                            {" "}
                            {ethers.utils.formatEther(item.invoiceDate, 0) *
                              1000000000000000000}
                          </p>
                          <br />
                          <h1>Product Price</h1>
                          <p className="tracking-widest text-xl title-font font-medium text-white mb-1 py-2">
                            {" "}
                            {ethers.utils.formatEther(item.invoiceAmount, 0) *
                              1000000000000000000}
                          </p>
                          <br />
                          <br />
                          <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4"></div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default userdetails;

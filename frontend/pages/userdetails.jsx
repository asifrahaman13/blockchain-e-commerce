import axios from "axios";
import { ethers } from "ethers";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import getContractObject from "../components/contractobject/contractobject";
import {
  buyersData,
  sellersData,
  getProductsSoldBySeller,
  getProductsBoughtByBuyer,
} from "../pages/api/contract";

const owner_address = process.env.NEXT_PUBLIC_OWNER;

const userdetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products_sold, setProductSold] = useState([]);
  const [product_bought, setProductBought] = useState([]);
  const [contract, setContract] = useState("");
  const [data, setData] = useState([]);
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

  const [sellersdata, setSellersData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res_contract = await getContractObject();
      setContract(res_contract);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const main = async () => {
      if (typeof window !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
         

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


  const CancelProduct = async (product_id) => {
    setIsLoading(true);
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 15000);
    try {
      const tx = await contract.cancel(product_id);
      if (tx.length != 0) {
        setIsLoading(false);
      } else {
        console.error("Something went wrong.");
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    } catch (err) {
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    }
  };

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
        return userDetails;
      } catch (error) {
        console.log(error);
      }
    }

    if (access_token) {
    
      fetchDetails(access_token).then((userDetails) => {
        setUserDetails(userDetails);
        if (contract) {
          sellersData(contract, userDetails.sellerspan, setSellersData);
          buyersData(contract, userDetails.buyersPan, setData);

          getProductsSoldBySeller(
            contract,
            userDetails.contractAddress,
            setProductSold
          );
          getProductsBoughtByBuyer(
            contract,
            userDetails.contractAddress,
            setProductBought
          );
        }
      });
    }
  }, [contract]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="0">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
              <div className="product shadow rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/007/522/853/small/business-man-icon-for-your-web-profile-free-vector.jpg"
                    className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                  ></img>
                  <h1 className="text-xl font-bold text-white ">
                    {" "}
                    {userDetails.fullName}
                  </h1>
                  <p className="text-gray-600"> {userDetails.role}</p>
                  <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <a
                      href="#"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      {userDetails.email}
                    </a>
                    <a
                      href="#"
                      className="text-white bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
                    >
                      {userDetails.department}
                    </a>
                  </div>
                </div>
                <hr className="my-6 border-t border-gray-300" />
                <div className="flex flex-col">
                  <span className="text-gray-600 uppercase font-bold tracking-wider mb-2">
                    Company Name
                  </span>
                  <ul>
                    <li className="mb-2 text-white ">
                      {userDetails.companyName}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
              <div className="product shadow rounded-lg p-6">
                <h3 className="font-semibold text-center mt-3 -mb-2 text-white ">
                  {userDetails.fullName}
                </h3>

                <h2 className="text-xl font-bold mt-6 mb-4 text-white ">
                  My Details
                </h2>
                <div className="mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-bold">
                      Contract Address Registered
                    </span>
                  </div>
                  <p className="mt-2 text-white ">
                    {userDetails.contractAddress}
                  </p>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-bold">Buyers Pan</span>
                  </div>
                  <p className="mt-2 text-white ">{userDetails.buyersPan}</p>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-bold">Seller Pan</span>
                  </div>
                  <p className="mt-2 text-white ">{userDetails.sellersPan}</p>
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

          <center>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              See buyers invoice
            </h1>
          </center>

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
                          <p className="tracking-widest text-xl title-font font-medium text-white mb-1 py-2">
                            {" "}
                            {item.invoiceDate.toString()}
                          </p>
                          <br />
                          <h1>Product Price</h1>
                          <p className="tracking-widest text-xl title-font font-medium text-white mb-1 py-2">
                            {" "}
                            {item.invoiceAmount.toString()}
                          </p>
                          <br />

                          <br />
                          <h1>Sellers Transaction Id</h1>
                          <p className="tracking-widest text-sm title-font font-medium text-white mb-1">
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

          <center>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              See all the sellers invoice
            </h1>
          </center>

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
                            {ethers.utils.formatEther(item.invoiceDate) * 1e18}
                          </p>
                          <br />
                          <h1>Product Price</h1>
                          <p className="tracking-widest text-xl title-font font-medium text-white mb-1 py-2">
                            {" "}
                            {ethers.utils.formatEther(item.invoiceAmount) *
                              1e18}
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
          <center>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              See all the Products sold
            </h1>
          </center>

          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap -m-4">
                {products_sold.map((item, idx) => {
                  return (
                    <>
                      <div className="p-4 lg:w-1/3">
                        <div className="product  shadow-lg h-full bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden relative text-justify">
                          <div className="text-xs font-bold text-white-500">
                            INVOICE NO: {idx + 1}
                          </div>
                          <br />
                          <h1 className="">Product name</h1>
                          <Link href={`/products/${item}`}>
                            <p className="tracking-widest text-sm title-font font-medium text-white ">
                              {item}
                            </p>
                          </Link>
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

          <center>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              See all the Products you purchased
            </h1>
          </center>

          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap -m-4">
                {product_bought.map((item, idx) => {
                  return (
                    <>
                      <div className="p-4 lg:w-1/3">
                        <div className="product  shadow-lg h-full bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden relative text-justify">
                          <div className="text-xs font-bold text-white-500">
                            INVOICE NO: {idx + 1}
                          </div>
                          <br />
                          <h1 className="">Product name</h1>
                          <Link href={`/products/${item}`}>
                            <p className="tracking-widest text-sm title-font font-medium text-white ">
                              {item}
                            </p>
                          </Link>
                          <br />

                          <button
                            className="flex mx-auto text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-gray-600 rounded text-lg"
                            onClick={(e) => {
                              CancelProduct(item);
                            }}
                          >
                            CANCEL THIS PRODUCT NOW
                          </button>

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

import React, { useState, useEffect } from "react";
import getContractObject from "../components/contractobject/contractobject";
import { ethers } from "ethers";

const orders = () => {
  const [contract, setContract] = useState("");
  const [data, setData] = useState([]);
  const [pan, setPan] = useState("");
  const [productid, setProductid] = useState("");
  const [trackdetails, setTrackdetails] = useState("");
  const [agent, setAgent] = useState("");
  const [paid, setPaid] = useState("");
  const [delivered, setDelivered] = useState("");
  const [sellerspan, setSellerspan] = useState("");
  const [sellersdata, setSellersData] = useState([]);
  const [cancel, setCancel] = useState(0);
  const [trackData, setTrackdata] = useState({
    status: "",
    owner: "",
    timelock: "",
  });

  useEffect(() => {
    async function fetchData() {
      const res_contract = await getContractObject();
      console.log(res_contract);
      setContract(res_contract);
    }

    fetchData();
  }, []);

  const display = async (e) => {
    e.preventDefault();
    const tx = await contract.DetailsFromPan(pan);
    setData(tx);
  };

  const track = async (e) => {
    e.preventDefault();
    try {
      const setStatusCode = (n) => {
        if (n == 0) {
          return "Available for sale";
        }
        if (n == 1) {
          return "Ordered";
        } else if (n == 3) {
          return "Paid by buyer";
        } else if (n == 4) {
          return "Product sold out";
        } else {
          return n;
        }
      };
      const tx = await contract.track_Status(productid);
      const status = tx.Status;
      console.log("The status is: ", tx.Status);
      console.log(tx.Buyer_Owner);
      console.log();

      setTrackdetails(status);
      setTrackdata({
        status: setStatusCode(status),
        owner: tx.Buyer_Owner,
        timelock: ethers.utils.formatEther(tx.Time_Lock, 0) * 1e18,
      });
      // if (tx.length != 0) {
      //   console.success("product information is available");
      // }
    } catch (err) {
      console.error("No such product is available");
    }
  };

  const addDeliveryAgent = async () => {
    try {
      const tx = await contract.AddDeleveryAgent(agent);

      console.success("Delivery agent has been succesffully added");
    } catch (err) {
      console.error("Delivery agent not added");
    }
  };

  const pricePaid = async () => {
    try {
      const tx = await contract.AmountPaid(paid);
      console.success("Data stored successfully");
      console.log(tx);
    } catch (err) {
      console.error("Message not added to blockchain", err);
    }
  };

  const itemDelivered = async () => {
    try {
      const tx = await contract.delivered(delivered);
      if (tx.length == 0) {
        console.error("Somthing went wrong");
      } else {
        console.success("Message sent successfully.");
      }
    } catch (err) {
      console.error("Message not added to blockchain", err);
    }
  };

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

  const CancelProduct = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.cancel(cancel);
    } catch (err) {
      if (cancel == "") {
        console.error("Please enter a id");
      } else {
        console.error("Somthing went wrong", err);
      }
    }
  };

  const [sender, setSender] = useState("");
  const [isOwner, setIsOwner] = useState(false);
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

  return (
    <>
      {isOwner && (
        <section className=" text-gray-700 body-font relative">
          <div className="container mx-auto px-5 py-12">
            <div className="flex flex-col text-center w-full mb-8">
              <h1 className="text-3xl font-semibold text-white">
                Add Delivery Agent (Authority)
              </h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                Add a delivery agent for product delivery.
              </p>
            </div>
            <div className="w-full max-w-md mx-auto">
              <div className="relative mb-4">
                <label htmlFor="name" className="text-sm text-white">
                  Address of the Delivery Agent
                </label>
                <input
                  name="agent"
                  onChange={(e) => {
                    setAgent(e.target.value);
                  }}
                  type="text"
                  placeholder="Enter delivery agent (only authorized people)"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 bg-gray-200 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="text-center">
                <button
                  onClick={addDeliveryAgent}
                  className="bg-indigo-500 text-white border-0 py-2 px-6 rounded-full hover:bg-indigo-600 focus:outline-none text-lg"
                >
                  Add Agent
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 p-4">
          <div className="product bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden relative text-justify">
            <h1 className="text-2xl font-medium title-font mb-4 text-white">
              DELIVERY AGENT
            </h1>
            <p className="text-base text-gray-200">
              Whether Amount is paid by the user (enter the product id)
            </p>
            <label for="name" className="leading-7 text-sm text-white">
              Enter the product Id
            </label>
            <input
              name="paid"
              onChange={(e) => {
                setPaid(e.target.value);
              }}
              type="text"
              placeholder="Enter the id of the product which is paid"
              id="paid"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-gray focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            <button
              onClick={pricePaid}
              className="mt-4 text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-gray-600 rounded text-lg"
            >
              AMOUNT PAID
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-4">
          <div className="product bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden relative text-justify">
            <h1 className="text-2xl font-medium title-font mb-4 text-white">
              DELIVERY AGENT
            </h1>
            <p className="text-base text-gray-200">
              Whether item is delivered (enter product id)
            </p>
            <label for="name" className="leading-7 text-sm text-white">
              Enter the product Id of the product delivered
            </label>
            <input
              name="agent"
              onChange={(e) => {
                setDelivered(e.target.value);
              }}
              type="text"
              placeholder="Enter the id of the product delivered"
              id="delivered"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-gray focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            <button
              onClick={itemDelivered}
              className="mt-4 text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-gray-600 rounded text-lg"
            >
              DELIVERED
            </button>
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
                        <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden relative text-justify">
                          <div className="text-xs font-bold text-white-500">
                            INVOICE NO: {idx + 1}
                          </div>
                          <br />
                          <h1 className="tracking-widest text-xl title-font font-medium text-gray-400 mb-1 py-2">
                            Product name
                          </h1>
                          <p>{item.name}</p>
                          <br />

                          <h1 className="tracking-widest text-xl title-font font-medium text-gray-400 mb-1 py-2">
                            Time stamp
                          </h1>
                          <p> {item.invoiceDate.toString()}</p>
                          <br />
                          <h1 className="tracking-widest text-xl title-font font-medium text-gray-400 mb-1 py-2">
                            Product Price
                          </h1>
                          <p className="leading-relaxed mb-3">
                            {" "}
                            {item.invoiceAmount.toString()}
                          </p>
                          <br />
                          <h1 className="tracking-widest text-xl title-font font-medium text-gray-400 mb-1 py-2">
                            Product Description
                          </h1>
                          <p className="leading-relaxed mb-3">
                            {item.ProductDescription.toString()}
                          </p>
                          <br />
                          <h1 className="tracking-widest text-xl title-font font-medium text-gray-400 mb-1">
                            Sellers Transaction Id
                          </h1>
                          <p className="leading-relaxed mb-3">
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
                        <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden relative text-justify">
                          <div className="text-xs font-bold text-white-500">
                            INVOICE NO: {idx + 1}
                          </div>
                          <br />
                          <h1 className="tracking-widest text-xl title-font font-medium text-gray-400 mb-1 py-2">
                            Product name
                          </h1>
                          <p>{item.name}</p>
                          <br />

                          <h1 className="tracking-widest text-xl title-font font-medium text-gray-400 mb-1 py-2">
                            Time stamp
                          </h1>
                          <p>
                            {" "}
                            {ethers.utils.formatEther(item.invoiceDate, 0) *
                              1000000000000000000}
                          </p>
                          <br />
                          <h1 className="tracking-widest text-xl title-font font-medium text-gray-400 mb-1 py-2">
                            Product Price
                          </h1>
                          <p className="leading-relaxed mb-3">
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

      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white-600">
              TRACK YOUR PRODUCT
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
              Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
              gentrify.
            </p>
          </div>
          <div>
            <div>
              <div>
                <div className="relative">
                  <label for="name" className="leading-7 text-sm text-white">
                    Enter the product Id you want to track
                  </label>
                  <input
                    name="pan"
                    onChange={(e) => {
                      setProductid(e.target.value);
                    }}
                    type="text"
                    placeholder="Track your product with product id(only available if you purchased)"
                    id="name"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-gray focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div className="p-2 w-full">
                <button
                  onClick={track}
                  className="flex mx-auto text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-gray-600 rounded text-lg"
                >
                  Track your order
                </button>

                <section className="text-gray-600 body-font overflow-hidden">
                  <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                      <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                        <h1 className="text-white-600 text-3xl title-font font-medium mb-4">
                          Track your product{" "}
                        </h1>
                        <div className="flex mb-4"></div>
                        <p className="leading-relaxed mb-4 text-white">
                          You can track all the details of your shipment here in
                          the block.
                        </p>
                        <div className="flex border-t border-gray-200 py-2">
                          <span className="text-gray-500">
                            status of your product
                          </span>
                          <span className="ml-auto text-white">
                            {trackData.status}
                          </span>
                        </div>
                        <div className="flex border-t border-gray-200 py-2">
                          <span className="text-gray-500">
                            address to track
                          </span>
                          <span className="ml-auto text-white">
                            {" "}
                            {trackData.owner}
                          </span>
                        </div>
                        <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                          <span className="text-gray-500">Time lock</span>
                          <span className="ml-auto text-white">
                            {trackData.timelock}
                          </span>
                        </div>
                        <div className="flex">
                          <button className="flex ml-auto text-white bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded">
                            VIEW ON ETHERSCAN
                          </button>
                          <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                            <svg
                              fill="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <img
                        alt="ecommerce"
                        className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                        src="https://img.freepik.com/free-vector/characters-people-holding-blockchain-network_53876-26824.jpg?w=2000"
                      />
                    </div>
                  </div>
                </section>

                <section className="text-white body-font relative">
                  <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white-600">
                        CANCEL PRODUCT
                      </h1>
                      <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                        Cancel prodcuct delivery using product Id
                      </p>
                    </div>
                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                      <div>
                        <div className="p-2">
                          <div className="relative">
                            <label
                              for="name"
                              className="leading-7 text-sm text-white"
                            >
                              Enter Product Id
                            </label>
                            <input
                              type="text"
                              placeholder="Enter the product Id you want to cancel"
                              id="product_id"
                              name="product_id"
                              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-black-500 focus:bg-gray focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                              onChange={(e) => {
                                setCancel(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="p-2 w-full">
                          <button
                            className="flex mx-auto text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-gray-600 rounded text-lg"
                            onClick={CancelProduct}
                          >
                            CANCEL THIS PRODUCT NOW
                          </button>
                        </div>
                      </div>
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

export default orders;

import React, { useState, useEffect } from "react";
import getContractObject from "./contractobject/contractobject";

const Singleprod = ({ product }) => {
  const [buyers_pan, setBuyers_pan] = useState("");
  const [buyersName, setBuyersName] = useState("");
  const [contract, setContract] = useState("");

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
    console.log("Cliocked");
    try {
      const tx = await contract.Buy(prod_details.id, buyers_pan, buyersName);
      if (tx.length != 0) {
        console.success("You brought this product successfully");
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
              </div>
            </div>

            <div class=" xl:w-1/2 md:w-1/2 p-4">
              <div class="product p-6 rounded-lg">
                <h2 class="text-lg text-gray-100 font-medium title-font mb-4 ">
                  Colosseum Roma
                </h2>
                <section className="text-white body-font relative">
                  <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-pink-600">
                        Buy any product here
                      </h1>
                      <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
                        Buy the products
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
                              Product Id
                            </label>
                            <div
                              id="message"
                              placeholder="Enter your product's id:Please note that it should be unique"
                              name="message"
                              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-white-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out text-yellow-500"
                            >{`Your Product id is:${prod_details.id}`}</div>
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="relative">
                            <label
                              for="email"
                              className="leading-7 text-sm text-white"
                            >
                              Buyer pan(Should be of 12 digit)
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your buyer's pan"
                              id="buyers_pan"
                              name="buyers_pan"
                              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                              onChange={(e) => {
                                setBuyers_pan(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="relative">
                            <label
                              for="email"
                              className="leading-7 text-sm text-white"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your name"
                              id="name"
                              name="name"
                              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                              onChange={(e) => {
                                setBuyersName(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="p-2 w-full">
                          <button
                            className="flex mx-auto text-white bg-pink-500 border-0 py-2 px-8 focus:outline-none hover:bg-pink-600 rounded text-lg"
                            onClick={BuyOnchain}
                          >
                            BUY THIS PRODUCT NOW
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

export default Singleprod;

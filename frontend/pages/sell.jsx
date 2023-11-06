import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import getContractObject from "@/components/contractobject/contractobject";
import axios from "axios";

const Sell = () => {
  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [productname, setproductname] = useState("");
  const [description, setdescription] = useState("");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState();
  const [myipfsHash, setIPFSHASH] = useState("");

  const [contract, setContract] = useState("");

  const main = async () => {
    const res_contract = await getContractObject();
    console.log(res_contract);

    setContract(res_contract);
  };

  useEffect(() => {
    main();
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("file", file);

      const API_KEY = process.env.NEXT_PUBLIC_APIKEY;
      const API_SECRET = process.env.NEXT_PUBLIC_SECRETKEY;

      const url = process.env.NEXT_PUBLIC_PINATA;

      const response = await axios.post(url, formData, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
          pinata_api_key: API_KEY,
          pinata_secret_api_key: API_SECRET,
        },
      });
      const res = await response.data.IpfsHash;

      setIPFSHASH(res);
      console.log(myipfsHash);

      if (response != "") {
        console.log("success");
      } else {
        console.log("wrong");
      }
    } catch (err) {
      console.log("wrong");
    }
  };

  const submitOnChain = async (e) => {
    e.preventDefault();
    console.log(name, pan, productname, description, price, myipfsHash);
    try {
      const tx = await contract.Submit(
        name,
        pan,
        productname,
        description,
        price,
        myipfsHash
      );
      console.log(tx);
      if (tx.length != 0) {
        console.log("Fine");
      } else {
        console.log("something went wrong");
      }
    } catch (err) {
      console.log("something went wrong");
    }
  };

  const showProducts = async (e) => {
    e.preventDefault();
    try {
      const p = await contract.AvailableProducts();
      const a = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      };

      setB(a(p.slice(0, 6)));
    } catch (err) {
      console.log("something went wrong");
    }
  };
  return (
    <>
      <section className="text-white body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-100">
              List Your Products Here
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-100">
              List all the products and enter the details of the products into
              it.{" "}
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div>
              <div className="p-2">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="leading-7 text-sm text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name e.g John Wick"
                    id="name"
                    name="name"
                    className="w-full bg-gray-50 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out text-black"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="leading-7 text-sm text-white"
                  >
                    Sellers pan(should be 12 digit number)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your 12 digit sellers pan"
                    id="pan"
                    name="email"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    onChange={(e) => {
                      setPan(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="leading-7 text-sm text-white"
                  >
                    Product name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your product name"
                    id="email"
                    name="email"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    onChange={(e) => {
                      setproductname(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="leading-7 text-sm text-white"
                  >
                    Product Description
                  </label>
                  <textarea
                    id="message"
                    placeholder="Enter your product's description"
                    name="message"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    onChange={(e) => {
                      setdescription(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
              <div className="p-2">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="leading-7 text-sm text-white"
                  >
                    Product Price
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your product's price"
                    name="email"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="leading-7 text-sm text-white"
                  >
                    UPLOAD FILE
                  </label>
                  <input
                    type="file"
                    id="file"
                    placeholder="Upload the file"
                    name="file"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>
              <button
                className="flex mx-auto text-black bg-white border-0 py-2 px-8 focus:outline-none"
                onClick={upload}
              >
                UPLOAD THE FILE
              </button>

              {myipfsHash && (
                <div className="product">
                  <div className="p-2 w-full">
                    <div className="relative">
                      <label
                        htmlFor="message"
                        className="leading-7 text-sm text-white"
                      >
                        Product ID
                      </label>
                      <div
                        id="message"
                        placeholder="Enter your product's id:Please note that it should be unique"
                        name="message"
                        className="w-full text-black bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-white-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                      >{`Your Product id is: ${myipfsHash}`}</div>
                    </div>
                  </div>
                  <div className="p-2 w-full">
                    <button
                      className="flex mx-auto text-black bg-white border-0 py-2 px-8 focus:outline-none"
                      onClick={submitOnChain}
                    >
                      LIST YOUR PRODUCT NOW
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sell;

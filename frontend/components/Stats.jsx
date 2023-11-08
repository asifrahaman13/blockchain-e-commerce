import { ethers } from "ethers";
import NavLink from "next/link";
import { useEffect, useState } from "react";
import Loader from "./Loader";

import getContractObject from "./contractobject/contractobject";

const Stats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subscribers, setSubscribers] = useState([""]);
  const [stat, setStat] = useState({
    total_products: 0,
    total_buyers: 0,
    total_sellers: 0,
  });

  const [contract, setContract] = useState("");

  const main = async () => {
    const res_contract = await getContractObject();
    console.log(res_contract);

    setContract(res_contract);
  };

  useEffect(() => {
    main();
  }, []);

  useEffect(() => {
    if (contract) {
      stats();
      showSubscribers();
    }
  }, [contract]);

  const subscribe = async () => {
    setIsLoading(true);

    try {
      const tx = await contract.subscibe();
      setIsLoading(false);
      if (tx) {
        if (tx.length != 0) {
          console.error("Something went wrong.");
        }
      }
    } catch (err) {
      console.error("Something went wrong");
    }
  };

  const showSubscribers = async () => {
    try {
      const tx = await contract.showSubscribers();
      setSubscribers(tx.slice(0, 20));
    } catch (err) {
      console.error("Something went wrong.");
    }
  };

  const stats = async () => {
    try {
      const tx1 = await contract.TotalSellers();
      const tx2 = await contract.TotalBuyers();
      const tx3 = await contract.TotalProducts();
      setStat({
        total_products: ethers.utils.formatEther(tx1, 0) * 1e18,
        total_buyers: ethers.utils.formatEther(tx2, 0) * 1e18,
        total_sellers: ethers.utils.formatEther(tx3, 0) * 1e18,
      });
      if (tx1.length != 0 && tx2.length != 0 && tx3.length != 0) {
      } else {
        console.error("Something went wrong");
      }
    } catch (err) {
      console.error("Somthing went wrong", err);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <button id="stats" onClick={stats}></button>
      <section className="text-gray-400 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <div className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
            <div className="w-full sm:p-4 px-4 mb-6">
              <h1 className="title-font font-medium text-xl mb-2 text-gray-600">
                Welcome to the blockmerse{isLoading}
              </h1>
              <div className="leading-relaxed text-gray-100">
                In this platform you can securely have your products listed and
                anyone can buy your products. You can also track your invoices
                through your pan card ids. .
              </div>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl text-white">
                {stat.total_products}
              </h2>
              <p className="leading-relaxed">Total sellers</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl text-white">
                {stat.total_buyers}
              </h2>
              <p className="leading-relaxed">Total Buyers</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl text-white">
                {stat.total_sellers}
              </h2>
              <p className="leading-relaxed">Total Products</p>
            </div>
          </div>
          <div className="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
            <img
              className="object-cover object-center w-full h-full opacity-30"
              src="https://w0.peakpx.com/wallpaper/719/228/HD-wallpaper-bitcoin-logo-black-background-bitcoin-logo.jpg"
              alt="stats"
            />
          </div>
          <button
            className="inline-flex items-center bg-gray-600 border-0 py-1 px-3 focus:outline-none hover:bg-pink-600 rounded text-base mt-4 md:mt-0 text-pink-100 mx-1 font-bold"
            onClick={subscribe}
          >
            SUBSCRIBE
          </button>
          <NavLink href="/contact">
            <button className="inline-flex items-center bg-gray-600 border-0 py-1 px-3 focus:outline-none hover:bg-pink-600 rounded text-base mt-4 md:mt-0 text-pink-100 font-bold">
              CONTACT US
            </button>
          </NavLink>
        </div>
      </section>
      <center>
        <h1 className="text-3xl font-medium title-font text-gray-100 mb-12 text-center">
          OUR RECENT SUBSCRIBERS
        </h1>
        <div className="w-2/3 text-sm font-medium text-gray-900 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center">
          {subscribers.map((item, idx) => {
            return (
              <>
                <button
                  type="button"
                  className="product w-full px-4 py-2 font-medium border
                "
                >
                  {item}
                </button>
              </>
            );
          })}
        </div>
      </center>
    </>
  );
};

export default Stats;

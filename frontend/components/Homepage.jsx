import React, { useState, useEffect } from "react";
import getContractObject from "./contractobject/contractobject";
import ProductCard from "./ProductCard"; // Import your ProductCard component
import Stats from "./Stats"; // Import your Stats component

const Homepage = () => {
  const [homedisplay, setHomedisplay] = useState([]);
  const [contract, setContract] = useState("");

  async function whetherAvailable(id) {
    const isAvailable = await contract.track_Status(id);
    return isAvailable.Status === 0; // 0 represents 'available' status
  }
  
  async function showProducts() {
    try {
      const availableProducts = [];
      const products = await contract.AvailableProducts();
  
      for (const product of products) {
        if (await whetherAvailable(product.product_id)) {
          availableProducts.push(product);
        }
      }
  
      // Now, you have the available products in the 'availableProducts' array
      // You can set 'availableProducts' to 'Homedisplay' or use it as needed.
      setHomedisplay(availableProducts);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const res_contract = await getContractObject();
      setContract(res_contract);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (contract) {
      showProducts();
    }
  }, [contract]);

  return (
    <>
    <Stats/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-center items-center mt-32">
        {homedisplay.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </>
  );
};

export default Homepage;

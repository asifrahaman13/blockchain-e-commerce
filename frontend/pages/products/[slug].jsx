import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SingleProduct from "../../components/SingleProduct";
import getContractObject from "../../components/contractobject/contractobject";
import axios from "axios";
import { ethers } from "ethers";

const Slug = () => {
  const [contract, setContract] = useState("");
  const [productdetails, setProduct]=useState({})

  useEffect(() => {
    async function fetchData() {
      const res_contract = await getContractObject();
      console.log(res_contract);
      setContract(res_contract);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (contract) {
      getDetails();
    }
  }, [contract]);

  const router = useRouter();
  console.log(router.query.slug);


  async function getDetails() {
    const response = await contract.ProductsDetails(router.query.slug);
    const price = await response.Product_Price;
    const formattedPrice = ethers.utils.formatEther(price) * 1e18;
  
    // Create a new object with the properties from the 'response' object
    const updatedResponse = { ...response, price: formattedPrice };
    
    setProduct(updatedResponse);
    console.log(updatedResponse);
  }
  

  return (
    <>
      <SingleProduct product={productdetails}/>
    </>
  );
};

export default Slug;

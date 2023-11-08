const buyersData = async (contract, buyerspan, setData) => {
  try {
    const tx = await contract.DetailsFromPan(buyerspan);
    setData(tx);
  } catch (err) {
    console.log(err);
  }
};


const sellersData = async (contract, sellerspan, setSellersData) => {
  console.log("Sellers")
  try {
    // Uncomment these lines once you've confirmed everything else is working
    const tx = await contract.SellersDetails(sellerspan);

    setSellersData(tx);

    // Check if the result is empty (no product sales)
    if (tx.length === 0) {
      console.error("No products sold by this seller.");
    } else {
      console.log("Seller's product sales data is successfully available");
    }
  } catch (err) {
    console.error("Something went wrong fetching sellers data:", err);
  }
};

async function getProductsSoldBySeller(contract, contractAddress, setProductSold) {
  try {

    // Call GetProductsSoldBySeller
    const tx = await contract.GetProductsSoldBySeller(contractAddress);

    setProductSold(tx);
  } catch (err) { }
}

async function getProductsBoughtByBuyer(contract, contractAddress, setProductBought) {
  try {

    // Call GetProductsSoldBySeller
    const tx = await contract.GetProductsBoughtByBuyer(contractAddress);
    console.log("The contract details is:", contractAddress, tx);
    setProductBought(tx);
  } catch (err) { }
}



export { sellersData, buyersData, getProductsSoldBySeller, getProductsBoughtByBuyer }
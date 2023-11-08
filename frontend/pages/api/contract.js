const buyersData = async (contract, buyerspan, setData) => {
    try {
      const tx = await contract.DetailsFromPan(buyerspan);
      setData(tx);
    } catch (err) {
      console.log(err);
    }
  };

  export default buyersData
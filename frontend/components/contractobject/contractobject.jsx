import { ethers } from 'ethers';
import { default as credit } from "../contract/contract.json";
require("dotenv").config();

async function getContractObject(){
    try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT;

        const ABI = credit;

        const contract = new ethers.Contract(contractAddress, ABI, signer);
        return contract;
    }
    catch(err){
        console.log(err);
    }
}

export default getContractObject
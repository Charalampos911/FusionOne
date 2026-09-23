import { useMemo } from "react";
import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "./contractConfig";

const ANVIL_RPC = "http://127.0.0.1:8545";

export const useContract = (signer = null) => {
  // Use BrowserProvider if MetaMask exists, otherwise fallback to local RPC
  const provider = useMemo(() => {
    return window.ethereum 
      ? new ethers.BrowserProvider(window.ethereum) 
      : new ethers.JsonRpcProvider(ANVIL_RPC);
  }, []);

  const contract = useMemo(() => {
    // If no signer provided, pass provider (Read-Only Mode)
    const connection = signer || provider; 

    console.log( "CONTRACT_CONFIG.address==",   CONTRACT_CONFIG.address)
  console.log( "CONTRACT_CONFIG.address==",   CONTRACT_CONFIG.abi)
    return new ethers.Contract(
      CONTRACT_CONFIG.address,
      CONTRACT_CONFIG.abi,
      connection
    );
  }, [signer, provider]);

  return { contract, provider };
};
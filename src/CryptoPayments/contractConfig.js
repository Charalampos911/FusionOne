// contractConfig.js
import CMS_Ether_BankABI from "../contracts/CMS_Ether_Bank.sol/CMS_Ether_Bank.json"; // ← your single contract ABI




// export const CONTRACT_ADDRESS = "0x6902DF9612da8946ed557E9a911bd1993853D9ab"; // localhost

export const CONTRACT_ADDRESS = "0xB6fde467db5f1756bC249D853fF4c4c53E3B9DbC"; // server

export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS,
  abi: CMS_Ether_BankABI.abi,
};
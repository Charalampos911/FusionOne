import { useState } from "react";
import { ethers } from "ethers";
import AddNewTenantButton from "./AddNewTenantButton"; // Adjust path
import FormButton from "../../components/NewUI/FormButton"; // Adjust path

export default function AddNewTenantForm({OrganizationId, Department,ChangeSelection}) {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");

  const [message, setMessage] = useState("");

  console.log("Department===111==>",Department)
  const connectWallet = async () => {
    setMessage("Connecting...")
    if (!window.ethereum) {
      setMessage("MetaMask is not installed!")
      return;
    }

    try {
      // 1. Initialize the browser provider wrapped around MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // 2. Request account access from the user
      await provider.send("eth_requestAccounts", []);
      
      // 3. Extract the signer profile object
      const userSigner = await provider.getSigner();
      console.log("userSigner===",userSigner)
      // 4. Save state variables
      setSigner(userSigner);
      setAccount(await userSigner.getAddress());
      setMessage("Wallet connected! Signer ready.")
      console.log("Wallet connected! Signer ready.");
    } catch (error) {
      console.error("User denied account access or error occurred:", error);
      setMessage("User denied account access .")
    }
  };

  return (
    <div className="NewCryptoTenant">
      <div onClick={()=>ChangeSelection()}>Go back</div>
      <h2>Setup crypto payments for -{Department.Name}-</h2>
      
      {!account ? (
        <FormButton text={"Connect MetaMask Wallet"} onClick={connectWallet}/>
      ) : (
        <div>
          <p>Connected Account: &nbsp;
            <code>
              {account ? `${account.slice(0, 5)}*****${account.slice(-5)}` : "Not Connected"}
            </code>
          </p>
          {/* STEP 2: Pass the signer profile directly as a prop here */}
          <AddNewTenantButton signer={signer} OrganizationId={OrganizationId} DepartmentId={Department.Id} TransactionSuccess={()=>setMessage("✅ Transaction confirmed!")} TransactionFailure={(e)=>setMessage(e)}/>
        </div>
      )}
      <div>{message}</div>
    </div>
  );
}
import React, { useState,useRef,useEffect } from 'react';
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import { useContract } from "../useContract";
import { callContractFunction } from "../callContractFunction";
import { apiRequest } from '../../Redux/features/ApiReducer';
import FormButton from '../../components/NewUI/FormButton';


export default function AddNewTenantButton({ signer, OrganizationId,  DepartmentId ,TransactionSuccess,TransactionFailure}) {
    const { contract } = useContract(signer);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch(); 
    console.log("signer==",signer)
    console.log("OrganizationId==",OrganizationId)
    console.log("DepartmentId==",DepartmentId)
  // Helper to hash string GUIDs to bytes32 matching Solidity keccak256
  const formatGuid = (guid) => {
    // 1. Strip out the hyphens: "123e4567-e89b..." -> "123e4567e89b..."
    const cleanHex = guid.replace(/-/g, "");
    
    // 2. Pad it to 32 bytes (64 hex characters) just in case it's short, 
    // though standard GUIDs are exactly 32 hex characters.
    const paddedHex = cleanHex.padEnd(64, "0");

    // 3. Add the '0x' prefix so Ethers and Solidity treat it as direct hex data
    return "0x" + paddedHex;
  };
  const handleAddNewTenant = async (OrganizationId,DepartmentId, TransactionSuccess) => {
    setLoading(true);

          try {
            const Bytes32OrgabizationId = formatGuid(OrganizationId);
            const Bytes32deptGuid = formatGuid(DepartmentId);
            console.log("Bytes32OrgabizationId====>",Bytes32OrgabizationId)
             console.log("Bytes32deptGuid====>",Bytes32deptGuid)
             console.log("contract====>",contract)
            await callContractFunction(
              contract,
              "addTenant",          // Function name
              "TenantAdded",         // Listen for this event
              (eventData) => {
                console.log("UI Callback: Payment registration updated!", eventData);
                if (TransactionSuccess) {
                        TransactionSuccess();
                    }
              },
              false,                // isView
              undefined,            // msg.value attached
              [Bytes32OrgabizationId,Bytes32deptGuid], // Arguments array
              undefined,            // IsLarge
              (messageData) => {
                console.log("UI ERRORS ARRAY", messageData);
                TransactionFailure(messageData)
              },
            );
          } catch (e) {
            console.error("Payment Routine Failed", e);
            console.log("handleAddNewTenant===555===>")
          } finally {
            setLoading(false);
            console.log("handleAddNewTenant===666===>")
          }
        
        
  }

  return (
    <div>
      <FormButton text={loading ? "Processing..." : "Send"} onClick={()=>handleAddNewTenant(OrganizationId,DepartmentId,TransactionSuccess)} disabled={loading}/>
      {/* <button 
        onClick={() => handleAddNewTenant(OrganizationId,DepartmentId)} 
        disabled={loading}
      >
        {loading ? "Processing..." : "Send"}
      </button> */}
    </div>
  );
}
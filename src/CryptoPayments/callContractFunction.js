import { ethers } from "ethers";


// Full example
  // await callContractFunction(
  //   contract,
  //   "addTenant",          // Function name
  //   "TenantAdded",         // Listen for this event
  //   (eventData) => {
  //     console.log("UI Callback: Payment registration updated!", eventData);
  //     if (TransactionSuccess) {
  //             TransactionSuccess();
  //         }
  //   },
  //   false,                // isView
  //   undefined,            // msg.value attached
  //   [Bytes32OrgabizationId,Bytes32deptGuid], // Arguments array
  //   undefined,            // IsLarge
  //   (messageData) => {
  //     console.log("UI ERRORS ARRAY", messageData);
  //     TransactionFailure(messageData)
  //   },
  // );


export const callContractFunction = async (
  contract,
  functionName,
  eventName = undefined,
  eventCallback = undefined,
  isView = false,
  value = undefined,
  args = [],
  IsLarge = false,
  messageCallback = undefined
) => {
  try {
    console.log(`Calling ${functionName} with args:`, args);

    if (isView) {
      return await contract[functionName](...args);
    }

    // 1. Build the transaction execution arguments safely
    let finalArgs = [...args];
    const overrides = {};
    // Create the transaction overrides object
    // const overrides = {
    //   gasLimit: 300000 // <-- FORCE BYPASS GAS ESTIMATION DIRECTLY HERE
    // };

    // If an ETH payment is attached, include it in the overrides object
    if (value !== undefined && value !== null) {
      overrides.value = value;
    }

    // Push the final options config onto the end of the argument array
    if (IsLarge) {
      overrides.gasLimit = 300000;
    }

    if (Object.keys(overrides).length > 0) {
      finalArgs.push(overrides);
    }

    // 2. Spread the dynamically controlled arguments list
    const tx = await contract[functionName](...finalArgs);
    console.log("Transaction sent:", tx.hash);

    // Register the listener BEFORE awaiting tx.wait()
    if (eventName && eventCallback) {
      contract.once(eventName, (...eventArgs) => {
        console.log(`📡 Event ${eventName} captured:`, eventArgs);
        eventCallback(eventArgs);
      });
    }

    const receipt = await tx.wait();
    console.log(`✅ ${functionName} confirmed!`, receipt);

    return receipt;





} catch (error) {
  // 1. Try to find the raw revert hex data inside the Ethers error object
  const errorData = error.data || error.error?.data || error.receipt?.data;

  // 2. If Ethers already parsed it, check errorName directly
  if (error.errorName === "TxFailed") {
    const [reason, contextId, actor] = error.errorArgs;
    displayTxFailed(reason, contextId, actor,messageCallback);
  } 
  // 3. Fallback: If it happened during estimateGas, parse the raw hex data manually
  else if (errorData && errorData !== '0x') {
    try {
      // contract.interface contains the parsing definitions from your ABI
      const decodedError = contract.interface.parseError(errorData);
      
      if (decodedError && decodedError.name === "TxFailed") {
        const [reason, contextId, actor] = decodedError.args;
        displayTxFailed(reason, contextId, actor,messageCallback);
      } else {
        console.error("Reverted with a different error:", decodedError?.name);
      }
    } catch (parseError) {
      console.error("Could not parse raw revert data:", parseError);
    }
  } else {
    console.error("Other error:", error);
  }
}
};

// Helper function to keep your catch block clean
function displayTxFailed(reason, contextId, actor,messageCallback) {

  messageCallback("❌ Transaction Failed! "+reason)
  console.error("❌ Transaction Failed!");
  console.error(`Reason: ${reason}`);
  console.error(`Context ID (Bytes32): ${contextId}`);
  console.error(`Actor (Address): ${actor}`);
}
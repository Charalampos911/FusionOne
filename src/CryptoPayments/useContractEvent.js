// useContractEvent.js
import { useEffect } from "react";
import { useContract } from "./useContract";

export function useContractEvent({ signer, eventName, callback }) {
  const { contract } = useContract(signer);

  useEffect(() => {
    if (!contract || !eventName || !callback) return;

    console.log(`🔔 Listening to event: ${eventName}`);

    const listener = (...args) => {
      console.log(`📡 Event ${eventName} received:`, args);
      callback(...args);
    };

    contract.on(eventName, listener);

    return () => {
      contract.off(eventName, listener);
      console.log(`❌ Stopped listening to ${eventName}`);
    };
  }, [contract, eventName, callback]);
}

// Usage example:
useContractEvent({
  signer,
  eventName: "PlayerRegistered", // or whatever your event is called
  callback: (player, name, avatar) => {
    console.log("New player registered!", player, name, avatar);
    // update UI state
  },
});
#Server-Deployment
vite.config.js
main.jsx
ApiReducer.js




# Frontend 
npm install ethers
npm install qrcode.react
# Metamask
Local Anvil Fork
http://127.0.0.1:8545
31337
ETH

# Flow - Make the contracts
clear
cd ../
cd ../
cd Solution-master/CMS-Clients-CRYPTO-BANK/CONTRACT-MAKER
forge clean
forge build --sizes

// Copy from /out to /contracts

 
# Flow - Console #1
clear
cd ../
cd ../
cd fusionone/CMS-Clients-CRYPTO-BANK/CONTRACT-MAKER
//Make anvil to masqurade as the mainnet
anvil --port 8545 --chain-id 31337 --state anvil-state.json --accounts 10 --balance 2000 --mnemonic "charge chief core sail keen wire bus trophy dignity entry dove version" 

# Flow - Console #2
cd CMS-Clients-CRYPTO-BANK/CONTRACT-MAKER

export OWNER_KEY=0x654e91216663c4b7cc2af198708e5771820c95f7c9636a937abe3985965a9f5d
export RPC_URL=127.0.0.1:8545
export OWNER=0xa589ff2e5105bc820F0e6a9F21d1025b469dC506

forge create CMS_Ether_Bank --rpc-url $RPC_URL --private-key $OWNER_KEY --broadcast 


# Flow - Run the API from VS


# Flow - Console #3
cd CMS-Clients-API-REDUX-REACT
npm run dev


# Flow - Test account Admin

SEEDER1
123456

# Use #Sofia for the Bar of King


# Use #Nick for the first customer
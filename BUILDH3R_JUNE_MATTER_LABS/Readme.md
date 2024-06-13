# Challenge

1. Finish the quickstart session
2. Use GitHub to publish your progress, meaning all the code you learn
3. Write a technical overview of what you learned, share it on your Github as a Readme

## My process

### What I learned

#### Overview

This learning journey has provided a solid foundation in Ethereum smart contract development, deployment, and interaction. By working through practical tasks and publishing progress on GitHub, I've gained hands-on experience and built a portfolio of code that demonstrates my understanding of these concepts.

#### Smart Contracts Created

1. **TestToken.sol**

   - **What I Learned:**
     - How to create an ERC20 token using OpenZeppelin contracts.
     - Using inheritance to extend functionalities with `Ownable` and `ERC20Burnable`.
     - The importance of constructor parameters to initialize the token's name and symbol.
     - How to mint new tokens using a function restricted to the contract owner, burn them, check balances etc.

2. **ZeekSecretMessages.sol**

   - **What I Learned:**
     - Creating and managing a list of hashed messages stored on the blockchain.
     - Emitting events to signal the reception of messages.
     - Writing functions to interact with stored data, such as view last message, sending messages and counting the total messages.

3. **mint-token.ts**

   - **What I Learned:**
     - Interacting with Ethereum smart contracts using the ethers.js library.
     - Writing scripts to automate token minting and balance checking.
     - Understanding the process of initializing a contract instance and invoking contract functions.

4. **paymaster-transaction.ts**

   - **What I Learned:**
     - Using zkSync and paymasters to handle transaction fees.
     - Integrating with zkSync to send messages and manage token balances.
     - Estimating gas costs and setting up custom transaction parameters.

5. Result

- I have created tokens and owned them >>
  https://sepolia.explorer.zksync.io/address/0xeA2C4889A4bbe52ecAcd19Eb64a747Eaa9505e2E

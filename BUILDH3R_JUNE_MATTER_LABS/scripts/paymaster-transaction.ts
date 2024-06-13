import { utils, Web3Provider, Provider } from "zksync-web3";
import * as ethers from "ethers";

import { AtlasEnvironment } from "atlas-ide";
import TokenArtifact from "../artifacts/TestToken";
import ZeekMessagesArtifact from "../artifacts/ZeekSecretMessages";

// Address of the ZeekMessages contract
const ZEEK_MESSAGES_CONTRACT_ADDRESS =
  "0xdF2990B336375a5E7a39742E7f220F973bDF806F";
// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = "0x9BB4C48d8d1A047a22a471B231e33D35B9f5A3d0";
// Message to be sent to the contract
const NEW_MESSAGE = "This tx cost me no ETH!";

export async function main(atlas: AtlasEnvironment) {
  console.log("Sending a transaction via the testnet paymaster");
  const provider = new Web3Provider(atlas.provider);
  //uses the connected wallet
  const wallet = provider.getSigner();

  // initialise zkSync provider to retrieve paymaster address
  const zkProvider = new Provider("https://sepolia.era.zksync.dev");

  const walletAddress = await wallet.getAddress();

  // initialise messages and token contracts with address, abi and signer
  const messagesContract = new ethers.Contract(
    ZEEK_MESSAGES_CONTRACT_ADDRESS,
    ZeekMessagesArtifact.ZeekSecretMessages.abi,
    wallet
  );
  const tokenContract = new ethers.Contract(
    TOKEN_CONTRACT_ADDRESS,
    TokenArtifact.TestToken.abi,
    wallet
  );

  // retrieve and print the current balance of the wallet
  let ethBalance = await provider.getBalance(walletAddress);
  let tokenBalance = await tokenContract.balanceOf(walletAddress);
  console.log(
    `Account ${walletAddress} has ${ethers.utils.formatEther(ethBalance)} ETH`
  );
  console.log(
    `Account ${walletAddress} has ${ethers.utils.formatUnits(
      tokenBalance,
      18
    )} tokens`
  );

  // retrieve the testnet paymaster address
  const testnetPaymasterAddress = await zkProvider.getTestnetPaymasterAddress();

  console.log(`Testnet paymaster address is ${testnetPaymasterAddress}`);

  const gasPrice = await provider.getGasPrice();

  // define paymaster parameters for gas estimation
  const paramsForFeeEstimation = utils.getPaymasterParams(
    testnetPaymasterAddress,
    {
      type: "ApprovalBased",
      token: TOKEN_CONTRACT_ADDRESS,
      // set minimalAllowance to 1 for estimation
      minimalAllowance: ethers.BigNumber.from(1),
      // empty bytes as testnet paymaster does not use innerInput
      innerInput: new Uint8Array(0),
    }
  );

  // estimate gasLimit via paymaster
  const gasLimit = await messagesContract.estimateGas.sendMessage(NEW_MESSAGE, {
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams: paramsForFeeEstimation,
    },
  });

  // fee calculated in ETH will be the same in
  // ERC20 token using the testnet paymaster
  const fee = gasPrice * gasLimit;

  // new paymaster params with fee as minimalAllowance
  const paymasterParams = utils.getPaymasterParams(testnetPaymasterAddress, {
    type: "ApprovalBased",
    token: TOKEN_CONTRACT_ADDRESS,
    // provide estimated fee as allowance
    minimalAllowance: fee,
    // empty bytes as testnet paymaster does not use innerInput
    innerInput: new Uint8Array(0),
  });

  // full overrides object including maxFeePerGas and maxPriorityFeePerGas
  const txOverrides = {
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: "1",
    gasLimit,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    },
  };

  console.log(`Sign the transaction in your wallet`);

  // send transaction with additional paymaster params as overrides
  const txHandle = await messagesContract.sendMessage(NEW_MESSAGE, txOverrides);
  console.log(
    `Transaction ${txHandle.hash} with fee ${ethers.utils.formatUnits(
      fee,
      18
    )} ERC20 tokens, sent via paymaster ${testnetPaymasterAddress}`
  );
  await txHandle.wait();
  console.log(`Transaction processed`);

  ethBalance = await provider.getBalance(walletAddress);
  tokenBalance = await tokenContract.balanceOf(walletAddress);
  console.log(
    `Account ${walletAddress} now has ${ethers.utils.formatEther(
      ethBalance
    )} ETH`
  );
  console.log(
    `Account ${walletAddress} now has ${ethers.utils.formatUnits(
      tokenBalance,
      18
    )} tokens`
  );

  console.log(`Done!`);
}

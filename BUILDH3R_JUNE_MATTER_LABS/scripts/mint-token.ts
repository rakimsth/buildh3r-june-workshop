import { AtlasEnvironment } from "atlas-ide";
import TokenArtifact from "../artifacts/TestToken";
import * as ethers from "ethers";

// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = "0x9BB4C48d8d1A047a22a471B231e33D35B9f5A3d0";
// Wallet that will receive tokens
const RECEIVER_WALLET = "0xeA2C4889A4bbe52ecAcd19Eb64a747Eaa9505e2E";
// Amount of tokens to mint in ETH format, e.g. 1.23
const TOKEN_AMOUNT = "123.55";

export async function main(atlas: AtlasEnvironment) {
  const provider = new ethers.providers.Web3Provider(atlas.provider);
  const wallet = provider.getSigner();

  // initialise token contract with address, abi and signer
  const tokenContract = new ethers.Contract(
    TOKEN_CONTRACT_ADDRESS,
    TokenArtifact.TestToken.abi,
    wallet
  );

  console.log("Minting tokens...");
  const tx = await tokenContract.mint(
    RECEIVER_WALLET,
    ethers.utils.parseEther(TOKEN_AMOUNT)
  );
  await tx.wait();

  console.log("Success!");
  console.log(
    `The account ${RECEIVER_WALLET} now has ${await tokenContract.balanceOf(
      RECEIVER_WALLET
    )} tokens`
  );
}

const { ethers } = require('ethers');
const fs = require("fs");
const path = require("path");
const chalk = require('chalk');
const ora = require('ora');

const RPC_URL = 'https://base-sepolia-rpc.publicnode.com/89e4ff0f587fe2a94c7a2c12653f4c55d2bda1186cb6c1c95bd8d8408fbdc014';
const CHAIN_ID = 84532;

const PRIOR_ADDRESS = '0xc19Ec2EEBB009b2422514C51F9118026f1cD89ba';
const ROUTER_ADDRESS = '0x0f1DADEcc263eB79AE3e4db0d57c49a8b6178B0B';

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const SWAP_FUNCTION_SELECTORS = {
  USDT: '0x03b530a3',
  USDC: '0xf3b68002'
};

const amount = '0.01';
const amountInWei = ethers.parseUnits(amount, 18);

const provider = new ethers.JsonRpcProvider(RPC_URL);
const privateKeys = fs.readFileSync(path.join(__dirname, "privatekey.txt"), "utf-8")
  .split("\n")
  .map(key => key.trim())
  .filter(key => key.length > 0);

const spinner = ora({
  color: "cyan",
});

async function claimFaucet(wallet) {
  try {
    const faucetAddress = '0xCa602D9E45E1Ed25105Ee43643ea936B8e2Fd6B7';
    const claimSelector = '0x48c54b9d';

    spinner.start(chalk.hex('#20B2AA')(` Claiming faucet for ${wallet.address}...`));

    const tx = await wallet.sendTransaction({
      to: faucetAddress,
      data: claimSelector,
      gasLimit: ethers.toBeHex(500000n)
    });

    await tx.wait();
    spinner.succeed(chalk.hex('#66CDAA')(` Claim successful! TxHash: ${tx.hash}`));
  } catch (err) {
    spinner.fail(` Claim Gagal Belum 24 Jam`);
    spinner.stop();
  }
}

async function approvePrior(wallet, contract, amountInWei) {
  try {
    const allowance = await contract.allowance(wallet.address, ROUTER_ADDRESS);

    if (allowance >= amountInWei) {
      return true;
    }

    spinner.start(chalk.hex('#20B2AA')(` Approve PRIOR...`));
    const tx = await contract.approve(ROUTER_ADDRESS, amountInWei, { gasLimit: 60000n });

    const receipt = await tx.wait();
    spinner.succeed(chalk.hex('#66CDAA')(` Approve Berhasil`));
    return true;

  } catch (error) {
    spinner.fail(chalk.hex('#DC143C')(`❌ Error approving PRIOR: ${error.message}`));
    spinner.stop();
    return false;
  }
}

async function swapPrior(wallet, tokenType) {
  const priorContract = new ethers.Contract(PRIOR_ADDRESS, ERC20_ABI, wallet);

  try {
    spinner.start(chalk.hex('#20B2AA')(` Swap ${amount} PRIOR ke ${tokenType}...`));
    const approved = await approvePrior(wallet, priorContract, amountInWei);
    if (!approved) {
      return false;
    }

    const selector = SWAP_FUNCTION_SELECTORS[tokenType];

    const encodedAmount = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [amountInWei]);
    const txData = selector + encodedAmount.slice(2);

    const tx = await wallet.sendTransaction({
      to: ROUTER_ADDRESS,
      data: txData,
      gasLimit: ethers.toBeHex(500000n)
    });

    const receipt = await tx.wait();
    spinner.succeed(chalk.hex('#66CDAA')(` Swap Berhasil txhash ${tx.hash}`));
    return true;

  } catch (error) {
    spinner.fail(chalk.hex('#DC143C')(`❌ Error swapping PRIOR for ${tokenType}: ${error.message}`));
    spinner.stop();
    return false;
  }
}

async function main() {
  console.clear();
  for (const privateKey of privateKeys) {
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(chalk.hex('#7B68EE')(`🔑 Processing wallet: ${wallet.address}`));

    await claimFaucet(wallet);

    console.log(chalk.hex('#7B68EE')(`⏳ Memproses Swap PIOR to USDT`));
    await swapPrior(wallet, 'USDT');

    console.log(chalk.hex('#7B68EE')(`⏳ Memproses Swap PIOR to USDC`));
    await swapPrior(wallet, 'USDC');

  }
}

main();

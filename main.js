const { ethers } = require('ethers');
const fs = require("fs");
const path = require("path");
const chalk = require('chalk');
const ora = require('ora');
const { displayskw } = require('./skw/displayskw');

const {
  PRIOR_ADDRESS,
  ROUTER_ADDRESS,
  ERC20_ABI,
  SWAP_FUNCTION_SELECTORS,
  delay,
  amount,
  amountInWei,
  provider,
  spinner
} = require('./skw/config');

const privateKeys = fs.readFileSync(path.join(__dirname, "privatekey.txt"), "utf-8")
  .split("\n")
  .map(key => key.trim())
  .filter(key => key.length > 0);

async function claimFaucet(wallet) {
  try {
    const faucetAddress = '0xCa602D9E45E1Ed25105Ee43643ea936B8e2Fd6B7';
    const claimSelector = '0x48c54b9d';

    spinner.start(chalk.hex('#20B2AA')(` Claim PRIOR faucet `));

    const tx = await wallet.sendTransaction({
      to: faucetAddress,
      data: claimSelector,
      gasLimit: ethers.toBeHex(500000n)
    });

    await tx.wait();
    spinner.succeed(chalk.hex('#66CDAA')(` Claim successful! TxHash: ${tx.hash}`));
  } catch (err) {
    spinner.fail(chalk.hex('#FF8C00')(` Claim Faucet Gagal Belum 24 Jam\n`));
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
    const approved = await approvePrior(wallet, priorContract, amountInWei);
    if (!approved) {
      return false;
    }

    const selector = SWAP_FUNCTION_SELECTORS[tokenType];

    const encodedAmount = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [amountInWei]);
    const txData = selector + encodedAmount.slice(2);

    spinner.start(chalk.hex('#20B2AA')(` Swap ${amount} PRIOR ke ${tokenType}...`));
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
  displayskw();
  
  for (const privateKey of privateKeys) {
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(chalk.hex('#7B68EE')(`🔑 Memproses wallet: ${wallet.address}`));

    await claimFaucet(wallet);

    console.log(chalk.hex('#7B68EE')(`⏳ Memproses 20x Swap ${amount} PRIOR to USDT`));
    for (let i = 1; i <= 20; i++) {
      console.log(chalk.hex('#ADD8E6')(`🔁 Swap ke ${i}`));
      await swapPrior(wallet, 'USDT');
      console.log();
      await delay(1000);
    }

    console.log(chalk.hex('#7B68EE')(`⏳ Memproses 20x Swap PRIOR to USDC`));
    for (let i = 1; i <= 20; i++) {
      console.log(chalk.hex('#ADD8E6')(`🔁 Swap ke ${i}`));
      await swapPrior(wallet, 'USDC');
      console.log();
      await delay(1000);
    }
  }
}

main();

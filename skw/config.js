const { ethers } = require('ethers');
const ora = require('ora');

const RPC_URL = 'https://base-sepolia-rpc.publicnode.com';

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const amount = '0.01';
const amountInWei = ethers.parseUnits(amount, 18);

const provider = new ethers.JsonRpcProvider(RPC_URL);

const spinner = ora({
  color: "cyan",
});

module.exports = {
  PRIOR_ADDRESS,
  ROUTER_ADDRESS,
  ERC20_ABI,
  SWAP_FUNCTION_SELECTORS,
  delay,
  amount,
  amountInWei,
  provider,
  spinner
};

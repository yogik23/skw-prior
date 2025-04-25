const chalk = require('chalk');

const welcomeskw = chalk.hex('#00CED1')(`
   ███████╗██╗  ██╗██╗    ██╗
   ██╔════╝██║ ██╔╝██║    ██║
   ███████╗█████╔╝ ██║ █╗ ██║
   ╚════██║██╔═██╗ ██║███╗██║
   ███████║██║  ██╗╚███╔███╔╝
   ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ 
`);

function displayskw() {
  console.log(welcomeskw);
  console.log(chalk.hex('#00CED1')(" ╔══════════════════════════════════════════════════════════════╗"));
  console.log(chalk.hex('#00CED1')(" ║ ≣  Fitur Autobot by SKW AIRDROP HUNTER                       ║"));
  console.log(chalk.hex('#00CED1')(" ║══════════════════════════════════════════════════════════════║"));
  console.log(chalk.hex('#00CED1')(" ║ ➤   Auto SWAP USDC-R2USD                                     ║"));
  console.log(chalk.hex('#00CED1')(" ║ ➤   Auto STAKE R2USD                                         ║"));
  console.log(chalk.hex('#00CED1')(" ║ ➤   Auto Add LP R2USD-sR2USD                                 ║"));
  console.log(chalk.hex('#00CED1')(" ║ ➤   Auto Deposit BTC                                         ║"));
  console.log(chalk.hex('#00CED1')(" ║ ➤   Multi Akun                                               ║"));
  console.log(chalk.hex('#00CED1')(" ║ ➤   Sudah Pasti Elig                                         ║"));
  console.log(chalk.hex('#00CED1')(" ╚══════════════════════════════════════════════════════════════╝"));
  console.log(chalk.hex('#00CED1')("   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░"));
  console.log();
}

module.exports = { displayskw };

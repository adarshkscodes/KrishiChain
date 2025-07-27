const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const Token = await hre.ethers.deployContract('KCToken');
  await Token.waitForDeployment();
  const tokenAddr = await Token.getAddress();

  const Escrow = await hre.ethers.deployContract('KCEscrow', [tokenAddr]);
  await Escrow.waitForDeployment();
  const escrowAddr = await Escrow.getAddress();

  await Token.transferOwnership(escrowAddr);

  console.log('KCToken :', tokenAddr);
  console.log('KCEscrow:', escrowAddr);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });

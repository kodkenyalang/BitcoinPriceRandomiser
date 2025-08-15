import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const FILECOIN_CALIBRATION_RPC_URL = process.env.FILECOIN_CALIBRATION_RPC_URL || "https://api.calibration.node.glif.io/rpc/v1";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    "filecoin-calibration": {
      url: FILECOIN_CALIBRATION_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 314159,
    }
  }
};

export default config;

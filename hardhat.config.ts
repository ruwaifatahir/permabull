import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.6.12",
  },
  networks: {
    bsc: {
      url: process.env.BSC_URL || "",
      chainId: 56,
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
    },

    bsctestnet: {
      url: process.env.BSC_TESTNET_URL || "",
      chainId: 97,
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
    },
  },
  etherscan: {
    apiKey: {
      bsc: process.env.BSC_API_KEY!,
      bscTestnet: process.env.BSC_TESTNET_API_KEY!,
    },
  },
};

export default config;

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.6.12", // any version you want
    settings: {
      // viaIR: true,
      optimizer: {
        enabled: true,
       
      },
    },
  },
};

export default config;

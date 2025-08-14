# **App Name**: Hardhat Development Kit for VRF-Based Random Number Generator Smart Contract

## Core Features:

- Hardhat Project Setup: Initialize a TypeScript/JavaScript Hardhat project with dependencies (@nomicfoundation/hardhat-toolbox, @openzeppelin/contracts, dotenv). Configuration for Filecoin Calibration testnet (RPC URL: https://api.calibration.node.glif.io/rpc/v1, Chain ID: 314159).
- Solidity Contract Integration: Base contract: RandomNumberGenerator.sol from https://github.com/randa-mu/vrf-example/lib/. Key functions: requestRandomNumber(): Requests VRF randomness and emits RandomNumberRequested. fulfillRandomness(uint256 requestId, uint256 randomness): Callback to set randomness and emit RandomNumberFulfilled. predictBitcoinRandom(): Returns a bounded random value (e.g., randomNumber % 100) for Bitcoin prediction simulation. Import RandamuLibrary.sol for VRF logic.
- Deployment Scripts: Script (deploy.ts/js): Deploys the contract to Calibration testnet using private key from .env. Support for gas limit overrides.
- Testing Framework: Chai/Mocha tests for contract deployment, randomness request/fulfillment, and prediction. Mock oracle callbacks for VRF simulation.
- Interaction Tools: Hardhat console integration for calling functions post-deployment. Example: Request randomness and query prediction.
- Directory Structure: Mirror and extend the referenced repo:

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust and reliability.
- Background color: Light blue-gray (#ECEFF1) to provide a neutral backdrop.
- Accent color: Bright orange (#FF9800) for call-to-action buttons and important notifications.
- Body and headline font: 'Inter' (sans-serif) for a clean, modern, and easily readable interface.
- Code font: 'Source Code Pro' for displaying contract code and test scripts.
- Use a grid-based layout to maintain a consistent and organized structure across different screen sizes.
- Subtle transitions for button presses and form submissions to provide user feedback.
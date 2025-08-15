# Bitcoin Price Random Generator DApp

This is a decentralized application (DApp) that generates a pseudo-random Bitcoin price. The frontend is built with Next.js and interacts with a Solidity smart contract deployed on the Filecoin Calibration testnet. The smart contract leverages a Verifiable Random Function (VRF) to ensure a secure and unpredictable random number generation process.

## Tech Stack

- **Frontend:**
  - [Next.js](https://nextjs.org/) (React Framework)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Ethers.js](https://ethers.io/) (for blockchain interaction)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [ShadCN UI](https://ui.shadcn.com/) (Component Library)

- **Smart Contract & Blockchain:**
  - [Solidity](https://soliditylang.org/)
  - [Hardhat](https://hardhat.org/) (Development Environment)
  - Filecoin Calibration Testnet

## Project Structure

- `contracts/`: Contains the Solidity smart contract source code (`RandomNumberGenerator.sol`).
- `scripts/`: Includes the deployment script (`deploy.ts`) for the smart contract.
- `test/`: Holds the test files for the smart contract.
- `src/app/`: The core of the Next.js application. `page.tsx` is the main entry point for the UI.
- `src/components/`: Reusable React components used throughout the application.
- `ContractABI.json`: The Application Binary Interface (ABI) for the deployed smart contract, allowing the frontend to interact with it.
- `hardhat.config.ts`: Configuration file for the Hardhat development environment.
- `next.config.ts`: Configuration file for Next.js.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or later)
- A package manager like `npm` or `yarn`
- [MetaMask](https://metamask.io/) browser extension

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Installation

Clone the repository and install the required dependencies:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root of the project by copying the example:

```bash
cp .env.example .env
```

You will need to populate this file with the following:

- `PRIVATE_KEY`: The private key of the account you want to use to deploy the smart contract. **WARNING: Do not commit this file to version control.**
- `FILECOIN_CALIBRATION_RPC_URL`: The RPC URL for the Filecoin Calibration testnet. You can get one from a provider like [GLIF](https://glif.io/).

Your `.env` file should look like this:
```
PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY"
FILECOIN_CALIBRATION_RPC_URL="https://api.calibration.node.glif.io/rpc/v1"
```

### 3. Compile and Deploy the Smart Contract

Compile the smart contract using Hardhat:
```bash
npx hardhat compile
```

Deploy the contract to the Filecoin Calibration testnet:
```bash
npx hardhat run scripts/deploy.ts --network filecoin-calibration
```

After successful deployment, the script will output the contract address. Copy this address and update the `contractAddress` variable in `src/app/page.tsx`.

### 4. Run the Frontend Application

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

### 5. Using the Application

- Connect your MetaMask wallet when prompted. Ensure your wallet is set to the Filecoin Calibration network.
- Click the "Generate Price" button to interact with the smart contract and generate a new random Bitcoin price.



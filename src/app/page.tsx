"use client";

import * as React from "react";
import {
  Flame,
  FileCode2,
  Folder,
  FileJson,
  FileKey,
  Terminal,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Cpu,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { HardhatIcon } from "@/components/icons";
import { CodeBlock } from "@/components/code-block";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ViewType =
  | "interaction"
  | "rng-contract"
  | "library-contract"
  | "deploy-script"
  | "test-script"
  | "hardhat-config"
  | "env-example"
  | "package-json";

export default function Home() {
  const [activeView, setActiveView] = React.useState<ViewType>("interaction");

  const { toast } = useToast();
  const [requestId, setRequestId] = React.useState<string | null>(null);
  const [randomness, setRandomness] = React.useState<string | null>(null);
  const [prediction, setPrediction] = React.useState<number | null>(null);

  const [isRequesting, setIsRequesting] = React.useState(false);
  const [isFulfilling, setIsFulfilling] = React.useState(false);
  const [isPredicting, setIsPredicting] = React.useState(false);

  const handleRequest = () => {
    setIsRequesting(true);
    setRandomness(null);
    setPrediction(null);
    setTimeout(() => {
      const newRequestId = Math.floor(Math.random() * 9000) + 1000;
      setRequestId(newRequestId.toString());
      setIsRequesting(false);
      toast({
        title: "Success: Randomness Requested",
        description: `Request ID: ${newRequestId} has been sent to the oracle.`,
        action: <CheckCircle2 className="text-green-500" />,
      });
    }, 1500);
  };

  const handleFulfill = () => {
    setIsFulfilling(true);
    setTimeout(() => {
      const newRandomness =
        "0x" +
        [...Array(64)]
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("");
      setRandomness(newRandomness);
      setIsFulfilling(false);
      toast({
        title: "Success: Randomness Fulfilled",
        description: "The oracle has fulfilled the request.",
        action: <CheckCircle2 className="text-green-500" />,
      });
    }, 1500);
  };

  const handlePredict = () => {
    setIsPredicting(true);
    setTimeout(() => {
      if (randomness) {
        const bigIntValue = BigInt(randomness);
        const newPrediction = Number(bigIntValue % 100n);
        setPrediction(newPrediction);
      }
      setIsPredicting(false);
    }, 1000);
  };

  const renderContent = () => {
    switch (activeView) {
      case "interaction":
        return <InteractionPanel />;
      case "rng-contract":
        return (
          <CodeBlock
            title="contracts/RandomNumberGenerator.sol"
            language="solidity"
            content={CONTRACT_CONTENT}
          />
        );
      case "library-contract":
        return (
          <CodeBlock
            title="contracts/RandamuLibrary.sol"
            language="solidity"
            content={LIBRARY_CONTENT}
          />
        );
      case "deploy-script":
        return (
          <CodeBlock
            title="scripts/deploy.ts"
            language="typescript"
            content={DEPLOY_SCRIPT_CONTENT}
          />
        );
      case "test-script":
        return (
          <CodeBlock
            title="test/RandomNumberGenerator.test.ts"
            language="typescript"
            content={TEST_SCRIPT_CONTENT}
          />
        );
      case "hardhat-config":
        return (
          <CodeBlock
            title="hardhat.config.ts"
            language="typescript"
            content={HARDHAT_CONFIG_CONTENT}
          />
        );
      case "env-example":
        return (
          <CodeBlock
            title=".env.example"
            language="shell"
            content={ENV_EXAMPLE_CONTENT}
          />
        );
      case "package-json":
        return (
          <CodeBlock
            title="package.json"
            language="json"
            content={PACKAGE_JSON_CONTENT}
          />
        );
      default:
        return null;
    }
  };

  const InteractionPanel = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground">
          VRF Interaction Simulation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Simulate the lifecycle of a VRF-based random number request. Each step
          mimics a transaction on the blockchain.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary/10 text-primary w-8 h-8 rounded-full">
                1
              </span>
              Request Randomness
            </CardTitle>
            <CardDescription>
              Call `requestRandomNumber()` on the smart contract to start the
              process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleRequest}
              disabled={isRequesting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
            >
              {isRequesting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Flame className="mr-2 h-4 w-4" />
              )}
              Request
            </Button>
            {requestId && !isRequesting && (
              <div className="text-sm text-green-600 dark:text-green-400 p-3 bg-green-500/10 rounded-md flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  Request ID: <strong>{requestId}</strong>
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary/10 text-primary w-8 h-8 rounded-full">
                2
              </span>
              Fulfill Request
            </CardTitle>
            <CardDescription>
              The oracle calls back with `fulfillRandomness()` to deliver the
              random value.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleFulfill}
              disabled={!requestId || isFulfilling || !!randomness}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
            >
              {isFulfilling ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Cpu className="mr-2 h-4 w-4" />
              )}
              Fulfill
            </Button>
            {randomness && !isFulfilling && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div className="text-sm text-green-600 dark:text-green-400 p-3 bg-green-500/10 rounded-md flex items-center gap-2 break-all text-left">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        Randomness: <strong>{randomness}</strong>
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{randomness}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardContent>
        </Card>

        <Card className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary/10 text-primary w-8 h-8 rounded-full">
                3
              </span>
              Get Prediction
            </CardTitle>
            <CardDescription>
              Use the fulfilled randomness in your application, e.g., to get a
              bounded value.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handlePredict}
              disabled={!randomness || isPredicting}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300"
            >
              {isPredicting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Terminal className="mr-2 h-4 w-4" />
              )}
              Predict
            </Button>
            {prediction !== null && !isPredicting && (
              <div className="text-center p-4 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">
                  `randomNumber % 100`
                </p>
                <p className="text-4xl font-bold font-code text-primary">
                  {prediction}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-72 fixed top-0 left-0 h-full bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <HardhatIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-base font-bold font-headline">
                Hardhat Dev Kit
              </h1>
              <p className="text-xs text-muted-foreground">
                VRF Randomness
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <h2 className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Simulator
          </h2>
          <Button
            variant={activeView === "interaction" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveView("interaction")}
          >
            <Terminal className="h-4 w-4" /> Interaction
          </Button>

          <Separator className="my-4" />

          <h2 className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Project Files
          </h2>

          <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="py-2 px-2 text-sm hover:no-underline hover:bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-primary" /> contracts
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-6 space-y-1 pt-2">
                <Button
                  variant={activeView === "rng-contract" ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2 text-sm"
                  size="sm"
                  onClick={() => setActiveView("rng-contract")}
                >
                  <FileCode2 className="h-4 w-4" /> RandomNumberGenerator.sol
                </Button>
                <Button
                  variant={
                    activeView === "library-contract" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start gap-2 text-sm"
                  size="sm"
                  onClick={() => setActiveView("library-contract")}
                >
                  <FileCode2 className="h-4 w-4" /> RandamuLibrary.sol
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            variant={activeView === "deploy-script" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveView("deploy-script")}
          >
            <Folder className="h-4 w-4 text-primary invisible" />
            <span className="text-muted-foreground">scripts/</span>deploy.ts
          </Button>
          <Button
            variant={activeView === "test-script" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveView("test-script")}
          >
            <Folder className="h-4 w-4 text-primary invisible" />
            <span className="text-muted-foreground">test/</span>
            RandomNumberGenerator.test.ts
          </Button>

          <Separator className="my-4" />

          <Button
            variant={activeView === "hardhat-config" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveView("hardhat-config")}
          >
            <HardhatIcon className="h-4 w-4" /> hardhat.config.ts
          </Button>

          <Button
            variant={activeView === "package-json" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveView("package-json")}
          >
            <FileJson className="h-4 w-4" /> package.json
          </Button>

          <Button
            variant={activeView === "env-example" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveView("env-example")}
          >
            <FileKey className="h-4 w-4" /> .env.example
          </Button>
        </nav>
      </aside>
      <main className="ml-72 flex-1 p-8">
        <div className="max-w-5xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

const HARDHAT_CONFIG_CONTENT = `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const FILECOIN_CALIBRATION_RPC_URL = process.env.FILECOIN_CALIBRATION_RPC_URL || "";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    calibration: {
      url: FILECOIN_CALIBRATION_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 314159,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;
`;

const CONTRACT_CONTENT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RandamuLibrary.sol";

contract RandomNumberGenerator {
    using RandamuLibrary for RandamuLibrary.RandomRequest;

    mapping(uint256 => RandamuLibrary.RandomRequest) public s_requests;
    mapping(uint256 => uint256) public s_randomness;
    uint256 private s_requestCounter;

    address public owner;

    event RandomNumberRequested(uint256 indexed requestId, address indexed requester);
    event RandomNumberFulfilled(uint256 indexed requestId, uint256 randomness);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        s_requestCounter = 0;
    }

    function requestRandomNumber() public returns (uint256 requestId) {
        requestId = ++s_requestCounter;
        s_requests[requestId] = RandamuLibrary.RandomRequest({
            requester: msg.sender,
            nonce: 0, // In a real VRF, this would be important
            fulfilled: false
        });
        
        emit RandomNumberRequested(requestId, msg.sender);
        
        // In a real-world application, this would interact with a VRF oracle.
        // For this example, we assume the oracle is listening for the event.
        return requestId;
    }

    function fulfillRandomness(uint256 requestId, uint256 randomness) public onlyOwner {
        RandamuLibrary.RandomRequest storage request = s_requests[requestId];
        require(request.requester != address(0), "Request not found");
        require(!request.fulfilled, "Request already fulfilled");
        
        request.fulfilled = true;
        s_randomness[requestId] = randomness;
        
        emit RandomNumberFulfilled(requestId, randomness);
    }
    
    function predictBitcoinRandom() public view returns (uint256) {
        // This is a simulation. The latest fulfilled randomness is used.
        // In a real app, you would likely associate a prediction with a specific request.
        require(s_requestCounter > 0, "No randomness requested yet");
        uint256 latestRandomness = s_randomness[s_requestCounter];
        require(latestRandomness > 0, "Latest request not fulfilled yet");

        // Returns a value between 0 and 99
        return latestRandomness % 100;
    }
}
`;

const LIBRARY_CONTENT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This is a simplified, mock library for demonstration purposes.
// In a real-world scenario, you would use a proven VRF library like Chainlink's.
library RandamuLibrary {
    struct RandomRequest {
        address requester;
        uint256 nonce;
        bool fulfilled;
    }

    // A simple pseudo-random number generator for mock testing.
    // DO NOT USE THIS IN PRODUCTION for generating random numbers.
    function generatePseudoRandom(uint256 requestId, address sender) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, sender, requestId)));
    }
}
`;

const DEPLOY_SCRIPT_CONTENT = `import { ethers } from "hardhat";

async function main() {
  console.log("Deploying RandomNumberGenerator contract...");
  const randomNumberGeneratorFactory = await ethers.getContractFactory("RandomNumberGenerator");
  
  // Deploy the contract with an override for gas limit if needed
  const randomNumberGenerator = await randomNumberGeneratorFactory.deploy({
    gasLimit: 4000000, // Example gas limit override
  });

  await randomNumberGenerator.waitForDeployment();

  const contractAddress = await randomNumberGenerator.getAddress();
  console.log(\`RandomNumberGenerator deployed to: \${contractAddress}\`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;

const TEST_SCRIPT_CONTENT = `import { expect } from "chai";
import { ethers } from "hardhat";
import { RandomNumberGenerator } from "../typechain-types";

describe("RandomNumberGenerator", function () {
  let randomNumberGenerator: RandomNumberGenerator;
  let owner: any, addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const RandomNumberGeneratorFactory = await ethers.getContractFactory("RandomNumberGenerator");
    randomNumberGenerator = await RandomNumberGeneratorFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await randomNumberGenerator.owner()).to.equal(owner.address);
    });
  });

  describe("Randomness Request and Fulfillment", function () {
    it("Should allow a user to request a random number and emit an event", async function () {
      await expect(randomNumberGenerator.connect(addr1).requestRandomNumber())
        .to.emit(randomNumberGenerator, "RandomNumberRequested")
        .withArgs(1, addr1.address);
    });

    it("Should allow the owner to fulfill the randomness request", async function () {
      const tx = await randomNumberGenerator.connect(addr1).requestRandomNumber();
      const receipt = await tx.wait();
      // A bit of a hack to get the event args without full parsing setup
      const requestId = (receipt?.logs[0] as any).args[0];
      const mockRandomness = ethers.toBigInt("1234567891011121314");
      
      await expect(randomNumberGenerator.connect(owner).fulfillRandomness(requestId, mockRandomness))
        .to.emit(randomNumberGenerator, "RandomNumberFulfilled")
        .withArgs(requestId, mockRandomness);

      expect(await randomNumberGenerator.s_randomness(requestId)).to.equal(mockRandomness);
    });

    it("Should prevent non-owners from fulfilling requests", async function () {
      await randomNumberGenerator.connect(addr1).requestRandomNumber();
      await expect(randomNumberGenerator.connect(addr1).fulfillRandomness(1, 123))
        .to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Prediction", function () {
    it("Should return a bounded random number for prediction after fulfillment", async function () {
      await randomNumberGenerator.connect(addr1).requestRandomNumber();
      const mockRandomness = ethers.toBigInt("9999999999"); // ... % 100 = 99
      await randomNumberGenerator.connect(owner).fulfillRandomness(1, mockRandomness);

      const prediction = await randomNumberGenerator.predictBitcoinRandom();
      expect(prediction).to.equal(99);
    });

    it("Should revert if trying to predict before any request is fulfilled", async function () {
        await randomNumberGenerator.connect(addr1).requestRandomNumber();
        await expect(randomNumberGenerator.predictBitcoinRandom())
            .to.be.revertedWith("Latest request not fulfilled yet");
    });
  });
});
`;

const ENV_EXAMPLE_CONTENT = `PRIVATE_KEY=""
FILECOIN_CALIBRATION_RPC_URL="https://api.calibration.node.glif.io/rpc/v1"
`;

const PACKAGE_JSON_CONTENT = `{
  "name": "hardhat-vrf-project",
  "version": "1.0.0",
  "description": "Hardhat Development Kit for VRF-Based Smart Contract",
  "scripts": {
    "test": "hardhat test",
    "compile": "hardhat compile",
    "deploy:calibration": "hardhat run scripts/deploy.ts --network calibration"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "hardhat": "^2.22.5"
  },
  "dependencies": {
    "dotenv": "^16.4.5"
  }
}
`;

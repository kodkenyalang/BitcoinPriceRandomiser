// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IRandomnessSender} from "randomness-js/contracts/IRandomnessSender.sol";
import {RandomnessReceiverBase} from "randomness-js/contracts/RandomnessReceiverBase.sol";

/// @title RandomNumberGenerator contract
/// @author Your Name
/// @notice A contract that requests and consumes randomness to predict Bitcoin price changes
contract RandomNumberGenerator is RandomnessReceiverBase {
    /// @notice Stores the latest received randomness value
    bytes32 public randomness;
    bool public predictionReady = false;

    /// @notice Stores the request ID of the latest randomness request
    mapping(address => uint256) public GlobalCurrRequestId;
    mapping(uint256 => address) public OwnerOfReqID;
    mapping(address => bytes32) public usersRandomNumber;

    event RandomNumberRequested(uint256 indexed requestId, address indexed requester);
    event RandomNumberFulfilled(uint256 indexed requestId, bytes32 indexed randomness);

    /// @notice Initializes the contract with the address of the randomness sender
    /// @param _randomnessSender The address of the randomness provider
    constructor(
        address _randomnessSender,
        address _owner
    ) RandomnessReceiverBase(_randomnessSender, _owner) {}

    /// @notice Requests randomness using the direct funding option
    /// @dev Calls `_requestRandomnessPayInNative` to get a random value, updating `requestId` with the request ID
    function rollDiceWithDirectFunding(
        uint32 callbackGasLimit
    ) external payable returns (uint256, uint256) {
        (uint256 requestID, uint256 requestPrice) = _requestRandomnessPayInNative(
            callbackGasLimit
        );
        GlobalCurrRequestId[msg.sender] = requestID; // Store per-user
        OwnerOfReqID[requestID] = msg.sender;
        predictionReady = false;
        emit RandomNumberRequested(requestID, msg.sender);
        return (requestID, requestPrice);
    }

    /// @notice Requests randomness using the subscription option
    /// @dev Calls `_requestRandomnessWithSubscription` to get a random value, updating `requestId` with the request ID
    function rollDiceWithSubscription(
        uint32 callbackGasLimit
    ) external returns (uint256) {
        // create randomness request
        uint256 requestID = _requestRandomnessWithSubscription(callbackGasLimit);
        // store request id
        GlobalCurrRequestId[msg.sender] = requestID;
        predictionReady = false;
        emit RandomNumberRequested(requestID, msg.sender);
        return requestID;
    }

    function cancelSubscription(address to) external onlyOwner {
        _cancelSubscription(to);
    }

    /// @notice Callback function that processes received randomness
    /// @dev Ensures the received request ID matches the stored one before updating state
    /// @param requestID The ID of the randomness request
    /// @param _randomness The random value received from the oracle
    function onRandomnessReceived(
        uint256 requestID,
        bytes32 _randomness
    ) internal override {
        address ownerOfReq = OwnerOfReqID[requestID];
        require(
            GlobalCurrRequestId[ownerOfReq] == requestID,
            "Request ID mismatch"
        );
        randomness = _randomness;
        usersRandomNumber[ownerOfReq] = _randomness;
        predictionReady = true;
        emit RandomNumberFulfilled(requestID, _randomness);
    }

    function predictBitcoinPrice() external view returns (string memory) {
        require(predictionReady, "Prediction not yet available");
        uint256 randomNumber = uint256(randomness);
        if (randomNumber % 2 == 0) {
            return "Bitcoin price will go up!";
        } else {
            return "Bitcoin price will go down!";
        }
    }

    function predictBitcoinRandom() external view returns (uint256) {
        require(predictionReady, "Prediction not yet available");
        uint256 randomNumber = uint256(randomness);
        return randomNumber % 100;
    }
}

# Compute Marketplace - Decentralized Computing Resource Platform

## Overview

The **Compute Marketplace** is a decentralized platform that connects clients who need computational resources with providers who have available capacity. The platform utilizes blockchain technology and smart contracts to ensure secure, transparent, and automated transactions between clients and providers.

### Key Features:

1. **Task Creation**: Clients can create computational tasks, providing details like task title, description, duration, and payment.
2. **Resource Registration**: Providers can register their available computational resources (e.g., GPUs, CPUs) and offer them to clients.
3. **Dynamic Pricing and Reputation System**: 
   - Providers can adjust their prices based on demand, and clients can select providers through an auction-based bidding system.
   - A reputation system ensures that high-quality providers are prioritized in task allocation.

---

## Table of Contents

1. [Setup](#setup)
2. [How It Works](#how-it-works)
3. [Known Issues](#known-issues)
4. [Future Plans](#future-plans)

---

## Setup

### Prerequisites

To run the Compute Marketplace locally, you will need:

- **Node.js** installed
- **React** for the frontend
- **Ganache** or another local blockchain emulator (for development)
- **MetaMask** for interacting with the blockchain

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/compute-marketplace.git

## How It Works
Client-Side UI
Create a Task:

Clients can create a task by navigating to the Customer Dashboard and filling out the task details, such as title, description, duration, and payment in tokens.
The task should normally be posted to the blockchain, where providers can bid on it.
Register a Resource:

Providers can register their computational resources (e.g., GPU) by entering the specifications and pricing information in the Provider Dashboard.
Once registered, the resource is listed under the "Available Resources" section for clients to browse.
Smart Contract Interaction
The platform uses Ethereum-based smart contracts to handle task creation, resource registration, and payments between clients and providers.

Note: Due to some current limitations, the live integration between the UI and smart contract is still in progress. Resource registration and task creation can trigger blockchain transactions, which are visible on Etherscan.

## Known Issues
UI and Smart Contract Integration:

The current integration between the UI and smart contract is incomplete.
Live transactions may not be processed correctly for task creation at the moment. We are actively working to resolve this.
Transaction Viewing:

While the resource registration triggers a smart contract interaction, we are unable to perform live transactions at this time.
Past transactions can be viewed on Etherscan as a demo of how the system would function once fully integrated.
Future Plans
Full UI-Smart Contract Integration:

Resolve current integration issues to allow seamless interaction between the frontend and the blockchain.
Ensure that task creation, resource registration, and payments are automatically processed via smart contracts.
Advanced Allocation Algorithm:

Implement the advanced allocation algorithm, including dynamic pricing, reputation-based bidding, and task specialization matching for optimal resource distribution.
Time-Based Pricing:

Introduce dynamic pricing based on peak/off-peak usage times to optimize provider availability and task completion rates.
Privacy-Preserving Computation:

Integrate zero-knowledge proofs or homomorphic encryption for sensitive computational tasks, ensuring data privacy and security.
Multi-Resource Allocation: Enable multi-resource tasks that require a combination of resources (e.g., CPU, GPU, storage) and implement more complex allocation algorithms.

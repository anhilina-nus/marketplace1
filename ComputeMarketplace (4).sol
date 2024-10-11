// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ComputeMarketplace
 * @dev A decentralized marketplace for computational resources.
 */
contract ComputeMarketplace is Ownable, ReentrancyGuard {
    // State variables
    IERC20 public paymentToken;
    uint256 public taskCount;
    uint256 public resourceCount;

    // Constants
    uint256 public constant REPUTATION_FACTOR = 10;
    uint256 public constant BIDDING_PERIOD = 1 hours;
    uint256 public constant SPECIALIZATION_BONUS = 50;

    // Enums
    enum TaskStatus { Open, InProgress, Completed, Verified }

    // Structs
    struct Task {
        uint64 taskId;
        address client;
        string description;
        uint32 duration;
        uint256 paymentAmount;
        TaskStatus status;
        address provider;
        uint32 taskStartTime;
        string resultHash;
        uint64 allocatedResourceId;
        uint256 finalPrice;
        string taskType;
        bool isAllocated;
    }

    struct Resource {
        address owner;
        uint64 computePower;
        uint256 basePrice;
        bool isAvailable;
        uint32 reputation;
        string[] specializations;
        uint32 totalRatingScore;
        uint32 numberOfRatings;
    }

    // Mappings
    mapping(uint256 => Task) public tasks;
    mapping(uint256 => Resource) public resources;

    // Events
    event TaskCreated(uint256 taskId, address client, uint256 paymentAmount);
    event BidPlaced(uint256 taskId, uint256 resourceId, uint256 bidPrice);
    event TaskAssigned(uint256 taskId, address provider, uint256 finalPrice);
    event ReputationUpdated(uint256 resourceId, uint256 newReputation);

    // Constructor
    constructor(address _tokenAddress) Ownable(msg.sender) {
        paymentToken = IERC20(_tokenAddress);
    }

    // External functions
    function createTask(string calldata description, uint32 duration, uint256 paymentAmount, string calldata taskType) external {
        require(paymentAmount > 0, "Payment amount must be greater than zero");
        taskCount++;
        _createNewTask(description, duration, paymentAmount, taskType);
        emit TaskCreated(taskCount, msg.sender, paymentAmount);
    }

    function registerResource(uint64 computePower, uint256 basePrice, string[] calldata specializations) external {
        resourceCount++;
        resources[resourceCount] = Resource({
            owner: msg.sender,
            computePower: computePower,
            basePrice: basePrice,
            isAvailable: true,
            reputation: 0,
            specializations: specializations,
            totalRatingScore: 0,
            numberOfRatings: 0
        });
    }

    function placeBid(uint256 taskId, uint256 resourceId, uint256 bidPrice) external {
        Task storage task = tasks[taskId];
        Resource storage resource = resources[resourceId];
        require(resource.isAvailable, "Resource not available");
        
        uint256 adjustedBidPrice = _calculateAdjustedBidPrice(task, resource, bidPrice);
        _updateTaskAllocation(task, resourceId, adjustedBidPrice);
        
        emit BidPlaced(taskId, resourceId, bidPrice);
    }

    function finalizeTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(!task.isAllocated, "Task already allocated");

        task.isAllocated = true;
        Resource storage resource = resources[task.allocatedResourceId];
        resource.isAvailable = false;

        emit TaskAssigned(taskId, resource.owner, task.finalPrice);
    }

    function rateResource(uint256 taskId, uint32 rating) external {
        Task storage task = tasks[taskId];
        Resource storage resource = resources[task.allocatedResourceId];

        require(task.isAllocated, "Task not allocated");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        _updateResourceRating(resource, rating);
        _adjustResourceReputation(resource, rating);

        emit ReputationUpdated(task.allocatedResourceId, resource.reputation);
    }

    // Private functions
    function _createNewTask(string calldata description, uint32 duration, uint256 paymentAmount, string calldata taskType) private {
        tasks[taskCount] = Task({
            taskId: uint64(taskCount),
            client: msg.sender,
            description: description,
            duration: duration,
            paymentAmount: paymentAmount,
            status: TaskStatus.Open,
            provider: address(0),
            taskStartTime: 0,
            resultHash: "",
            allocatedResourceId: 0,
            finalPrice: 0,
            taskType: taskType,
            isAllocated: false
        });
    }

    function _calculateAdjustedBidPrice(Task storage task, Resource storage resource, uint256 bidPrice) private view returns (uint256) {
        uint256 bonuses = (uint256(resource.reputation) * REPUTATION_FACTOR) + 
                          (_checkSpecializationMatch(task.taskType, resource.specializations) ? SPECIALIZATION_BONUS : 0);
        return (bidPrice * 1000) / (1000 + bonuses);
    }

    function _checkSpecializationMatch(string memory taskType, string[] storage specializations) private view returns (bool) {
        for (uint i = 0; i < specializations.length; i++) {
            if (keccak256(abi.encodePacked(specializations[i])) == keccak256(abi.encodePacked(taskType))) {
                return true;
            }
        }
        return false;
    }

    function _updateTaskAllocation(Task storage task, uint256 resourceId, uint256 adjustedBidPrice) private {
        if (task.allocatedResourceId == 0 || adjustedBidPrice < task.finalPrice) {
            task.allocatedResourceId = uint64(resourceId);
            task.finalPrice = adjustedBidPrice;
        }
    }

    function _updateResourceRating(Resource storage resource, uint32 rating) private {
        resource.totalRatingScore += rating;
        resource.numberOfRatings++;
    }

    function _adjustResourceReputation(Resource storage resource, uint32 rating) private {
        if (rating > 3) {
            resource.reputation = uint32(uint256(resource.reputation) + 2);
        } else if (resource.reputation > 1) {
            resource.reputation--;
        }
    }
}
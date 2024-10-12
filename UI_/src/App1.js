import React, { useState, useEffect } from "react";
import "./styles.css";
import "./index.css";
import { ethers } from "ethers";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Database,
  Clock,
  DollarSign,
  Award,
  Search,
  User,
  Cpu,
  Plus,
  Send,
} from "lucide-react";
// ABI of a deployed contract
const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint32",
        name: "duration",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "paymentAmount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "taskType",
        type: "string",
      },
    ],
    name: "createTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
    ],
    name: "finalizeTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "resourceId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bidPrice",
        type: "uint256",
      },
    ],
    name: "BidPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "resourceId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidPrice",
        type: "uint256",
      },
    ],
    name: "placeBid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "rating",
        type: "uint32",
      },
    ],
    name: "rateResource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "computePower",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "basePrice",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "specializations",
        type: "string[]",
      },
    ],
    name: "registerResource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "resourceId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newReputation",
        type: "uint256",
      },
    ],
    name: "ReputationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "finalPrice",
        type: "uint256",
      },
    ],
    name: "TaskAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "client",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paymentAmount",
        type: "uint256",
      },
    ],
    name: "TaskCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "BIDDING_PERIOD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paymentToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REPUTATION_FACTOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "resourceCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "resources",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "computePower",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "basePrice",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isAvailable",
        type: "bool",
      },
      {
        internalType: "uint32",
        name: "reputation",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "totalRatingScore",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "numberOfRatings",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SPECIALIZATION_BONUS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "taskCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tasks",
    outputs: [
      {
        internalType: "uint64",
        name: "taskId",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint32",
        name: "duration",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "paymentAmount",
        type: "uint256",
      },
      {
        internalType: "enum ComputeMarketplace.TaskStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "taskStartTime",
        type: "uint32",
      },
      {
        internalType: "string",
        name: "resultHash",
        type: "string",
      },
      {
        internalType: "uint64",
        name: "allocatedResourceId",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "finalPrice",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "taskType",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isAllocated",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Address of a deployed contract
//Add you cotract address to test 
const contractAddress = "";

export default function ComputeMarketplace() {
  const [userType, setUserType] = useState("client");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts.length === 0) {
            console.error(
              "No accounts found. Make sure MetaMask is connected."
            );
            return;
          }
          if (typeof window.ethereum !== "undefined") {
            try {
              await window.ethereum.request({ method: "eth_requestAccounts" });
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const signer = provider.getSigner();
              const address = await signer.getAddress();
              setAccount(address);

              const contractInstance = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
              );
              setContract(contractInstance);
              console.log("Setting contract for Fabio");
              await loadTasks();
              await loadResources();
            } catch (error) {
              console.error("An error occurred:", error);
            }
          } else {
            console.log("Please install MetaMask!");
          }
        } catch (error) {
          console.error("Error initializing contract:", error);
        }
      } else {
        console.error("MetaMask is not installed!");
      }
    };

    init();
  }, []);

  const loadTasks = async () => {
    if (contract) {
      const taskCount = await contract.taskCount();
      const loadedTasks = [];
      for (let i = 1; i <= taskCount; i++) {
        const task = await contract.tasks(i);
        loadedTasks.push({
          id: i,
          title: task.description,
          client: task.client,
          duration: task.duration.toString(),
          payment: ethers.utils.formatEther(task.paymentAmount),
          status: getTaskStatus(task.status),
          provider: task.provider,
        });
      }
      setTasks(loadedTasks);
    }
  };

  const loadResources = async () => {
    if (contract) {
      const resourceCount = await contract.resourceCount();
      const loadedResources = [];
      for (let i = 1; i <= resourceCount; i++) {
        const resource = await contract.resources(i);
        loadedResources.push({
          id: i,
          owner: resource.owner,
          computePower: resource.computePower.toString(),
          basePrice: ethers.utils.formatEther(resource.basePrice),
          isAvailable: resource.isAvailable,
          reputation: resource.reputation.toString(),
          totalRatingScore: resource.totalRatingScore.toString(),
          numberOfRatings: resource.numberOfRatings.toString(),
        });
      }
      setResources(loadedResources);
    }
  };

  const createTask = async (description, duration, paymentAmount, taskType) => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
    try {
      const tx = await contract.createTask(
        description,
        duration,
        ethers.utils.parseEther(paymentAmount),
        taskType
      );
      await tx.wait();
      await loadTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const registerResource = async (computePower, basePrice, specializations) => {
    if (contract) {
      try {
        const tx = await contract.registerResource(
          computePower,
          ethers.utils.parseEther(basePrice),
          specializations
        );
        await tx.wait();
        await loadResources();
      } catch (error) {
        console.error("Error registering resource:", error);
      }
    }
  };

  const placeBid = async (taskId, resourceId, bidPrice) => {
    try {
      const tx = await contract.placeBid(
        taskId,
        resourceId,
        ethers.utils.parseEther(bidPrice)
      );
      await tx.wait();
      await loadTasks();
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Compute Marketplace</h1>
        <div>
          <button
            className={`px-4 py-2 rounded-l-md ${
              userType === "client"
                ? "bg-white text-indigo-600"
                : "bg-indigo-700"
            }`}
            onClick={() => setUserType("client")}
          >
            Client
          </button>
          <button
            className={`px-4 py-2 rounded-r-md ${
              userType === "provider"
                ? "bg-white text-indigo-600"
                : "bg-indigo-700"
            }`}
            onClick={() => setUserType("provider")}
          >
            Provider
          </button>
        </div>
      </header>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex">
          <button
            className={`py-4 px-6 ${
              activeTab === "dashboard"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`py-4 px-6 ${
              activeTab === "tasks"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            {userType === "client" ? "My Tasks" : "Available Tasks"}
          </button>
          <button
            className={`py-4 px-6 ${
              activeTab === "resources"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            {userType === "client" ? "Find Resources" : "My Resources"}
          </button>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        {activeTab === "dashboard" && (
          <Dashboard userType={userType} tasks={tasks} resources={resources} />
        )}
        {activeTab === "tasks" && (
          <TasksView
            userType={userType}
            tasks={tasks}
            createTask={createTask}
            placeBid={placeBid}
          />
        )}
        {activeTab === "resources" && (
          <ResourcesView
            userType={userType}
            resources={resources}
            registerResource={registerResource}
          />
        )}
      </main>
    </div>
  );
}
function Dashboard({ userType, tasks, resources }) {
  const mockChartData = [
    { name: "AI", tasks: 45 },
    { name: "Big Data", tasks: 30 },
    { name: "Graphics", tasks: 25 },
    { name: "Simulation", tasks: 20 },
    { name: "Crypto", tasks: 15 },
  ];

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Activity size={24} />}
            title={
              userType === "client" ? "My Active Tasks" : "Tasks Completed"
            }
            value={
              userType === "client"
                ? tasks
                    .filter((t) => t.status === "InProgress")
                    .length.toString()
                : tasks
                    .filter((t) => t.status === "Completed")
                    .length.toString()
            }
          />
          <StatCard
            icon={<Database size={24} />}
            title={userType === "client" ? "Total Spend" : "Total Earned"}
            value={`${tasks
              .reduce((sum, task) => sum + parseFloat(task.payment), 0)
              .toFixed(2)} tokens`}
          />
          <StatCard
            icon={<Clock size={24} />}
            title="Avg. Completion Time"
            value={`${(
              tasks.reduce((sum, task) => sum + parseInt(task.duration), 0) /
                tasks.length || 0
            ).toFixed(1)} hours`}
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {userType === "client"
            ? "My Task Distribution"
            : "Task Type Distribution"}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasks" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
      <div className="bg-indigo-100 p-3 rounded-full mr-4">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
function TasksView({ userType, tasks, createTask, placeBid }) {
  const [newTask, setNewTask] = useState({
    description: "",
    duration: "",
    payment: "",
    taskType: "",
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    createTask(
      newTask.description,
      newTask.duration,
      newTask.payment,
      newTask.taskType
    );
    setNewTask({ description: "", duration: "", payment: "", taskType: "" });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {userType === "client" ? "My Tasks" : "Available Tasks"}
        </h2>
        {userType === "client" && (
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() =>
              document
                .getElementById("createTaskModal")
                .classList.remove("hidden")
            }
          >
            <Plus size={16} className="mr-2" /> Create New Task
          </button>
        )}
      </div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          userType={userType}
          placeBid={placeBid}
        />
      ))}

      {/* Create Task Modal */}
      <div
        id="createTaskModal"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden"
      >
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <h3 className="text-lg font-bold mb-4">Create New Task</h3>
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 mb-3 border rounded"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Duration (in hours)"
              className="w-full p-2 mb-3 border rounded"
              value={newTask.duration}
              onChange={(e) =>
                setNewTask({ ...newTask, duration: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Payment (in tokens)"
              className="w-full p-2 mb-3 border rounded"
              value={newTask.payment}
              onChange={(e) =>
                setNewTask({ ...newTask, payment: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Task Type"
              className="w-full p-2 mb-3 border rounded"
              value={newTask.taskType}
              onChange={(e) =>
                setNewTask({ ...newTask, taskType: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ResourcesView({ userType, resources, registerResource }) {
  const [newResource, setNewResource] = useState({
    computePower: "",
    basePrice: "",
    specializations: "",
  });

  const handleRegisterResource = (e) => {
    e.preventDefault();
    const specializations = newResource.specializations
      .split(",")
      .map((s) => s.trim());
    registerResource(
      newResource.computePower,
      newResource.basePrice,
      specializations
    );
    setNewResource({ computePower: "", basePrice: "", specializations: "" });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {userType === "client" ? "Find Resources" : "My Resources"}
        </h2>
        {userType === "provider" && (
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() =>
              document
                .getElementById("registerResourceModal")
                .classList.remove("hidden")
            }
          >
            <Plus size={16} className="mr-2" /> Register New Resource
          </button>
        )}
      </div>
      {resources.map((resource) => (
        <ProviderCard
          key={resource.id}
          provider={resource}
          userType={userType}
        />
      ))}

      {/* Register Resource Modal */}
      <div
        id="registerResourceModal"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden"
      >
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <h3 className="text-lg font-bold mb-4">Register New Resource</h3>
          <form onSubmit={handleRegisterResource}>
            <input
              type="number"
              placeholder="Compute Power"
              className="w-full p-2 mb-3 border rounded"
              value={newResource.computePower}
              onChange={(e) =>
                setNewResource({ ...newResource, computePower: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Base Price (in tokens)"
              className="w-full p-2 mb-3 border rounded"
              value={newResource.basePrice}
              onChange={(e) =>
                setNewResource({ ...newResource, basePrice: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Specializations (comma-separated)"
              className="w-full p-2 mb-3 border rounded"
              value={newResource.specializations}
              onChange={(e) =>
                setNewResource({
                  ...newResource,
                  specializations: e.target.value,
                })
              }
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded"
            >
              Register Resource
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function getTaskStatus(status) {
  const statusMap = ["Open", "InProgress", "Completed", "Verified"];
  return statusMap[status] || "Unknown";
}

function getStatusColor(status) {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-800";
    case "InProgress":
      return "bg-yellow-100 text-yellow-800";
    case "Completed":
      return "bg-blue-100 text-blue-800";
    case "Verified":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
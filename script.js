const contractAddress = "0x61fFd8f99cC01e5B5F081672813be6b34AEB7CC5";
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
            }
        ],
        "name": "completeProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_freelancer",
                "type": "address"
            }
        ],
        "name": "hireFreelancer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
            }
        ],
        "name": "releasePayment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "projects",
        "outputs": [
            {
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "freelancer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "budget",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isCompleted",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isPaid",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "projectCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let contract;
let signer;
let provider;

async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            const address = await signer.getAddress();
            document.getElementById("walletAddress").innerText = `Connected Wallet: ${address}`;
            document.getElementById("connectWalletButton").style.display = "none";
            document.getElementById("disconnectWalletButton").style.display = "inline-block";
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        console.error("Ethereum provider not found");
    }
}

function disconnectWallet() {
    signer = null;
    contract = null;
    document.getElementById("walletAddress").innerText = "";
    document.getElementById("connectWalletButton").style.display = "inline-block";
    document.getElementById("disconnectWalletButton").style.display = "none";
}

async function hireFreelancer() {
    if (!signer) {
        alert("Please connect your wallet first.");
        return;
    }
    try {
        const projectId = document.getElementById("projectId").value;
        const freelancerAddress = document.getElementById("freelancerAddress").value;

        if (!projectId || !freelancerAddress) {
            alert("Please enter both Project ID and Freelancer Address.");
            return;
        }

        const tx = await contract.hireFreelancer(projectId, freelancerAddress);
        console.log("Transaction sent:", tx.hash);

        await tx.wait();
        console.log("Transaction confirmed:", tx.hash);

        alert("Freelancer hired successfully!");
    } catch (error) {
        console.error("Failed to hire freelancer", error);
        alert("Failed to hire freelancer: " + error.message);
    }
}

async function completeProject() {
    if (!signer) {
        alert("Please connect your wallet first.");
        return;
    }
    try {
        const projectId = document.getElementById("completeProjectId").value;

        if (!projectId) {
            alert("Please enter Project ID.");
            return;
        }

        const tx = await contract.completeProject(projectId);
        console.log("Transaction sent:", tx.hash);

        await tx.wait();
        console.log("Transaction confirmed:", tx.hash);

        alert("Project marked as completed!");
    } catch (error) {
        console.error("Failed to complete project", error);
        alert("Failed to complete project: " + error.message);
    }
}

async function releasePayment() {
    if (!signer) {
        alert("Please connect your wallet first.");
        return;
    }
    try {
        const projectId = document.getElementById("releasePaymentProjectId").value;

        if (!projectId) {
            alert("Please enter Project ID.");
            return;
        }

        const tx = await contract.releasePayment(projectId);
        console.log("Transaction sent:", tx.hash);

        await tx.wait();
        console.log("Transaction confirmed:", tx.hash);

        alert("Payment released successfully!");
    } catch (error) {
        console.error("Failed to release payment", error);
        alert("Failed to release payment: " + error.message);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceMarketplace {
    struct Project {
        address client;
        address freelancer;
        uint256 budget;
        bool isCompleted;
        bool isPaid;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(uint256 projectId, address client, uint256 budget);
    event FreelancerHired(uint256 projectId, address freelancer);
    event ProjectCompleted(uint256 projectId);
    event PaymentReleased(uint256 projectId, address freelancer, uint256 amount);

    function createProject() external payable {
        require(msg.value > 0, "Budget must be greater than 0");
        
        projectCount++;
        projects[projectCount] = Project({
            client: msg.sender,
            freelancer: address(0),
            budget: msg.value,
            isCompleted: false,
            isPaid: false
        });

        emit ProjectCreated(projectCount, msg.sender, msg.value);
    }

    function hireFreelancer(uint256 _projectId, address _freelancer) external {
        require(projects[_projectId].client == msg.sender, "Only the client can hire a freelancer");
        require(projects[_projectId].freelancer == address(0), "Freelancer already hired");
        
        projects[_projectId].freelancer = _freelancer;
        emit FreelancerHired(_projectId, _freelancer);
    }

    function completeProject(uint256 _projectId) external {
        require(projects[_projectId].client == msg.sender, "Only the client can mark the project as completed");
        require(!projects[_projectId].isCompleted, "Project already completed");
        
        projects[_projectId].isCompleted = true;
        emit ProjectCompleted(_projectId);
    }

    function releasePayment(uint256 _projectId) external {
        Project storage project = projects[_projectId];
        require(project.client == msg.sender, "Only the client can release the payment");
        require(project.isCompleted, "Project must be completed before payment");
        require(!project.isPaid, "Payment already released");
        
        project.isPaid = true;
        payable(project.freelancer).transfer(project.budget);
        emit PaymentReleased(_projectId, project.freelancer, project.budget);
    }
}
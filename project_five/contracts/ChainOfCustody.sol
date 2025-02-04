// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

pragma experimental ABIEncoderV2;

contract ChainOfCustody {
    struct Evidence {
        uint256 id;
        string description;
        address currentCustodian;
        uint256 custodyRecordCount;
        mapping(uint256 => CustodyRecord) custodyRecords;
    }

    struct CustodyRecord {
        address custodian;
        uint256 timestamp;
    }

    struct Custodian {
        address addr;
        string name;
        bool isActive;
    }

    mapping(address => Custodian) public custodians;

    mapping(uint256 => Evidence) public evidences;
    uint256 public nextEvidenceId;

    event CustodyTransferred(uint256 indexed evidenceId, address indexed from, address indexed to, uint256 timestamp);
    event EvidenceInitialized(uint256 indexed evidenceId, string description, address initialCustodian);
    event EvidenceDescriptionUpdated(uint256 indexed evidenceId, string newDescription);
    event CustodianCreated(address indexed custodianAddress, string name);

    modifier evidenceExists(uint256 _evidenceId) {
        require(_evidenceId < nextEvidenceId, "Evidence does not exist.");
        _;
    }

    modifier onlyActiveCustodian() {
    require(custodians[msg.sender].isActive, "Only active custodians can perform this action.");
    _;
    }

    function createCustodian(address _custodianAddress, string memory _name) public {
        require(custodians[_custodianAddress].addr == address(0), "Custodian already exists.");
        custodians[_custodianAddress] = Custodian(_custodianAddress, _name, true);
        emit CustodianCreated(_custodianAddress, _name);
    }

function initializeEvidence(string memory _description, address _custodian) public onlyActiveCustodian returns (uint256) {
    require(_custodian != address(0), "Custodian address cannot be zero");
    uint256 evidenceId = nextEvidenceId++;
    evidences[evidenceId] = Evidence(evidenceId, _description, _custodian, 0);
    emit EvidenceInitialized(evidenceId, _description, _custodian);
    emit CustodyTransferred(evidenceId, address(0), _custodian, block.timestamp);
    return evidenceId;
}

    function transferCustody(uint256 _evidenceId, address _newCustodian) public evidenceExists(_evidenceId) onlyActiveCustodian {
        require(msg.sender == evidences[_evidenceId].currentCustodian, "Only the current custodian can perform this action.");
        require(custodians[_newCustodian].isActive, "Can only transfer to active custodians.");

        Evidence storage evidence = evidences[_evidenceId];

        evidence.custodyRecords[evidence.custodyRecordCount++] = CustodyRecord({
            custodian: evidence.currentCustodian,
            timestamp: block.timestamp
        });

        evidence.currentCustodian = _newCustodian;

        emit CustodyTransferred(_evidenceId, msg.sender, _newCustodian, block.timestamp);
    }

    function deactivateCustodian(address _custodianAddress) public {
        require(custodians[_custodianAddress].isActive, "Custodian is not active.");
        custodians[_custodianAddress].isActive = false;
    }

    function updateDescription(uint256 _evidenceId, string memory _newDescription) public evidenceExists(_evidenceId) {
        require(msg.sender == evidences[_evidenceId].currentCustodian, "Only the current custodian can perform this action.");
        evidences[_evidenceId].description = _newDescription;
        emit EvidenceDescriptionUpdated(_evidenceId, _newDescription);
    }

    function getCurrentCustodian(uint256 _evidenceId) public view evidenceExists(_evidenceId) returns (address) {
        return evidences[_evidenceId].currentCustodian;
    }

    function getCustodyHistory(uint256 _evidenceId) public view evidenceExists(_evidenceId) returns (CustodyRecord[] memory) {
        CustodyRecord[] memory history = new CustodyRecord[](evidences[_evidenceId].custodyRecordCount);
        for (uint256 i = 0; i < evidences[_evidenceId].custodyRecordCount; i++) {
            history[i] = evidences[_evidenceId].custodyRecords[i];
        }
        return history;
    }

    function getEvidenceDetails(uint256 _evidenceId) public view evidenceExists(_evidenceId) returns (uint256, string memory, address, CustodyRecord[] memory) {
        Evidence storage evidence = evidences[_evidenceId];
        return (evidence.id, evidence.description, evidence.currentCustodian, getCustodyHistory(_evidenceId));
    }

    function getAllEvidenceDetails() public view returns (uint256[] memory, string[] memory, address[] memory) {
        uint256[] memory ids = new uint256[](nextEvidenceId);
        string[] memory descriptions = new string[](nextEvidenceId);
        address[] memory currentCustodians = new address[](nextEvidenceId);

        for (uint256 i = 0; i < nextEvidenceId; i++) {
            ids[i] = evidences[i].id;
            descriptions[i] = evidences[i].description;
            currentCustodians[i] = evidences[i].currentCustodian;
        }

        return (ids, descriptions, currentCustodians);
    }
}

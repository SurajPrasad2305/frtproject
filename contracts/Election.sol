pragma solidity >=0.4.20;

contract Election {
    // Structure of a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Storing voters account address those have already voted
    mapping(address => bool) public voters;
    // Storing and Fetching Candidates
    mapping(uint => Candidate) public candidates;
    // Storing Candidates count
    uint public candidatesCount;

    // each of the voted-event
    event votedEvent (
        uint indexed _candidateId
    );

    constructor() public {
        addCandidate("Bharatiya Janata Party");
        addCandidate("Indian National Congress");
        addCandidate("Dravida Munnetra Kazhagam");
        addCandidate("All India Trinamool Congress");
        addCandidate("Yuvajana Sramika Rythu Congress Party");
        addCandidate("Shiv Sena");
        addCandidate("Janata Dal (United)");
        addCandidate("Biju Janata Dal");
        addCandidate("Bahujan Samaj Party");
        addCandidate("Telangana Rashtra Samithi");
         
    }

    function addCandidate (string memory  _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // conditions required that each voter vote only once and candidate should be valid
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        //Storing that voter has voted
        voters[msg.sender] = true;
        // updating the vote Count of the candidate
        candidates[_candidateId].voteCount ++;
        // trigger the voted event for each vote
        emit  votedEvent(_candidateId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract PoIVerifier {
    mapping(bytes32 => uint256) public hashTimestamps;
    mapping(bytes32 => address) public hashOwners;
    
    event HashStored(bytes32 indexed hash, address indexed owner, uint256 timestamp);
    
    function storeHash(bytes32 _hash) external {
        require(hashTimestamps[_hash] == 0, "Hash already stored");
        
        hashTimestamps[_hash] = block.timestamp;
        hashOwners[_hash] = msg.sender;
        
        emit HashStored(_hash, msg.sender, block.timestamp);
    }
    
    function verifyHash(bytes32 _hash) external view returns (uint256 timestamp, address owner) {
        return (hashTimestamps[_hash], hashOwners[_hash]);
    }
}
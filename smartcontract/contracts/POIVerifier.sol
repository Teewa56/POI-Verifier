// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
/**
 * @title Proof of Insight Verifier
 * @dev Stores content hashes with metadata on-chain
 */

contract PoIVerifier is Ownable {
    constructor() Ownable(msg.sender) {}
    // Struct to store insight data
    struct Insight {
        bytes32 contentHash;
        address author;
        uint256 timestamp;
        string[] tags;
        uint256 originalityScore;
        int256 sentimentScore;
    }

    // Mappings for storage
    mapping(bytes32 => Insight) public insights;
    mapping(address => bytes32[]) public userInsights;
    mapping(string => bytes32[]) public tagInsights;

    // Events
    event InsightStored(
        bytes32 indexed contentHash,
        address indexed author,
        uint256 timestamp,
        string[] tags
    );
    
    event InsightUpdated(
        bytes32 indexed contentHash,
        uint256 originalityScore,
        int256 sentimentScore
    );

    // Variable for total insights (replacing Counters.Counter)
    uint256 private _totalInsights;

    /**
     * @dev Store a new insight
     * @param contentHash SHA-256 hash of the content
     * @param tags Array of tags for categorization
     */
    function storeInsight(
        bytes32 contentHash,
        string[] memory tags
    ) external {
        require(insights[contentHash].author == address(0), "Insight already exists");
        
        insights[contentHash] = Insight({
            contentHash: contentHash,
            author: msg.sender,
            timestamp: block.timestamp,
            tags: tags,
            originalityScore: 0,
            sentimentScore: 0
        });

        userInsights[msg.sender].push(contentHash);
        for (uint i = 0; i < tags.length; i++) {
            tagInsights[tags[i]].push(contentHash);
        }

        _totalInsights += 1; // Increment manually
        emit InsightStored(contentHash, msg.sender, block.timestamp, tags);
    }

    /**
     * @dev Update insight with AI analysis scores (only owner)
     * @param contentHash Hash of the content to update
     * @param originalityScore 0-100 score
     * @param sentimentScore -100 to 100 score
     */
    function updateInsightScores(
        bytes32 contentHash,
        uint256 originalityScore,
        int256 sentimentScore
    ) external onlyOwner {
        require(insights[contentHash].author != address(0), "Insight does not exist");
        require(originalityScore <= 100, "Invalid originality score");
        require(sentimentScore >= -100 && sentimentScore <= 100, "Invalid sentiment score");
        
        insights[contentHash].originalityScore = originalityScore;
        insights[contentHash].sentimentScore = sentimentScore;
        
        emit InsightUpdated(contentHash, originalityScore, sentimentScore);
    }

    /**
     * @dev Get insight data by hash
     * @param contentHash Hash of the content
     */
    function getInsight(
        bytes32 contentHash
    ) external view returns (
        address author,
        uint256 timestamp,
        string[] memory tags,
        uint256 originalityScore,
        int256 sentimentScore
    ) {
        Insight memory insight = insights[contentHash];
        require(insight.author != address(0), "Insight not found");
        
        return (
            insight.author,
            insight.timestamp,
            insight.tags,
            insight.originalityScore,
            insight.sentimentScore
        );
    }

    /**
     * @dev Get insights by user
     * @param user Address of the user
     */
    function getUserInsights(
        address user
    ) external view returns (bytes32[] memory) {
        return userInsights[user];
    }

    /**
     * @dev Get insights by tag
     * @param tag Tag to search for
     */
    function getTagInsights(
        string memory tag
    ) external view returns (bytes32[] memory) {
        return tagInsights[tag];
    }

    /**
     * @dev Get total insight count
     */
    function totalInsights() external view returns (uint256) {
        return _totalInsights;
    }
}

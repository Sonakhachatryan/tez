pragma solidity ^0.5.0;

interface ChairsInterface{
    function saveFacultyChairs(uint256 _facultyId, string calldata _chairs) external returns(uint256);
    function getFacultyChairs(uint256 _facultyId) view external returns(string memory);
}
pragma solidity ^0.5.0;
import "./interfaces/ChairsInterface.sol";
import "./Users.sol";

contract Chairs is ChairsInterface{

    Users usersABI;
    address usersAddress;

    mapping(uint256 => string) private chairs;

    constructor(address _userAddress) public {
        usersAddress = _userAddress;
        usersABI = Users(usersAddress);
    }

    function saveFacultyChairs(uint256 _facultyId, string calldata _chairs) external returns(uint256){
        address sender = msg.sender;

        if(usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 100){
            chairs[_facultyId] = _chairs;
        }
    }

    function getFacultyChairs(uint256 _facultyId) view external returns(string memory){
        return chairs[_facultyId];
    }

}
pragma solidity ^0.5.0;
import "./Users.sol";

contract Articles{
    Users usersABI;
    address usersAddress;

    mapping(uint256 => string) private articles;

    constructor(address _userAddress) public {
        usersAddress = _userAddress;
        usersABI = Users(usersAddress);
    }

    function saveFacultyArticles(uint256 _facultyId, string calldata _articles) external returns(uint256){
        address sender = msg.sender;

        if(usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 1){
            articles[_facultyId] = _articles;
        }
    }

    function getFacultyArticles(uint256 _facultyId) view external returns(string memory){
        return articles[_facultyId];
    }

}
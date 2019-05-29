pragma solidity ^0.5.0;


interface UsersInterface {
//    function createUser(address _userAddress, bytes32 _userName, string calldata _publicKey, uint8 _role) external returns(bool);
    function getUserName(address _userAddress) view external  returns(bytes32);
    function getUserRole(address _userAddress) view external returns(uint8);
    function getUserPublicKey(address _userAddress) view external returns(string memory);
}
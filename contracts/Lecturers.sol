pragma solidity ^0.5.0;
import "./abstracts/BaseAbstract.sol";
import "./Users.sol";

contract Lecturers is BaseAbstract{

    struct Lecturer {
        string userAddress;
        uint faculty;
        uint chair;
        string title;
        string bio;
    }

    Users usersABI;
    address usersAddress;

    address[] filteredKeys;

    address[] private keys;
    mapping(address => Lecturer) private lecturers;

    constructor(address _userAddress) public{
        usersAddress = _userAddress;
        usersABI = Users(usersAddress);
    }


    function createLecturer(address _userAddress, string memory _addressString, uint _faculty, uint _chair,  string memory _title, string memory _bio) public {
        address sender = msg.sender;

        if(usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 1){
            keys.push(_userAddress);
            lecturers[_userAddress] = Lecturer({
                userAddress: _addressString,
                faculty: _faculty,
                chair: _chair,
                title: _title,
                bio: _bio
                });
            }
    }

    function updateLecturer(address _userAddress,  uint _chair,  string memory _title, string memory _bio) public {
        address sender = msg.sender;

        if(usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 1){
            Lecturer storage lecturer = lecturers[_userAddress];
            lecturers[_userAddress] = Lecturer({
                userAddress: lecturer.userAddress,
                faculty: lecturer.faculty,
                chair: _chair,
                title: _title,
                bio: _bio
                });
        }
    }


    function getKeys() view public returns(address[] memory){
        return keys;
    }

    function getById(address _userAddress) view public returns(string memory){
        return toJson(_userAddress);
    }

    function getByKeys(address[] calldata _keys) view external returns(string memory){
        return toJsonArray(_keys);
    }

    function getAll() public view returns (string memory){
        return toJsonArray(getKeys());
    }

    function toJsonArray(address[] memory _userAddresses) view public returns(string memory){
        bytes memory _str = abi.encodePacked("[");
        for(uint i=0;i<_userAddresses.length;i++){
            _str = abi.encodePacked(_str,  toJson(_userAddresses[i]));

            if(i != _userAddresses.length -1){
                _str = abi.encodePacked(_str, ", ");
            }
        }

        _str = abi.encodePacked(_str, "]");

        return string(_str);
    }

    function toJson(address _userAddress) view public returns(string memory){
        Lecturer memory _lecturer = lecturers[_userAddress];
        return string(abi.encodePacked("{", '"id":"', _lecturer.userAddress, '", "faculty":"', uint2str(_lecturer.faculty), '", "chair":"', uint2str(_lecturer.chair), '", "title":"', _lecturer.title, '", "bio":"', _lecturer.bio, '"}'));
    }

    function getByFaculty(uint _facultyId) public returns(string memory) {
        delete filteredKeys;
        for(uint i = 0; i < keys.length; i++){
            if(lecturers[keys[i]].faculty == _facultyId){
                filteredKeys.push(keys[i]);
            }
        }
        return toJsonArray(filteredKeys);
    }

    function deleteLecturer(address _userAddress) public{
        int i = getIndex(_userAddress);
        if(i != -1){
            delete lecturers[_userAddress];
            delete keys[uint(i)];
        }
    }

    function getIndex(address _userAddress) view private returns(int){
        for(uint i = 0; i < keys.length; i++){
            if(keys[i] == _userAddress){
                return int(i);
            }
        }

        return -1;
    }
}
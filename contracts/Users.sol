pragma solidity ^0.5.0;
import "./abstracts/BaseAbstract.sol";

contract Users is BaseAbstract {
    struct User {
        string userAddress;
        string name;
        string email;
        string photo;
        string publicKey;
        string info;
        uint256 role;
        bool set;
    }

    address[] private keys;
    mapping(address => User) private users;

    constructor() public {
        keys.push(0xE58Ad29B131178053188B3EDE9bD0e88C3044cfe);
//                  0xE58Ad29B131178053188B3EDE9bD0e88C3044cfe
        users[0xE58Ad29B131178053188B3EDE9bD0e88C3044cfe] = User({
            userAddress: "11110xE58Ad29B131178053188B3EDE9bD0e88C3044cfe",
            publicKey: "",
            name: "Admin",
            email: "admin@mail.com",
            photo: "_photo",
            info: "",
            role: 100,
            set: true
            });
    }

    function createUser(address _userAddress, string memory _addressString, string memory _userName, string memory _email, string memory _photo,  string memory _publicKey, string memory _info, uint256 _role) public {
        address sender = msg.sender;
        require(checkCanPerformAction(sender));

        keys.push(_userAddress);
        users[_userAddress] = User({
            userAddress: _addressString,
            publicKey: _publicKey,
            name: _userName,
            email: _email,
            photo: _photo,
            role: _role,
            info: _info,
            set: true
            });
    }

    function update(address _userAddress, string memory _userName, string memory _email, string memory _photo, string memory _info) public {
        User storage user = users[_userAddress];
        require(user.set);
        users[_userAddress].name = _userName;
        users[_userAddress].email = _email;
        users[_userAddress].photo = _photo;
        users[_userAddress].info = _info;
    }

    function userExists(address _userAddress) view private returns(bool){
        return users[_userAddress].set;
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

    function getAll(uint _page, uint _perPage) public view returns (string memory){
        if(_page == 0){
            _page = 1;
        }

        if(_perPage == 0){
            _perPage = 10;
        }

        uint start = (_page -1)*_perPage;
        uint end = start + _perPage;
        if(end > keys.length){
            end = keys.length;
        }
        uint length = end - start;
        address[] memory keyArray = new address[](length);
        uint j = 0;
        for(uint i = start; i < end; i++ ){
            keyArray[j] = keys[i];
            j++;
        }

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
        User memory _user = users[_userAddress];
        return string(abi.encodePacked("{", '"id":"', _user.userAddress, '", "name":"', _user.name, '", "email":"', _user.email, '", "photo":"', _user.photo,  '", "role":"', uint2str(_user.role), '", "info":"', _user.info,  '", "publicKey":"', _user.publicKey, '"}'));
    }

    function deleteUser(address _userAddress) public{
        int i = getIndex(_userAddress);
        if(i != -1){
            delete users[_userAddress];
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

    function getRole(address x) view public returns (uint){
        return users[x].role;
    }

    function checkUserExists(address x) view public returns(bool){
        if(getIndex(x) == -1){
            return false;
        }

        return true;
    }


    function checkCanPerformAction(address x) public view returns(bool){
        if(checkUserExists(x) && getRole(x) == 100){
            return true;
        }

        return false;
    }

    function getSender() view public returns (address){
        return msg.sender;
    }

}
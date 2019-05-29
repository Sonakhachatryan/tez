pragma solidity ^0.5.0;
import "./interfaces/FacultiesInterface.sol";
import "./abstracts/BaseAbstract.sol";
import "./Users.sol";

contract Faculties is BaseAbstract, FacultyInterface{
    struct Faculty {
        uint256 id;
        string name;
        string shortDesc;
        string img;
        string info;
        string phone;
        string email;
    }

    uint256[] private keys;
    mapping(uint256 => Faculty) private faculties;

    Users usersABI;
    address usersAddress;

    constructor(address _userAddress) public {
        usersAddress = _userAddress;
        usersABI = Users(usersAddress);
    }

    function createFaculty(string calldata _name, string calldata _shortDesc, string calldata _info, string calldata _img, string calldata _phone, string calldata _email) external returns(uint256){

        if(usersABI.checkUserExists(msg.sender) && usersABI.getRole(msg.sender) == 100){

            uint256 _id = now;
            keys.push(_id);

            faculties[_id] = Faculty({
                id: _id,
                name: _name,
                shortDesc: _shortDesc,
                img: _img,
                info: _info,
                phone: _phone,
                email: _email
                });

            return _id;
        }
    }

    function updateFaculty(uint256 _id, string calldata _name, string calldata _shortDesc, string calldata _info, string calldata _img, string calldata _phone, string calldata _email) external returns(uint256){
        address sender = msg.sender;
        if(facultyExists(_id) && usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 100){
            delete sender;
            setName(_id, _name);
            setShortDesc(_id, _shortDesc);
            setInfo(_id, _info);
            setImage(_id, _img);
            setPhone(_id, _phone);
            setEmail(_id, _email);
        }

        return 1;
    }

    function facultyExists(uint256 _id) view public returns(bool){
        return faculties[_id].id != 0;
    }

    function setName(uint256 _id, string memory _name) private {
        faculties[_id].name = _name;
    }

    function setImage(uint256 _id, string memory _image) private {
        faculties[_id].img = _image;
    }

    function setShortDesc(uint256 _id, string memory _shortDesc) private {
        faculties[_id].shortDesc = _shortDesc;
    }

    function setInfo(uint256 _id, string memory _info) private {
        faculties[_id].info = _info;
    }

    function setPhone(uint256 _id, string memory _phone) private {
        faculties[_id].phone = _phone;
    }

    function setEmail(uint256 _id, string memory _email) private {
        faculties[_id].email = _email;
    }

    function getKeys() view public returns(uint256[] memory){
        return keys;
    }

    function getById(uint256 _id) view public returns(string memory){
        return toJson(_id);
    }

    function getByKeys(uint[] calldata _keys) view external returns(string memory){
        return toJsonArray(_keys);
    }

    function getAll() public view returns(string memory){
        return toJsonArray(getKeys());
    }

    function toJsonArray(uint[] memory _faculties) view public returns(string memory){
        bytes memory _str = abi.encodePacked("[");
        for(uint i=0;i<_faculties.length;i++){
            _str = abi.encodePacked(_str,  toJson(_faculties[i]));

            if(i != _faculties.length -1){
                _str = abi.encodePacked(_str, ", ");
            }
        }

        _str = abi.encodePacked(_str, "]");

        return string(_str);
    }

    function toJson(uint id) view public returns(string memory){
        Faculty memory _faculty = faculties[id];
        return string(abi.encodePacked("{",'"id":', uint2str(_faculty.id), ', "name":"', _faculty.name, '", "shortDesc":"', _faculty.shortDesc, '", "info":"', _faculty.info, '", "email":"', _faculty.email, '", "phone":"', _faculty.phone,  '", "img":"', _faculty.img, '"}'));
    }

    function deleteFaculty(uint256 _id) public{
        int i = getIndex(_id);
        if(i != -1){
            delete faculties[_id];
            delete keys[uint(i)];
        }
    }

    function getIndex(uint256 _id) view private returns(int){
        for(uint i = 0; i < keys.length; i++){
            if(keys[i] == _id){
                return int(i);
            }
        }

        return -1;
    }
}


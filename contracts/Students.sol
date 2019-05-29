pragma solidity ^0.5.0;
import "./abstracts/BaseAbstract.sol";
import "./Users.sol";

contract Students is BaseAbstract {
    struct Student {
        string userAddress;
        uint faculty;
        uint degree;
        uint course;
        string group;
        string entranceMarks;
    }

    address[] private keys;
    mapping(address => Student) private students;

    Users usersABI;
    address usersAddress;

    constructor(address _userAddress) public{
        usersAddress = _userAddress;
        usersABI = Users(usersAddress);
    }

    function createStudent(address _userAddress, string memory _addressString, uint _faculty, uint _degree, uint _course, string memory _group, string memory _entranceMarks) public {
        address sender = msg.sender;

        if(usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 1){
            keys.push(_userAddress);
            students[_userAddress] = Student({
                userAddress: _addressString,
                faculty: _faculty,
                degree: _degree,
                course: _course,
                group: _group,
                entranceMarks: _entranceMarks
                });
        }
    }

    function updateStudent(address _userAddress, string memory _addressString, uint _degree, uint _course, string memory _group) public {
        address sender = msg.sender;

        if(usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 1){
            Student storage student = students[_userAddress];
            students[_userAddress] = Student({
                userAddress: _addressString,
                faculty: student.faculty,
                degree: _degree,
                course: _course,
                group: _group,
                entranceMarks: student.entranceMarks
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

    function updateEntranceMarks(address _userAddress, string memory _file) public {
        students[_userAddress].entranceMarks = _file;
    }

    function filter(uint _faculty, string memory _group) view public returns(string memory){
        bytes memory result = "[";
        uint count = 0;
        bool select = true;

        for(uint i = 0; i < keys.length; i++){
            select = true;

            if(_faculty != 0){
                if(_faculty == students[keys[i]].faculty){
                    select = select && true;
                }else{
                    select = select && false;
                }
            }else{
                select = select && true;
            }


            if(!compareStrings(_group, "")){
                if(compareStrings(_group, students[keys[i]].group)){
                    select = select && true;
                }else{
                    select = select && false;
                }
            }else{
                select = select && true;
            }

            if(select){
                if(!compareStrings(students[keys[i]].userAddress, "")){
                    if( count != 0){
                        result = abi.encodePacked(result, ", ");
                    }
                    result = abi.encodePacked(result,  toJson(keys[i]));
                    count++;
                }
            }
        }

        result = abi.encodePacked(result, "]");
        return string(result);
    }

    function compareStrings (string memory a, string memory b) pure public returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
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
        Student memory _student = students[_userAddress];
        return string(abi.encodePacked("{", '"id":"', _student.userAddress, '", "faculty":"', uint2str(_student.faculty), '", "degree":"', uint2str(_student.degree), '", "course":"', uint2str(_student.course), '", "entranceMarks":"', _student.entranceMarks, '", "group":"', _student.group, '"}'));
    }

    function deleteStudent(address _userAddress) public{
        int i = getIndex(_userAddress);
        if(i != -1){
            delete students[_userAddress];
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
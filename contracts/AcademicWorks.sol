pragma solidity ^0.5.0;
import "./abstracts/BaseAbstract.sol";
import "./Users.sol";

contract AcademicWorks is BaseAbstract {

    struct AcademicWork {
        uint id;
        string userAddress;
        string title;
        string publish_date;
        uint type_id;
        string files;
        string desc;
    }

    Users usersABI;
    address usersAddress;

    uint[] private keys;
    mapping(uint => AcademicWork) private academicWorks;

    constructor(address _userAddress) public{
            usersAddress = _userAddress;
            usersABI = Users(usersAddress);
    }

    function createAcademicWork(string memory _addressString, string memory _title, string memory _publish_date, uint _type_id,  string memory _files, string memory _desc) public {
        address sender = msg.sender;

        if(usersABI.checkUserExists(sender) && (usersABI.getRole(sender) == 3 || usersABI.getRole(sender) == 4)){
            uint256 _id = now;
            keys.push(_id);
            // Check that the user did not already exist:
            // require(!user.set);
            //Store the user
            academicWorks[_id] = AcademicWork({
                id: _id,
                userAddress: _addressString,
                title: _title,
                publish_date: _publish_date,
                type_id: _type_id,
                files: _files,
                desc: _desc
                });
        }

    }

    function updateAcademicWork(uint _id, string memory _addressString, string memory _title, string memory _publish_date, uint _type_id,  string memory _files, string memory _desc) public {
        AcademicWork storage academicWork = academicWorks[_id];
        address sender = msg.sender;
        if(usersABI.checkUserExists(sender) && (usersABI.getRole(sender) == 3 || usersABI.getRole(sender) == 4)){
        academicWorks[_id] = AcademicWork({
            id:_id,
            userAddress: _addressString,
            title: _title,
            publish_date: _publish_date,
            type_id: _type_id,
            files: _files,
            desc: _desc
            });
         }
    }


    function getKeys() view public returns(uint[] memory){
        return keys;
    }

    function getById(uint _id) view public returns(string memory){
        return toJson(_id);
    }

    function getByKeys(uint[] calldata _keys) view external returns(string memory){
        return toJsonArray(_keys);
    }

    function getAll() public view returns (string memory){
        return toJsonArray(getKeys());
    }

    function toJsonArray(uint[] memory _ids) view public returns(string memory){
        bytes memory _str = abi.encodePacked("[");
        for(uint i=0;i<_ids.length;i++){
            _str = abi.encodePacked(_str,  toJson(_ids[i]));

            if(i != _ids.length -1){
                _str = abi.encodePacked(_str, ", ");
            }
        }

        _str = abi.encodePacked(_str, "]");

        return string(_str);
    }

    function toJson(uint _id) view public returns(string memory){
        AcademicWork memory _academicWork = academicWorks[_id];
        return string(abi.encodePacked("{", '"id":"', uint2str(_academicWork.id), '", "userAddress":"', _academicWork.userAddress, '", "title":"', _academicWork.title, '", "publish_date":"', _academicWork.publish_date,  '", "type_id":"', uint2str(_academicWork.type_id), '", "files":"', _academicWork.files,  '", "desc":"', _academicWork.desc, '"}'));
    }

    function getByUserAddress(string memory _userAddress) view public returns(string memory) {

        bytes memory result = "[";
        uint count = 0;

        for(uint i = 0; i < keys.length; i++){
            string memory addr = academicWorks[keys[i]].userAddress;
            if( compareStrings(addr, _userAddress)){
                if( count != 0){
                    result = abi.encodePacked(result, ", ");
                }
                count++;
                result = abi.encodePacked(result,  toJson(keys[i]));
            }
        }

        result = abi.encodePacked(result, "]");
        return string(result);
    }

    function compareStrings (string memory a, string memory b) pure public returns (bool) {
         return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }

    function deleteAcademicWork(uint _id) public{
        int i = getIndex(_id);
        if(i != -1){
            delete academicWorks[_id];
            delete keys[uint(i)];
        }
    }

    function getIndex(uint _id) view private returns(int){
        for(uint i = 0; i < keys.length; i++){
            if(keys[i] == _id){
                return int(i);
            }
        }

        return -1;
    }

}
pragma solidity ^0.5.0;
import "./abstracts/BaseAbstract.sol";
import "./Users.sol";

contract GroupMarks is BaseAbstract{

    struct GroupMark {
        uint id;
        uint faculty;
        string group;
        string year;
        uint half;
        string students;
        string marks;
        uint article;
        string lecturer;
    }

    uint[] private keys;
    mapping(uint => GroupMark) private groupMarks;

    Users usersABI;
    address usersAddress;

    constructor(address _userAddress) public{
        usersAddress = _userAddress;
        usersABI = Users(usersAddress);
    }

    function createGroupMarks(uint _faculty, string memory _group, string memory _year, uint _half, string memory _students,  string memory _marks, uint _article, string memory _lecturer) public {
        uint256 _id = now;
        keys.push(_id);
        // Check that the user did not already exist:
        // require(!user.set);
        //Store the user
        address sender = msg.sender;
        if(usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 3){
            groupMarks[_id] = GroupMark({
                id: _id,
                faculty: _faculty,
                group: _group,
                year: _year,
                half: _half,
                students: _students,
                marks: _marks,
                article: _article,
                lecturer: _lecturer
                });
        }
    }

    function updateGroupMarks(uint _id, string memory _marks,  string memory _students) public {
        GroupMark storage groupMark = groupMarks[_id];
        // require(user.set);
        address sender = msg.sender;
        if(usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 3){
        groupMarks[_id] = GroupMark({
            id: _id,
            faculty: groupMark.faculty,
            group: groupMark.group,
            year: groupMark.year,
            half: groupMark.half,
            students: _students,
            marks: _marks,
            article: groupMark.article,
            lecturer: groupMark.lecturer
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
        GroupMark memory _groupMark = groupMarks[_id];
        return string(abi.encodePacked("{", '"id":"', uint2str(_groupMark.id),  '", "faculty":"', uint2str(_groupMark.faculty), '", "group":"', _groupMark.group, '", "year":"', _groupMark.year, '", "half":"', uint2str(_groupMark.half),  '", "students":"', _groupMark.students, '", "marks":"', _groupMark.marks, '", "lecturer":"', _groupMark.lecturer, '", "article":"', uint2str(_groupMark.article), '"}'));
    }

    function filter(uint _faculty, string memory _group, string memory _year, uint _half, uint _article, string memory _lecturer) view public returns(string memory){
        bytes memory result = "[";
        uint count = 0;
        bool select = true;

        for(uint i = 0; i < keys.length; i++){
            select = true;

            if(_faculty != 0){
                if(_faculty == groupMarks[keys[i]].faculty){
                    select = select && true;
                }else{
                    select = select && false;
                }
            }else{
                select = select && true;
            }


            if(!compareStrings(_group, "")){
                if(compareStrings(_group, groupMarks[keys[i]].group)){
                    select = select && true;
                }else{
                    select = select && false;
                }
            }else{
                select = select && true;
            }

            if(!compareStrings(_year, "")){
                if(compareStrings(_year, groupMarks[keys[i]].year)){
                    select = select && true;
                }else{
                    select = select && false;
                }
            }else{
                select = select && true;
            }

            if(_half != 0){
                if(_half == groupMarks[keys[i]].half){
                    select = select && true;
                }else{
                    select = select && false;
                }
            }else{
                select = select && true;
            }

            if(_article != 0){
                if(_article == groupMarks[keys[i]].article){
                    select = select && true;
                }else{
                    select = select && false;
                }
            }else{
                select = select && true;
            }

            if(!compareStrings(_lecturer, "")){
                if(compareStrings(_lecturer, groupMarks[keys[i]].lecturer)){
                    select = select && true;
                }else{
                    select = select && false;
                }
            }else{
                select = select && true;
            }

            if(select){

                if(groupMarks[keys[i]].id != 0){

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

    function deleteGroupMark(uint _id) public{
        int i = getIndex(_id);
        if(i != -1){
            delete groupMarks[_id];
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
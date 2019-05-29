pragma solidity ^0.5.0;

interface FacultyInterface{

    function createFaculty(string calldata _name, string calldata _shortDesc, string calldata _info, string calldata _img, string calldata _phone, string calldata _email) external returns(uint256);

    function getById(uint256 _id) view external returns(string memory);

    function getKeys() view external returns(uint256[] memory);

    function getAll() view external returns(string memory);

    function getByKeys(uint[] calldata _keys) view external returns(string memory);
}


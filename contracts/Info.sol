pragma solidity ^0.5.0;

import "./Users.sol";


contract Info{
    string addresses = "";
    string phones = "";
    string emails = "";
    string sections = "";
    string locationCoordinates = "";
    string socialLinks = "";

    Users usersABI;
    address usersAddress;

    constructor(address _userAddress) public{
        usersAddress = _userAddress;
        usersABI = Users(usersAddress);
    }

    function save(string calldata _addresses, string calldata _phones, string calldata _emails, string calldata _sections, string calldata _locationCoordinates, string calldata _socialLinks) external{
        address sender = msg.sender;

        if(usersABI.checkUserExists(sender) && usersABI.getRole(sender) == 100){
            addresses = _addresses;
            phones = _phones;
            emails = _emails;
            sections = _sections;
            locationCoordinates = _locationCoordinates;
            socialLinks = _socialLinks;
        }
    }

    function getData() view external returns(string memory){
        return toJson();
    }

    function toJson() view public returns(string memory){
        bytes memory _info =abi.encodePacked("{");

        if(bytes(addresses).length == 0){
            _info = abi.encodePacked(_info,  '"addresses":', '""');
        }else{
            _info = abi.encodePacked(_info,  '"addresses":"', addresses, '"');
        }

        if(bytes(phones).length == 0){
            _info = abi.encodePacked(_info,  ', "phones":', '""');
        }else{
            _info = abi.encodePacked(_info,  ', "phones":', phones);
        }


        if(bytes(emails).length == 0){
            _info = abi.encodePacked(_info,  ', "emails":', '""');
        }else{
            _info = abi.encodePacked(_info,  ', "emails":', emails);
        }

        if(bytes(sections).length == 0){
            _info = abi.encodePacked(_info,  ', "sections":', '""');
        }else{
            _info = abi.encodePacked(_info,  ', "sections":', sections);
        }

        if(bytes(locationCoordinates).length == 0){
            _info = abi.encodePacked(_info,  ', "locationCoordinates":', '""');
        }else{
            _info = abi.encodePacked(_info,  ', "locationCoordinates":', locationCoordinates);
        }

        if(bytes(socialLinks).length == 0){
            _info = abi.encodePacked(_info,  ', "socialLinks":', '""');
        }else{
            _info = abi.encodePacked(_info,  ', "socialLinks":', socialLinks);
        }

        _info = abi.encodePacked(_info, '}');

        return string(_info);

    }
}
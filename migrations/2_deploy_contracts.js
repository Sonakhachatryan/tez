var Users = artifacts.require("./Users.sol");
var Faculties = artifacts.require("./Faculties.sol");
var Info = artifacts.require("./Info.sol");
var Chairs = artifacts.require("./Chairs.sol");
var Articles = artifacts.require("./Articles.sol");
var Students = artifacts.require("./Students.sol");
var Lecturers = artifacts.require("./Lecturers.sol");
var AcademicWorks = artifacts.require("./AcademicWorks.sol");
var GroupMarks = artifacts.require("./GroupMarks.sol");

module.exports = function(deployer) {

  deployer.deploy(Users).then(function() {
    deployer.deploy(Faculties, Users.address);
    deployer.deploy(Chairs, Users.address);
    deployer.deploy(Info, Users.address);
    deployer.deploy(Articles, Users.address);
    deployer.deploy(Students, Users.address);
    deployer.deploy(Lecturers, Users.address);
    deployer.deploy(AcademicWorks, Users.address);
    return deployer.deploy(GroupMarks, Users.address);
  });

  // deployer.deploy(Faculties);
  // deployer.deploy(Chairs);
  // deployer.deploy(Info);
  // deployer.deploy(Articles);
  // deployer.deploy(Students);
  // deployer.deploy(Lecturers);
  // deployer.deploy(AcademicWorks);
  // deployer.deploy(GroupMarks);
};

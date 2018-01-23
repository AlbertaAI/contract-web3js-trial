var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
};

var Token = artifacts.require("Token");

module.exports = function(deployer) {
  deployer.deploy(Token);
};

var IoT = artifacts.require("./iot.sol");

module.exports = function(deployer) {
  deployer.deploy(IoT);
};

const IoT = artifacts.require("./iot.sol");

contract("IoT", accounts => {
  it("mike is the name..", async () => {
    const IoTInstance = await IoT.deployed();

    await IoTInstance.create_profile("0x669488719A5Cd38BC77337f421CCD69b45b51c3f", "mike", 123, { from: accounts[0] });
    // Get stored value
    const result = await IoTInstance.get_profile_name.call(0);
    
    assert.equal(result, 123)
  });

  it("sensor = temperature..", async () => {
    const IoTInstance = await IoT.deployed();

    await IoTInstance.create_device(0, 22, "temperature", "react", "%", { from: accounts[0] });

    // Get stored value
    const result = await IoTInstance.get_device_sensor.call(0);
    
    assert.equal(result, "temperature")
  });



});
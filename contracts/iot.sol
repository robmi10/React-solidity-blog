pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

contract IoT {
  address public owner;

mapping(uint => Profile) Profile_map;
mapping(address => uint) balances;

struct Profile{
    address owner;
    string username;
    uint password;
    mapping(uint => Device[]) Device_map;
    mapping(uint => Post[]) Post_map;
}

struct Device{
    uint id;
    uint devid;
    string sensor;
    string topic;
    string symbol;
}

struct Post{
    uint id;
    uint postid;
    string post;
    string symbol;
    uint likes;
    uint tipamount;
}

Profile[] public new_list;
uint counter;
    
function create_profile(address _owner, string memory _username, uint _password) public{
    Profile memory m = Profile(_owner, _username, _password);
    new_list.push(m);
    counter++;
}

function create_device(uint _id, uint _devid, string memory _sensor, string memory _topic, string memory _symbol) public{
    Device memory m =  Device(_id, _devid, _sensor, _topic, _symbol);
    new_list[_id].Device_map[_id].push(m);
}

function create_post(uint _id, uint _postid, string memory _post, string memory _symbol, uint _likes, uint _tipamount) public{
    Post memory m =  Post(_id, _postid, _post, _symbol, _likes, _tipamount);
    new_list[_id].Post_map[_id].push(m);
}

function get_all_device(uint _id)public view returns(Device [] memory){
    return new_list[_id].Device_map[_id];
}

function get_all_post(uint _id)public view returns(Post [] memory){
    return new_list[_id].Post_map[_id];
}

function get_profile_name(uint _id)public view returns(uint){
     Profile memory m = new_list[_id];
    return m.password;
} 

function get_device_sensor(uint _id)public view returns(string memory){
    Device memory m = new_list[_id].Device_map[_id][_id];
    return m.sensor;
}   

function get_address(uint _id)public view returns(address){
    address s = new_list[_id].owner;
    return s;
}

function get_address_balance(uint _id)public view returns(uint){
    address s = new_list[_id].owner;
    return s.balance;
}

function get_test_address_balance(address payable receiver, uint amount)public payable returns(uint){
   // address s = new_list[_id].owner;
   amount = msg.value;
    receiver.transfer(amount);
}

function get_device(uint _id, uint _devid)public view returns(uint, string memory, string memory){
   
   uint devid;
   string memory topic;
   string memory sensor;
   for(uint i = 0; i < new_list[_id].Device_map[_id].length; i++){
       
       if(_devid == new_list[_id].Device_map[_id][i].devid){
           
           devid = new_list[_id].Device_map[_id][i].devid;
           topic = new_list[_id].Device_map[_id][i].topic;
           sensor = new_list[_id].Device_map[_id][i].sensor;
       }
   }
    return (devid, topic, sensor);
}

function transfer_like(uint _id, uint _postid, address payable receiver, uint amount)public payable{
   
   for(uint i = 0; i < new_list[_id].Post_map[_id].length; i++){
       
       if(_postid == new_list[_id].Post_map[_id][i].postid){
           new_list[_id].Post_map[_id][i].likes += 1;
            receiver.transfer(amount);
       }
   }
   
}


}

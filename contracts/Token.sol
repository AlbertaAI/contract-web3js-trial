pragma solidity ^0.4.11;

import './IERC20.sol';
import './SafeMath.sol';

contract Token is IERC20 {

    //Saves the uint256 data from Overflow (above the scope) and Underflow (negative number) Attacks
    using SafeMath for uint256;

    uint public _totalSupply = 0;

    string public constant symbol = "ALBTEST";
    string public constant name = "Alberta Test Token";
    //How the tokens can be broken, denominated, in wallet 1000 ALBTEST will be showed 1.000
    uint8 public constant decimals = 18;

    // 1 ether = 500 ALBTEST
    uint256 public constant RATE = 500;

    address public owner;

    //Mapping - how much balance each account has
    mapping(address => uint256) balances;
    //Mapping - how much tokens is someone allowed to sell to someone else
    mapping(address => mapping(address => uint256)) allowed;

    //Fallback function, noname, for example when people send money directly to the contract address
    function () payable {
        createTokens();
    }

    //Constructor function, setting the contract creator as owner
    function Token() {
        owner = msg.sender;
    }

    //Creates tokens, payable - accepts ether
    function createTokens() payable {
        //Checks if the amount of ether sent is > 0
        require(msg.value > 0);

        //Creates Tokens
        uint256 tokens = msg.value.mul(RATE);
        //Adds tokens to the balance of the contract creator
        balances[msg.sender] = balances[msg.sender].add(tokens);
        //Adds number of created tokens to the total supply
        _totalSupply = _totalSupply.add(tokens);

        //Transfers the ether sent to the contract to the owner of the contract
        owner.transfer(msg.value);
    }

    //Tokens supply
    function totalSupply() constant returns (uint totalSupply) {
        //Returns the total number of tokens in circulation
        return _totalSupply;
    }

    //Balance of the account
    function balanceOf(address _owner) constant returns (uint balance) {
        //Returns the balance of the address
        return balances[_owner];
    }

    //Tokens selling by the issuer
    function transfer(address _to, uint _value) returns (bool success) {
        //Like the 'if' statement
        require(
            //Checks if the balance on the issuer account is greater than the value sent
            balances[msg.sender] >= _value
            //Checks if the amount sent is greater than 0
            && _value > 0
        );
        //Decreases balance of the tokens issuer by the value sent
        balances[msg.sender] = balances[msg.sender].sub(_value);
        //Increases balance of the tokens buyer by the value received
        balances[_to] = balances[_to].add(_value);
        //Transfer event
        Transfer(msg.sender, _to, _value);
        //On success
        return true;
    }
    //Tokens reselling
    function transferFrom(address _from, address _to, uint _value) returns (bool success) {
        require(
            //Checks if amount allowed by the contract owner to send by sender is greater than value sent
            allowed[_from][msg.sender] >= _value
            //Checks if the balance on the seller account is greater than the value sent
            && balances[_from] >= _value
            //Checks if the amount sent is greater than 0
            && _value > 0
        );
        //Decreases balance of the seller by the value sent
        balances[_from] = balances[_from].sub(_value);
        //Increases balance of the buyer by the value sent
        balances[_to] = balances[_to].add(_value);
        //Decreases the nr of tokens seller is allowed to sell to someone else
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        Transfer(_from, _to, _value);
        return true;
    }

    //Tokens receiving
    function approve(address _spender, uint _value) returns (bool success) {
        //Allows the buyer get the sent amount of tokens
        allowed[msg.sender][_spender] = _value;
        //Approval of tokens by buyer and contract owner
        Approval(msg.sender, _spender, _value);
        return true;
    }
    //Tokens selling limit
    function allowance(address _owner, address _spender) constant returns (uint remaining) {
        //Returns how much tokens seller is allowed to sell
        return allowed[_owner][_spender];
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

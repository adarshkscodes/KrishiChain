// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./KCToken.sol";

contract KCEscrow is Ownable {
    uint256 private _id;                               // simple counter
    enum Status { Pending, Delivered, Released, Refunded }

    struct Order {
        address buyer;
        address seller;
        uint256 amount;
        Status  status;
        string  ipfsCid;
    }

    mapping(uint256 => Order) public orders;
    KCToken public immutable rewardToken;
    uint256 public constant REWARD = 10 * 1e18;        // 10 KCT

    event OrderCreated(uint256 id, address buyer, address seller, uint256 amount, string cid);
    event Delivered(uint256 id);
    event Released(uint256 id);
    event Refunded(uint256 id);

    constructor(address token) Ownable(msg.sender) {
        rewardToken = KCToken(token);
    }

    function createOrder(address seller, string calldata cid) external payable returns (uint256 id) {
        require(msg.value > 0, "Payment required");
        _id += 1;
        id = _id;
        orders[id] = Order(msg.sender, seller, msg.value, Status.Pending, cid);
        emit OrderCreated(id, msg.sender, seller, msg.value, cid);
    }

    function confirmDelivery(uint256 id) external {
        Order storage o = orders[id];
        require(msg.sender == o.buyer, "Only buyer");
        require(o.status == Status.Pending, "Wrong state");
        o.status = Status.Delivered;
        emit Delivered(id);
    }

    function release(uint256 id) external {
        Order storage o = orders[id];
        require(o.status == Status.Delivered, "Not delivered");
        o.status = Status.Released;
        payable(o.seller).transfer(o.amount);
        rewardToken.mint(o.seller, REWARD);
        emit Released(id);
    }

    function refund(uint256 id) external onlyOwner {
        Order storage o = orders[id];
        require(o.status == Status.Pending, "Cannot refund");
        o.status = Status.Refunded;
        payable(o.buyer).transfer(o.amount);
        emit Refunded(id);
    }
}

pragma solidity ^0.8.7;
//SPDX-License-Identifier: MIT

import "@opengsn/contracts/src/BaseRelayRecipient.sol";


contract Counter is BaseRelayRecipient {

	uint public counter;
	address public lastCaller;

	constructor(address _forwarder) {
		_setTrustedForwarder(_forwarder);
	}

	function versionRecipient() external override pure returns (string memory) {
		return "2.2.1";
	}

	function increment() public {
		counter++;
		lastCaller = _msgSender();
	}
} 


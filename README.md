# Sample GSN project with ethers.

This is a simple project to demonstrate using OpenGSN

Usage:
```
yarn install

ganache-cli & (or in another terminal)

yarn test
```

The test brings up a full GSN envorment by calling `startGsn()`. It deploy the contracts and starts a relay inside your test.
The test then shows how to configure your ethers instance to use GSN.

The tests themselves merely verify that the call was relayed (caller didn't pay..) and that indeed it can see the caller's address (using `_msgSender()`)

You can also start GSN outside the test:
- start GSN from another window, by calling: 
  ```
  npx gsn start localhost
  ```
  
- In the test, remove the `startGSN()` in the test.
- Update the test to read the relayHub address (and other deployed components):
  ```
  relayHubAddress = require('./build/gsn/RelayHub').address
  ```


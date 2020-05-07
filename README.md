# Sample GSN project with ethers.

This is a simple project to demonstrate using OpenGSN

Usage:
```
yarn install

ganache-cli & (or in another terminal)

yarn test
```

The teest brings up a full GSN envorment by calling `startGsn()`. It deploy the contracts and starts a relay inside your test.
The test then shows how to configure your ethers instance to use GSN.

Instead, you can run it outside of your test, by calling
```
npx gsn start localhost
```

In that you need to read the hub address saved by the deployment: 
```
hubAddress = require('./build/gsn/RelayHub').address
```


# express-lockdown
Adding security top-down to express, one click install and one line execution.  
Built for simplicity, optimization, and network performance.  
## setup
The main function, can be exported as `const { lockdown } = require('express-lockdown')`  
and it just needs to be called as: `lockdown(app /* express server */, ?config)`  
The config setting is optional, but it has these features as default:  
`debuggingOutboundLogs: 1`  
`ddosProtection: 1`  
`compression: 1`  
`helmet: 1`  
`warnDDoS: 0`  

---
title: Module Signing
---
After building a module for Ignition it must be signed before it can be installed on a system that is not in developer mode.

Modules can be signed using either a real code signing certificate obtained from a Certificate Authority or using a self-generated and self-signed certificate. What kind of certificate you use to sign your module depends on the level of assurance you want to offer your end users. If you're building a module for internal use within your company, using a self-signed certificate may not be an issue. If you're selling a module to other users of Ignition you should use a certificate obtained from a CA.

## Getting Started
What you'll need:

* Code signing certificate.
* The full certificate chain, in the correct order, in p7b (PKCS7) format.
* The [IA module signing tool](https://github.com/inductiveautomation/module-signer).

## Signing Your Module
Your certificate and its private key should be stored inside a Java keystore. You'll need this keystore file and the associated certificate chain to run the module signing tool. The certificate will be stored under an alias and password protected. 

Run the signing tool providing the following parameters:

```js
java -jar module-signer.jar \ 
    -keystore=<path-to-my-keystore>/keystore.jks \
    -keystore-pwd=<password> \
    -alias=<alias>\
    -alias-pwd=<password> \
    -chain=<pathToMyp7b>/cert.p7b \
    -module-in=<path-to-my-module>/my-unsigned-module.modl \
    -module-out=<path-to-my-module>/my-signed-module.modl
```
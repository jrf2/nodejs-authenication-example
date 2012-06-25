nodejs-authenication-example
============================

an example of how to do authenication in node js, using a simple forum as an example

Notes
=====
- This app will only work properly under linux, specifically because of the bcrypt module. Apparently, the crypto module can be used instead under windows, if you are interested.

- You must rename the config.json.defaults file to config.json and change any of the necessary values

- This app requires that you also run your own mysql server to connect to for storing usernames and passwords

- It is possible to set this app to run on https, simply go into app.js and uncomment the two lines that read in the privatekey and certificate. Also, right below that the createServer function must be passed the key and cert objects. To generate these two files you must run the following commands first: 

openssl genrsa -out privatekey.pem 1024 
openssl req -new -key privatekey.pem -out certrequest.csr 
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem

See this page for details on https in nodejs: http://silas.sewell.org/blog/2010/06/03/node-js-https-ssl-server-example/
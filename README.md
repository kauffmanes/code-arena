Name: Code-Arena
Description: A website that you can create live coding sessions to share with select people. 
Purpose: To aid in programming classes when students can't see the board, or have accessibility concerns, or can't make it to class.

THIS IS NOT UP TO DATE

The web browser interacts only with the HTTP server and REST API.

# Professor Flows

## Flow 1: Professor Creates a New Session
1. Prof goes to www.carrot.com/
2. Prof clicks a button that creates a new demo
3. The page URI updates with the shareable demo ID

REQUEST: GET http://www.domain.com/
RESPONSE: 200 OK - /index.html

### Summary:
The frontend code lives on a dedicated server or VPS (hereby referred to as the app server). When the Prof requests the carrot website,
an Erlang HTTP server running on the app server handles the GET / and returns the public/app/index.html page to the Prof's web browser.
No dedicated connections have been opened - a simple HTTP request. Any subsequent website routing is handled by the frontend site (React.js).

The prof then will perform a UI action (such as a clicking a button labeled "new demo") with the intent of starting a new demo. The button will create a WebSocket
object (https://scotch.io/bar-talk/build-a-realtime-chat-server-with-go-and-websockets) and send it to the socket server (written in Erlang).
The socket server will be set up to accept incoming WebSocket connections (see specs later). The server will accept this
initially as an HTTP connection, but upgrade it to a persistent two-way connection between client and server. As the prof types, the send() function in the UI
will send the current demo code as a message to the server via the connection. The socket server will broadcast the latest line of code to the active connections.


### NOTES:
- The routing after initial page is handled by frontend.
- possibly instead of sending the entire code to the socket server, just send one line with the line's number (save on size of calls)
------------------------------------------------------------

## Flow 2: Professor Live Codes on Site
1. Prof completes Flow 1
2. Prof begins typing in demo editor

## Flow 3: Professor Saves Her Session
1. Prof completes Flow 1 (and optionally Flow 2)
2. Prof clicks a "save" button
3. Prof is notified that the demo has been saved

## Flow 4: Professor Terminates Demo
1. Prof completes Flow 1 (and optionally Flows 2 & 3)
2. Prof clicks demo cancellation button
3. The demo closes

## Flow 5: Professor Shares Live Demo URI
1. Prof completes Flow 1 (and optionally Flows 2 & 3)
2. Prof gives the URI (ex. carrot.com/demo/1g5F7h) to any number of Students

# Student Flows

## Flow 6: Student accesses live demo
1. Student receives a URI from a Professor
2. Student goes to the URI (ex. carrot.com/demo/1g5F7h)
3. Student is able to watch as content updates

## Flow 7: Student submits question via chatbar
1. Student completes Flow 6
2. Student clicks into chatbar, types a question, and submits
3. This appears on the chat window shared by everyone watching the demo

# Erlang web server

## To install
`$ sudo apt-get install erlang`

## To start HTTP server with basic configuration
`$ erl`
`$ inets:start().`

If you specify the port as 0, it will dynamically assign one.
`$ {ok, Pid} = inets:start(httpd, [{port, 80}, {server_name, "www.lab216.space"}, {server_root, "/var/www/carrot-share"}, {document_root, "/var/www/carrot-share/public"}, {bind_address, "localhost"}]).`

To check the assigned port:
`$ httpd:info(Pid).`

```
 [{mime_types,[{"htm","text/html"},{"html","text/html"}]},
 {server_name,"httpd_test"},
 {bind_address,{127,0,0,1}},
 {server_root,"/var/www/carrot-share"},
 {port,38422},
 {document_root,"/var/www/carrot-share/public"}]

```

To reload configuration without restarting server:
`$ httpd:reload_config([{port, 38422}, {server_name, "httpd_test"}, {server_root, "/var/www/carrot-share"}, {document_root, "/var/www/carrot-share/public"}, {bind_address, "localhost"}, non_disturbing]).`

## Programming Idioms Notes (pg. 415, Armstrong)

Clients don't send requests using Erlang terms - they send HTTP requests over TCP connections. To simplify things, we interpose a process called a "middle man" between the TCP driver that receives the messages
from the HTTP client and our Erlang server. The middle man parses the HTTP requests and turns them into Erlang messages. 

Figure:
|------------|                |------------|                 |------------|
| TCP Driver | <------------> | Middle Man | <-------------> | Web Server |
|------------|    HTTP Msgs   |------------|   Erlang Msgs   |------------|

As far as the server is concerned, the outside world only speaks Erlang. Instead of having one process that handles HTTP requests and serving the requests, we now have two, each with a clearly defined role.

## Install Rebar3
`$ cd /usr/local/bin`
`$ wget https://s3.amazonaws.com/rebar3/rebar3 && chmod +x rebar3`

## Create new app with Rebar3
```
$ pwd
/var/www
$ rebar3 new app carrot
===> Writing carrot/src/carrot_app.erl
===> Writing carrot/src/carrot_sup.erl
===> Writing carrot/src/carrot.app.src
===> Writing carrot/rebar.config
===> Writing carrot/.gitignore
===> Writing carrot/LICENSE
===> Writing carrot/README.md
```

## Install erlang.mk - alternative to Rebar?

## To run/create release
make run

## Cowboy Notes
A listener is a set of processes that listens on a port for new connections. Incoming connections get handled by 
Cowboy. Two types of listeners are provided: clear TCP connections, and secure TLS. Both support HTTP 1 & 2.

## Ports
Unix won't let you run a non-privileged service on a port < 1024, so I am forwarding my port 80 to 8080, where my project is running using nginx proxy_pass

To start the application forever:
`$ ./_rel/carrot_release/bin/carrot_release start` - has to be a better way!

If you start the process in the bg and then can't figure out how to kill it, attach to it and kill the erl shell
`./_rel/carrot_release/bin/carrot_release attach`
^^ Actually this didn't work because of the -heart arg. I had to power down
the entire droplet

## Site Security
```
 sudo ufw reject out http
```


# Frontend
Basic routing is all handled on the frontend using the React framework. 

## To format code
`$ prettier --single-quote --print-width=120 --write ClientApp.jsx`


# Out of Scope Enhancements
- create folders and share these at permission levels (e.g. share a folder with a specific class so they can see your demos)
- flag a demo as "Live" if the Professor is an active connection
- create a share button that sends the URI to named email addresses
- ability to save demos to a unique username - or use OAuth to create an account with a school ID?
- charge schools for licenses
- a toggle switch for if you want your demo to be live/private/hidden, etc
- give control to people connected so that they can code
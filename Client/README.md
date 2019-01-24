# The Client
#### Technologies
![alt-text](https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/square_256/nodejslogo.png) 
![alt-text](https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/square_256/typescriptlang.png) 
![alt-text](http://icons.iconarchive.com/icons/papirus-team/papirus-apps/256/electron-icon.png)

The main technologies that are used in the client are Electron, Typescript, and Node. We use electron to host the main application and run connections to our server and the LCU. 
We also use electron because it allows for us to compile our project to an .exe for a demo. We use Node for general compiling and websocket/request support. 
Finally we use typescript since its a nice language to use when writing large peices of code and compiles down to javascript. 

#### Setting Up Missions 
We realized very early into development that the LCU doesnt load missions on the fly. It only loads/updates them at two points, after a user has logged in and after a match has completed. A diagramn of how the LCU normally handles missions on startup can be found below: 
![alt-text](https://raw.githubusercontent.com/Earleking/2018-Riot-API-Challenge/master/Documentation/LCU%20Missions%20-_%20Riot%20Implimentation.png)

In order to have the missions appear on the server we go through a couple steps:
1. User starts our program.
2. Program starts the league client.
3. Program wait for user to log in
4. Program logs the command line arguments and kills the render process
5. Program sets up a middleman server that connects to the LCU.
6. Render process is restarted with command line arguments that map the renderer to the middleman proxy.
7. When the program sees the /lol-missions/* endpoint being called it requests missions from our server and adds them to the missions from riots server.
8. Missions go to the render and the user sees both riot and our missions.

These steps can be repersented by this diagram:

![](https://raw.githubusercontent.com/Earleking/2018-Riot-API-Challenge/master/Documentation/Riot%20Missions%20our%20Implimentation.png)


# How To Install
- [GitHub](https://github.com/Earleking/2018-Riot-API-Challenge/tree/master/Client) `git clone https://github.com/Earleking/2018-Riot-API-Challenge.git
```
npm install
npm run dev
```



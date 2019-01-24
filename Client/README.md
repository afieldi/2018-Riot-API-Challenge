# The Client
#### Technologies
![alt-text](https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/square_256/nodejslogo.png) 
![alt-text](https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/square_256/typescriptlang.png) 
![alt-text](http://icons.iconarchive.com/icons/papirus-team/papirus-apps/256/electron-icon.png)

The main technologies that are used in the client are Electron, Typescript, and Node. We use electron to host the main application and run connections to our server and the LCU. 
We also use electron because it allows for us to compile our project to an .exe for a demo. We use Node for general compiling and websocket/request support. 
Finally we use typescript since its a nice language to use when writing large pieces of code and compiles down to javascript. 

#### Setting Up Missions 
We realized very early into development that the LCU doesn't load missions on the fly. It only loads/updates them at two points, after a user has logged in and after a match has completed. A diagram of how the LCU normally handles missions on startup can be found below: 
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

These steps can be represented by this diagram:

![](https://raw.githubusercontent.com/Earleking/2018-Riot-API-Challenge/master/Documentation/Riot%20Missions%20our%20Implimentation.png)

When you log in the home screen will have missions similar to the ones in the image below or at the following youtube link: https://youtu.be/nxp2FtBHDmY
![](https://i.imgur.com/5KqLV9F.png)

Endpoints used:
/lol-summoner/v1/current-summoner
/lol-missions/v1/missions
/missions/user/${puuid}
/lol-clubs/v1/clubs
### Setting Up Infastructure for 1v1 and Clan Wars
players have the abilitiy to challenge other players from other teams to a 1v1 for points. In order to do this we run a client side endpoint with 3 main endpoints which the server can call:
* endpoint for creating lobby
* endpoint for sending invites
* endpoint for regestering on the 1v1
When the client initially launches it creates a tunnel for the server to communicate with the client. Then whenever a 1v1 is initiated the server calls the endpoints on the client to send out the invites. If the user wants to accept the invite then they can 1v1. The match is setup with the following json

```
{
                "customGameLobby":
                    {
                        "configuration":
                            {
                                "gameMode":"ARAM",
                                "gameMutator":"",
                                "gameServerRegion":"",
                                "mapId":12,
                                "mutators":{"id":6},
                                "spectatorPolicy":"AllAllowed",
                                "teamSize":1
                            },
                        "lobbyName":Lobbyname,
                        "lobbyPassword":"PATRICKIN2018"
                    },
                "isCustom":true
            }
```
Gamemode is aram which maps to the aram map but he draft strategy is tournament so that you can ban out some of the opponents champions or some of the OP champions. 

Endpoints used:
/lol-summoner/v1/current-summoner
/lol-lobby/v2/lobby
/lol-lobby/v2/lobby/invitations
/lol-lobby/v2/received-invitations/

### Technical challenges In The Client
The main issue with this client was setting up the proxy, the LCU makes setting up the client a nightmare with mutliple hoops that need to be jumped through in order to have your own custom missions appear. Another issue is that the client seems to reinsitatiate the LCU on champ select so if we want to keep the UI clean we have to manually manage the render processes. Since the riotclient endpoint isnt allowed we used manual process killing and starting for a large part of the application which made the behaviour a lot more flakey than we would like. If you would like to see the less flakey behaviour feel free to enable the riot client calls and disable the line below them. 
    
# How To Install
- [GitHub](https://github.com/Earleking/2018-Riot-API-Challenge/tree/master/Client) `git clone https://github.com/Earleking/2018-Riot-API-Challenge.git
```
npm install
npm run dev
```




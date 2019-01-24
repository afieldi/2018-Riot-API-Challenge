
# The Client
#### Technologies
![alt-text](https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/square_256/nodejslogo.png) ![alt-text](https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/square_256/typescriptlang.png) 
![alt-text](http://icons.iconarchive.com/icons/papirus-team/papirus-apps/256/electron-icon.png)

The main technologies that are used in the client are Electron, Typescript, and Node. We use electron to host the main application and run connections to our server and the LCU. We also use electron because it allows for us to compile our project to an .exe for a demo. We use Node for general compiling and websocket/request support. Finally we use typescript since its a nice language to use when writing large pieces of code and compiles down to javascript. 

#### Setting Up Missions 
We realized very early into development that the LCU doesn’t load missions on the fly. It only loads/updates them at two points, after a user has logged in and after a match has completed. 
A diagram of how the LCU **normally** handles missions on startup can be found below: 
![alt-text](https://raw.githubusercontent.com/Earleking/2018-Riot-API-Challenge/master/Documentation/LCU%20Missions%20-_%20Riot%20Implimentation.png)

In order to have the missions appear on the server we go through a couple steps:
1. User starts our program.
2. Program starts the league client.
3. Program wait for user to log in.
4. If user is not registered on site, register them and generate missions.
5. Program logs the command line arguments and kills the render process.
6. Program sets up a middleman server that connects to the LCU.
7. Render process is restarted with command line arguments that map the renderer to the middleman proxy.
8. When the program sees the /lol-missions/* endpoint being called it requests missions from our server and adds them to the missions from riots server.
9. Missions go to the render and the user sees both riot and our missions.

These steps can be represented by this diagram:

![](https://raw.githubusercontent.com/Earleking/2018-Riot-API-Challenge/master/Documentation/Riot%20Missions%20our%20Implimentation.png)

When you log in the home screen will have missions similar to the ones in the image below or at the following **youtube** link: 
http://www.youtube.com/watch?v=nxp2FtBHDmY

[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/nxp2FtBHDmY/0.jpg)](http://www.youtube.com/watch?v=nxp2FtBHDmY)



Endpoints used:
* /lol-summoner/v1/current-summoner
* /lol-missions/v1/missions
* /missions/user/${puuid}
* /lol-clubs/v1/clubs

### Setting Up Infrastructure for 1v1 and Clan Wars
players have the ability to challenge other players from other teams to a 1v1 for points. In order to do this we run a client side endpoint with 3 main endpoints which the server can call:
* endpoint for creating lobby
* endpoint for sending invites
* endpoint for registering on the 1v1
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
Gamemode is aram which maps to the aram map but he draft strategy is tournament so that you can ban out some of the opponents champions or some of the OP champions. We decided to use a static password because in reality these lobbies are going to be filling up extremely quickly with our auto accept invite. In the future this would be set to a random hash. 

You can see a demo of the feature over here:
[![IMAGE ALT TEXT HERE](https://i.imgur.com/SY1yqci.png)](https://www.youtube.com/watch?v=zkY1zZsIDiE)

Endpoints used:
* /lol-summoner/v1/current-summoner
* /lol-lobby/v2/lobby
* /lol-lobby/v2/lobby/invitations
* /lol-lobby/v2/received-invitations/

### Technical Challenges In The Client
The main issue with this client was setting up the proxy, the LCU makes setting up the client a nightmare with multiple hoops that need to be jumped through in order to have your own custom missions appear. Another issue is that the client seems to re-instantiate the LCU on champ select so if we want to keep the UI clean we have to manually manage the render processes. Since the RiotClient endpoint isn’t allowed we used manual process killing and starting for a large part of the application which made the behaviour a lot more flakey than we would like. If you would like to see the less flakey behaviour feel free to enable the riot client calls and disable the line below them. 

Another smaller issue that we experienced was a timing issue, we needed to delay sending the invite for 5000ms because sometimes the lobby wouldn’t be ready by the time our code hit the invite to lobby line. 

### Closing Remarks 
Overall the client was decently hard to work with, learning how to set up the proxy so that we could see missions through the client was hard but rewarding. I would like to see more official support from riot to better document the client for us developers to work with. I think that we could make a lot more awesome stuff if we better understood how the client worked. 

##How To Install
```
git clone https://github.com/Earleking/2018-Riot-API-Challenge.git
goto $clonedir/Client
npm install
npm run dev
```
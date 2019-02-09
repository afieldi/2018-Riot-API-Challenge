# Insert MissionsHere
[Winner of the Creativity Category of the 2018 Riot API Challenge] (https://www.riotgames.com/en/DevRel/api-challenge-recap-winter-2019)
Created by Earleking and Vexrax

[Leaderboard Website](http://riot-api-2018.herokuapp.com/)

[Client](https://github.com/Earleking/2018-Riot-API-Challenge/tree/master/Client)

# Introduction 
Hello, this is our project, Insert Mission Here. The goal of this project was to help foster a stronger communal environment in League of Legends. While you play with 9 other people each game there is often very little connecting any of you before or after the game. With Insert Mission Here we try to achieve this goal by using what we feel is an underdeveloped feature that Riot has previously implemented, Clubs.

# What it Does
There are 2 main parts to this project - missions for clubs and individuals along with what we have dubbed Club Wars. When a user completes a mission they earn points towards their respective leaderboard, either their club leaderboard or their individual leaderboard. Players can accumulate Leaderboard Points and the top scorers of these points are displayed on the leaderboards page on our website. In addition to regular missions you can earn points by challenging you fellow players and clubs, a club war will put you into a winner take all 5v5 summoner's rift match where you will take points from the other team if you win. A solo war will put you into a howling abyss match. We feel like our project will not only give players a reason to be in a club but also give them extra incentive to complete missions.
## Missions

![Image of Missions](https://i.imgur.com/5KqLV9F.png)

In Insert Mission Here we are able to assign custom missions. There are two main types of these missions - club missions and solo missions. The solo missions are assigned to each player and they must be completed individually. Club missions on the other hand are assigned to a Club. When logged into the client every Player in the Club will be assigned this mission and every player is able to contribute to the missions success. 

We hope that these missions give people a reason to engage with their club members to complete the Club missions. Ultimately we hope this will both help foster engagement in current players as well as try to get existing players to help their friends get into the game.

## Club Wars

![Image of Client Showing A 1v1](https://i.imgur.com/vdp15lN.png)

While group missions are great, we wanted to create a singular event that would bring entire clubs together to play, cheer and win together. To this end we created Club Wars. These would be auto generated custom games between Clubs. You would register for a club war and then when the time came you would be automatically inserted into a game along with your teammates to face off against another clan for honor, glory, and some leaderboard points.

## Club Challenges
 
While the Club Wars allow larger for larger Club events, we also wanted to allow for players who might not be able to partake in these due to real world constraints to participate in Club conflicts. These are 1v1s that can take place between members of different Clubs at any time. You can go onto the web portal and challenge any of the available players to a 1v1. You can’t challenge anyone from the same Club because friends shouldn’t fight. 

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
https://youtu.be/zkY1zZsIDiE?t=28
[![IMAGE ALT TEXT HERE](https://i.imgur.com/SY1yqci.png)](https://youtu.be/zkY1zZsIDiE?t=28)

Endpoints used:
* /lol-summoner/v1/current-summoner
* /lol-lobby/v2/lobby
* /lol-lobby/v2/lobby/invitations
* /lol-lobby/v2/received-invitations/

### Technical Challenges In The Client
The main issue with this client was setting up the proxy, the LCU makes setting up the client a nightmare with multiple hoops that need to be jumped through in order to have your own custom missions appear. Another issue is that the client seems to re-instantiate the LCU on champ select so if we want to keep the UI clean we have to manually manage the render processes. Since the RiotClient endpoint isn’t allowed we used manual process killing and starting for a large part of the application which made the behaviour a lot more flakey than we would like. If you would like to see the less flakey behaviour feel free to enable the Riot client calls and disable the line below them. The proxy that we set up also adds a lot of overhead in terms of load time to UI components, this slows the client down quite a bit.

Another smaller issue that we experienced was a timing issue, we needed to delay sending the invite for 5000ms because sometimes the lobby wouldn’t be ready by the time our code hit the invite to lobby line. 

### Closing Remarks 
Overall the client was fairly hard to work with, especially learning how to set up the proxy so that we could see missions through the client was hard but rewarding. I would like to see more official support from Riot to better document the client for us developers to work with. I think that we could make a lot more awesome stuff if we better understood how the client worked. 

    
### How To Install
As we use a proxy for displaying the missions in the client this application unfortuantly is unsuitable for public distribution. 



# Web Development
The server was divided up into 4 main sections. These are the database itself (Database), a server to access the database (Database Server) and a management server (Management Server) that contains all the business logic and finally the Website. 

![Image of Overall Architecture](https://i.imgur.com/FnAtuMf.png)

## Management Server
The management server is the center of Insert Mission Here. It is what connects all of the individual pieces together turning it into one functioning body. The website and the client both make calls for data and functionality to this server. After querying the Database Server and transforming any necessary data it returns them where they are displayed. This server is created using TypeScript along with an Express server. Along with the Database Server it is served on an EC2 Amazon Web Services instance.

## Database and Database Server

![Image of ER Diagram](https://i.imgur.com/1B7k3rn.png)

Image above is the diagram of our database Schema. We needed to be able to extensively store data so that we can record mission progress as well as any club wars that are occuring. The database uses MySQL. We decided that because of how tightly linked a lot of this data is a relational database would be the best choice. From their we decided to use MySQL as it was one we both were familiar with. The final database is currently being hosted by Amazon Web Services.

The Database Server is coded in TypeScript and is very barebones. It is only able to access and return data from the database. No data transformation occurs here and this server can only be accessed locally by the Management Server which is running on the same machine as it. 

## Website
![Image of Angular Logo](https://angular.io/assets/images/logos/angularjs/AngularJS-Shield.svg)

Keeping in line with the TypeScript theme, Angular 7 was used to create the web portal for Insert Mission Here. We both wanted to use Angular in particular for this project as neither of us had extensive experience with Single-Page Websites and they seemed extremely powerful. Using Angular’s powerful templating engine and dynamic http calls made the entire development process much easier.

## Issues
Throughout this development process we encountered many issues while developing our web applications. One of the main issues was communication. To ease the integration of our many components we used HTTP methods to communicate. While this was easy at first it became much more difficult near the end of the project when more data needed to be passed quickly. It was a major problem when we were trying to determine when someone disconnected from our application as if it is force closed there is no time to send a closing HTTP request. If we were to do a project like this we would used sockets to communicate between our Client and our Management Server.

Another issue that we encountered was recording mission progress. Because each mission needs to be updated individually with different code multiple implementations would need to be used. This is quite time consuming even for the small number of missions that we created for the purpose of the project. At the moment we are unsure of how to fix this in the future while maintaining diversity in the types missions. 

# Future Plans
Unfortunately there are likely not to be many future for this project in its’ entirety. To display missions we had to setup a proxy that intercepts and alters mission data before it gets to your client. While allowed for this API Challenge, this is not acceptable for a publicly distributed application. Due to this there it is likely that even if we continue this project, it will be in a different form. 

However that is not to say we have no regrets with this project. There were a lot of things that we wanted to include but simply didn’t have the time for. For example we wanted to create personalized missions for players. For example, if we noticed that you were a bad warder in past games we would give you missions such as, “Achieve x vision score” in a game. Another idea for the future was creating pools of clans. We would try and match up clans of similar size into smaller pools. The goal of this would be to eventually create a group of people that you get to know by playing against them consistently. 

# Conclusion

Expanding upon Clubs is something that we both feel is something that should be done. This project is simply our image of that future. Whether it takes this form or not, if Riot does end up expanding upon the vision of Clubs it is something that we think everyone should be excited about. 

Thank you for taking the time to look through our project!

![Poro waving image](https://vignette.wikia.nocookie.net/leagueoflegends/images/a/ab/Peace_Poro_Emote.png/revision/latest?cb=20181207233837)


<sub>Insert Mission Here was created under Riot Games' "Legal Jibber Jabber" policy and uses assets owned by Riot Games. Riot Games does not endorse or sponsor this project.

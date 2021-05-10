# rock-paper-scissors

A multi-player Rock, Paper, Scissors game written in Node.js.

Players are automatically created per session. To test, use two browser sessions that don't share cookies. For example, you could use a regular browser window and an incognito / private browser window.

## Overview

This application is built to microservices specifications. 

### Microservices

#### Service | PORT

`5000` | `web`

`5005` | `games API`

`5010` | `players API`

#### Protocols

- Communicate via REST APIs
- return JSON
- Database shared across all services — _not recommend!_

### Web Service

- Browser interaction
- Servce static content — `CSS`, `JS`
- Maintain sessions
- Send requests to games / player services

—

`GET /` show pending, final games

`POST /games` create a new game

`GET /games/:game_id` render game

`POST /games/:game_id/choice` player makes choice

`POST /games/:game_id/join` player joins game

`POST /games/:game_id/judge` determine result

### Player Model

`id` integer - unique identifier

`lastUpdated` - date/time

—

`POST` `/api/v1/players` create

`GET` `/api/v1/players/:player_id` get by id

### Game Model

`id` integer - unique identifier

`lastUpdated` date/time

`player1id / player2id` integer

`player1choice / player2choice` enum - rock, paper, scissors 

`state` enum - pending, final

`playerWinnerId` integer

—

`GET` `/api/v1/games` fetch games by criteria

`POST` `/api/v1/games` create game

`GET` `/api/v1/games/:game_id` get by id

`PATCH` `/api/v1/games/:game_id` update

`POST` `/api/v1/games/:game_id/judge` determine outcome

`GET` `/api/v1/rules` human-readable rules

## Setup

```bash
npm i
# Start docker, which provides a MySQL database.
docker-compose up -d
# Create the MySQL schemas.
./node_modules/.bin/knex migrate:latest
# Start PM2
pm2 start ./pm2.config.js
```

`pm2` Node.js Process Manager
- background service
- production runtime
- open source, cross-platform
- useful for microservices
- control and manage nodeJS processes
- start stop restart on changes
- monitor resources
- gather logs
- `stability` number of restarts
- `scaling` amount of resources used
- `usability` control processes without knowing the id

### Commands

````bash
# start up pm2
pm2 start ./pm2.config.js

# shows low level info on each app
pm2 show web

# get a list of all services
pm2 list

# stop specific service - web
pm2 stop web

# start specific service - web - with watching it
pm2 start web --watch

# stop pm2
pm2 kill

# see logs
pm2 logs
````

### Logging

#### Purpose

- Diagnostics of application health 
- debugging to determine what and when
- analysis of traffic, activity

#### Useful To Log

- status of operation
- what was requested and how
- who made the request
- how long did it take
- identifiers, like transactions or record

## Web

[http://localhost:5000/]()

1. First Window
    1. Click Start New
    2. Make a choice
2. Second Window
    1. Click an available game
    2. Click Join
    3. Make a choice
3. First Window
    1. Reload to see result 

## Manual

Using [HTTPie](https://httpie.org/), a command-line HTTP client.

```bash
http GET :5005/api/v1/rules
http POST :5010/api/v1/players
http GET :5010/api/v1/players/1
http POST :5010/api/v1/players
http GET :5010/api/v1/players/2
http POST :5005/api/v1/games player1id=1 player2id=2
http GET :5005/api/v1/games/1
http POST :5005/api/v1/games/1/judge
http PATCH :5005/api/v1/games/1 player1choice=rock player2choice=scissors
http POST :5005/api/v1/games/1/judge
http GET :5005/api/v1/games/1
```

## Teardown

Temporary:

```bash
# Stop services.
docker-compose stop
# Turn off PM2.
pm2 kill
```

Permanent (deletes database):

```bash
# Stop and remove containers, networks, images and volumes.
docker-compose down
# Turn off PM2.
pm2 kill
```


# Technical Considerations
This document aims to describe some higher level technical conepts being used.

## Components / Concepts
This section aims to describe certain components and concepts.

### Server
The server is a central component that is required. It may be ran either in the local network, or online in some sort of cloud
(recommended). It provides a graphical web interface, as well as several API's, mostly websockets. You can install various modules
on the server, as long as they provide the "plugin" mode.

### Standalone runner
The standalone runner is a component that connects to the server. It can load and run one single module. There can be an unlimited
number of standalone runners connected to a single server.

### Module
A module is a sub project, that provides any kind of functionality. A module must be a Node.js project (one single exception applies), 
and include a valid package.json. A module also has to describe some specific metadata in the package.json. A module can either 
provide a plugin mode, provide a standalone mode, or both.

#### Module: Plugin mode
A module in plugin mode can only be loaded by the server. It extends server functionality. Plugins can depend on other plugins, but
not on standalone modules.

#### Module: Standalone mode
A module in standalone mode can be loaded by a standalone runner. The runner doesn't have to be used. Then, there could be
any technology / programming language being used. But the websocket protocol then needs to be implemented by the component itself.

#### Module: Both modes
If a module specified both modes, it is assumed that the plugin needs to run on the server, and the standalone mode depends on the plugin. This can for example
be used to convert or reformat the data once it reaches the server.

#### Module: Dependencies
A module in plugin mode may depend on:
- another plugin
- nothing

A module in standalone mode may depend on:
- a plugin being installed on the server
- nothing

#### Module: Plugin or Standalone - some examples

|What?|Mode|
|---|---|
|A tool that scraps the LCU Api|Standalone|
|A tool that scraps the spectator client ingame Api|Standalone|
|A tool that scraps the League HTTP Api|Plugin|
|A tool that saves game in a certain format, for example in a database|Plugin|
|A tool that provides broadcast graphics (e.g. via browser source) of some statistics, for example the gold of the individual players or a gold graph|Plugin|
|A tool that takes the ingame data and creates some metrics with it for easier use by other plugins|Plugin|

### Event bus
All communication between modules (standalone and plugin mode) is done via the event bus. It runs on the server, and allows
to subscribe to events directly (plugin), as well as via websockets (standalone). Events always have a type, and some JSON
data attached.

#### Event bus: communication
If a module needs to request something from any plugin, it may send a event with a request type, and additional information.
Then, the plugin may send back something with a response type, and the module picks that up.

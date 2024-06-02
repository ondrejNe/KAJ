# Scheduling Rules Visualizer

## Running
Please use the live server for the Visual Studio Code to run the project _index.html_. Or use the 
WebStorm IDE to run the project _index.html_.

---

## Domain Scope

The 'Scheduling rules' is a complex DAG (Directed Acyclic Graph) structure in the base form composed
of the 'Calculation nodes' and 'Calculation rules'. Each edge represents a mathematical operation
performed on the input literals. The results of these operations are stored in the nodes. The final
nodes at the end of the graph (or some along the way) are marked as 'scheduling nodes'. They are meant
for further processing in much greater system.

In reality this structure can for example represent the complex relationships between the business
partners in no particular environment that need to track and calculate various positions that are
moved between their accounts. These positions must be processed in a specific oder and can be 
decorated with various attributes and modifiers.

---

## Motivation

In my job we are migrating an old system based on the relational database schemes into a new version. 
The 'Scheduling rules' are stored in a big number of tables with hundreds of records. It is 
quite challenging to traverse through graph structure made by the 'Calculation nodes' (graph 
vertices) and 'Calculation rules' (graph edges).

Any change in the 'Scheduling rules' requires an enormous effort and time spent on the relationship
tracing. Fortunately, the whole structure can be exported into a JSON file. However, this JSON file
consists of roughly thousands of relationships and hundreds of nodes. In addition, the vertices and
edges are time-bound with validity periods.

Till now, we lacked any tool that would be even remotely capable of visualizing or rather traversing
the graph structure. The only way to do it was to use the SQL queries and the database schema. This
was a very time-consuming and error-prone process.

This is still an error-prone process, but at least we have a tool that can help us to visualize the 
relationships.

---

## Features

- Working with the Domain Data model through the JSON file
  - IO operations - Load/Save/Update
  - Local storage of the underlying data model
- Filtering of the received data on various attributes
  - Regex filtering of the node names and subsequent filtering of the adjacent edges
  - Filtering of the nodes and edges based on the validity period
- Visualization of the JSON
- Visualization of the graph structure
  - Graph lay outing
  - Graph rendering
  - Graph interaction
- Highlighting of the scheduling nodes
- Highlighting of the selected nodes

As of 2.6. there is still a lot of work to be done. The project is still in the development phase.

### Tree (The Good)
- Can be dragged around and zoomed in/out
- Scheduling nodes are highlighted
- Double-click on the node expands the children

### Graph (The Bad)
- Can be dragged around and zoomed in/out
- The more edges target the node, the bigger the radius

### JSON (The Ugly)
- The Ugly
- Yeah, just syntax highlighting (80/20 - 80% of the time spent on the highlights :D)

---

## Structure

```sh
tree -d -I 'api-demo|node_modules' . 
.
├── api-demo            # I am quite new to the Web development, so I have tried multiple API integrations to choose from
├── data-demo           # Example JSON data model for loading into the application
├── public              # Contains the index.html file
└── src
    ├── api             # Various API feature integrations
    ├── components      # DOM custom components (sadly no React :D)
    ├── fonts           # Garet font is the preferred stylization of company projects
    ├── images          # favicon
    ├── model           # Data model definition and manipulation
    │   └── api         # API for model manipulation and handling
    ├── styles          # CSS styles
    │   └── additions   # Uniform style variables for referencing (the naming is unfortunate)
    └── util            # Utility functions
```

The most important files to understand the project are:
```shell
.
├── data-demo                   # Example JSON data model for loading into the application
├── public
│   └── index.html              # Main HTML file, please run me         
└── src
    ├── api
    │   └── d3.*.js             # D3.js library for graph rendering, quite a lot of work, but it is worth it
    │── App.js                  # Main application component, UI rendering, state changes, event bindings      
    └── model
        └── ModelController.js  # Model controller, data model transformation, inherits from ModelState.js data model manipulation
        └── ScheduligRules.js   # Data model definition
        └── api
            └── ModelState.js   # API for model manipulation and handling
```

## Future extension

- Addition of the edges and their attributes to the graph visualization (currently only relationship is shown)
- Improvements of traversing, filtering and graph layering
- Connection directly to the API endpoint that would supplement the JSON inputs
  - Kotlin backend with the Spring Boot framework and Azure SQL database
- Improvements in the filtering options for inclusion of multiple specific nodes
- More in-depth statistics and analysis of the graph structure and node/edge attributes
- Ability to modify and export changes into the graph structure
  - Addition, removal, time-validity updates, exports validations etc...
- Mobile devices support (dunno, maybe, if there is a need for it)
- History API (back/forward buttons)
- Small control panels for the graph manipulation
- Graph SVG dynamic resizing based on the zooming (if the data is denser the graph should adjust the distances)
- Video/audio (dunno, maybe, if there is a need for it)

---

## Fin

        //
        // d3sparql.js - utilities for visualizing SPARQL results with the D3 library
        //
        //   Web site: http://github.com/ktym/d3sparql/
        //   Copyright: 2013-2015 (C) Toshiaki Katayama (ktym@dbcls.jp)
        //   License: BSD license (same as D3.js)
        //   Initial version: 2013-01-28
        //


        ///TODO: This file is just copy of the released lib which is not complete by itself. should be clear more

        var d3sparql = {
          version: "d3sparql.js version 2015-11-19",
          debug: false // set to true for showing debug information
        }


        d3sparql.query = function (endpoint, sparql, callback) {
          var currentPathString = "";
          if (d3sparql.debug) {
            console.log(endpoint)
          }
          if (d3sparql.debug) {
            console.log(url)
          }

          if (document.URL.includes("analytics") || document.URL.includes("visualization")) {
            // $("#coverScreen").show();


            // // query to find all the named graphs in SPARQL-endpoint
            // var allNamedGraphsQuery = 'SELECT DISTINCT ?g ' +
            //   'WHERE {' +
            //   '  GRAPH ?g { ?s ?p ?o }' +
            //   '}';
            // var url = "http://localhost:3030/dataset/sparql"
            // var endpoint = url + "?query="
             if (document.URL.includes("analytics"))
              currentPathString = "analytics"
            else
              currentPathString = "visualization"

            // var branchName = document.URL.substring(document.URL.lastIndexOf('/') + 1);
            // var instaceName = document.URL.split('/' + branchName)[0].substring(document.URL.split('/' + branchName)[0].lastIndexOf('/') + 1);
            // $.ajax({
            //   type: 'POST',
            //   url: './sparqlServer/query',
            //   data: {
            //     query: allNamedGraphsQuery
            //   },
              //url: endpoint + allNamedGraphsQuery,
              // headers: {
              //   Accept: 'application/sparql-results+json;charset=UTF-8'
              // },
             // success: function (data, response, jqXHR) {
                // var list = [],
                //   namedGraphsString4Qurery = [];
                // // Show the HTML for the Google homepage.
                // if (data != null) {
                //   var graphs = JSON.parse(data).results.bindings;

                //   //console.log(graphs);
                //   if (graphs[0] != null) {
                //     for (var i = 0; i < graphs.length; i++) {
                //       if (graphs[i]["g"].value.includes(instaceName) && graphs[i]["g"].value.includes(branchName))
                //         {
                //           namedGraphsString4Qurery.push(graphs[i]["g"].value);
                //         }
                //     }
                //     console.log("namedGraphsString4Qurery");

                //     console.log(namedGraphsString4Qurery);
                //     console.log(sparql);

                    
                    // var xhr = d3.xhr(url)
                    //   .header("Content-Type", "application/x-www-form-urlencoded");
                    // //  .header("Content-Type", "application/sparql-results+json");

                    // xhr.post("query=" + encodeURIComponent(sparql) + "&default-graph-uri=" + namedGraphsString4Qurery,
                    //   function (error, result) {
                    //     if (error)
                    //       throw new Error(error);
                    //     var json = result.responseText
                    //     if (d3sparql.debug) {
                    //       console.log(json);
                    //     }
                    //     $("#coverScreen").hide();
                    //     callback(JSON.parse(json))
                    //   });
                    // let currQuery = {}
                    // if (namedGraphsString4Qurery.length > 0)
                      var currQuery = {
                        'query': encodeURIComponent(sparql),
                        // 'default-graph-uri': namedGraphsString4Qurery
                      }
                    // else
                    //    currQuery = {
                    //     'query': encodeURIComponent(sparql)
                    //   }

                    $.ajax({
                      type: 'POST',
                      data: currQuery,
                      //url: endpoint + "sparql?query=" + encodeURIComponent(instancesDetailsQuery),
                      url: './sparqlServer/query',
                      // headers: {
                      //   Accept: 'application/sparql-results+json;charset=UTF-8'
                      // },
                      success: function (data) {
                        if (data) {
                          //var json = result.responseText
                          var json = data
                          if (d3sparql.debug) {
                            console.log(json);
                          }
                          $("#coverScreen").hide();
                          console.log('json from inside callback')
                          console.log(json)

                          callback(JSON.parse(json))
                        }
                      },
                      error: function (xhr, textStatus, errorThrown) {
                        throw new Error(error);
                      }
                    });
              //     }
              //   } else {
              //     // console.log(response)
              //     console.warn(response);
              //   }
              // }
           // });
          } else {
            currentPathString = "documentation"
            //TODO: think to change to relative url
            //var url = document.URL.split(currentPathString)[0] + 'fuseki/dataset/sparql' + "?query=" +
            //encodeURIComponent(sparql) + '&output=json';
            // var url = "http://localhost:3030/dataset/sparql" + "?query=" +
            //   encodeURIComponent(sparql) + '&output=json';

            // var mime = "application/sparql-results+json"
            // d3.xhr(url, mime, function (request) {
            //   //console.log(request)
            //   var json = request.responseText
            //   if (d3sparql.debug) {
            //     console.log(json);
            //   }
            //   console.log();
            //   callback(JSON.parse(json))
            // })

            $.ajax({
              type: 'POST',
              data: {
                query: encodeURIComponent(sparql)
              },
              //url: endpoint + "sparql?query=" + encodeURIComponent(instancesDetailsQuery),
              url: './sparqlServer/query',
              // headers: {
              //   Accept: 'application/sparql-results+json;charset=UTF-8'
              // },
              success: function (data) {
                if (data) {
                  //var json = result.responseText
                  var json = data
                  if (d3sparql.debug) {
                    console.log(json);
                  }
                  $("#coverScreen").hide();
                  callback(JSON.parse(json))
                }
              },
              error: function (xhr, textStatus, errorThrown) {
                throw new Error(error);
              }
            });




          }



        }


        d3sparql.graph = function (json, config) {
          config = config || {}

          var head = json.head.vars
          var data = json.results.bindings

          var opts = {
            "key1": config.key1 || head[0] || "key1",
            "key2": config.key2 || head[1] || "key2",
            "label1": config.label1 || head[2] || false,
            "label2": config.label2 || head[3] || false,
            "value1": config.value1 || head[4] || false,
            "value2": config.value2 || head[5] || false,
          }
          var graph = {
            "nodes": [],
            "links": []
          }
          var check = d3.map()
          var index = 0
          for (var i = 0; i < data.length; i++) {
            var key1 = data[i][opts.key1].value
            var key2 = data[i][opts.key2].value
            var label1 = opts.label1 ? data[i][opts.label1].value : key1
            var label2 = opts.label2 ? data[i][opts.label2].value : key2
            var value1 = opts.value1 ? data[i][opts.value1].value : false
            var value2 = opts.value2 ? data[i][opts.value2].value : false
            if (!check.has(key1)) {
              graph.nodes.push({
                "key": key1,
                "label": label1,
                "value": value1
              })
              check.set(key1, index)
              index++
            }
            if (!check.has(key2)) {
              graph.nodes.push({
                "key": key2,
                "label": label2,
                "value": value2
              })
              check.set(key2, index)
              index++
            }
            graph.links.push({
              "source": check.get(key1),
              "target": check.get(key2)
            })
          }
          if (d3sparql.debug) {
            console.log(JSON.stringify(graph))
          }
          return graph
        }


        //Tree
        d3sparql.tree = function (json, config) {
          config = config || {}
          var head = json.head.vars;
          var data = json.results.bindings;
          var hash_nodes = {};

          //var nodes_hash = []; //?
          //var lastId = 0; //?

          var opts = {
            "root": config.root || head[0],
            "parent": config.parent || head[1],
            "child": config.child || head[2],
            "value": config.value || head[3] || "value",
          }

          var dummy_root = {
            "name": "Thing",
            "children": []
          } // not sure about adding id for search

          function look_for_position(name, children) {
            if (children) {
              for (var i = 0; i < children.length; i++) {
                if (children[i].name == name) {
                  return i;
                }
              }
            }
            return -1;
          }

          function merge_node(children, node, adding_value, type, level) {
            var ch = children;
            var ch_index = look_for_position(adding_value, ch);
            var initial_level = level;
            if (ch_index != -1) {
              if (type == "root") {
                level++;
                add_to_tree(children[ch_index], node, "parent", level); //add parent and child to ch_index
                return level;
              }
              if (type == "parent") {
                level++;
                add_to_tree(children[ch_index], node, "child", level); //add parent and child to ch_index
                return level;
              }
            } else if (ch) {
              for (var i = 0; i < ch.length; i++) { //If couldn't find in children, look between descendants
                if (merge_node(ch[i].children, node, adding_value, type, level) !=
                  initial_level) {
                  return level;
                }
              }
            }
            return level;
          }

          function prune_node(node) {
            var node_parent = hash_nodes[node.name];
            var index = look_for_position(node.name, node_parent.children);
            if (index != -1) {
              node_parent.children = node_parent.children.splice(index, 1);
            }
          }

          function add_to_tree(tree, node, type = "root", level) {

            var root = node[config.root];
            var parent = node[config.parent];
            var child = node[config.child];
            var children = tree.children;
            var adding_value = "";
            var initial_level = level;

            if (type == "root") {
              if (root.value != parent.value)
                adding_value = root.value;
              else
                type = "parent";
            }
            if (type == "parent") {
              if (parent.value != child.value)
                adding_value = parent.value;
              else
                type = "child";
            }
            if (type == "child") {
              adding_value = child.value;
            }

            //Check if there is a child which has the same name with adding node between children and descendants
            var new_level = merge_node(children, node, adding_value, type, level);

            if (new_level == initial_level) {
              //add root, parent or child as new entries.
              var new_node = true;
              var new_child = {
                "name": child.value
              };
              var new_parent = {
                "name": parent.value,
                "children": [new_child]
              };
              var new_root = {
                "name": root.value,
                "children": [new_parent]
              };
              switch (type) {
                case "child":
                  new_node = new_child;
                  break;
                case "parent":
                  new_node = new_parent;
                  break;
                case "root":
                  new_node = new_root;
              }

              //if (hash_nodes.hasOwnProperty(new_node.name)) {
              //prune_node(new_node);
              //}
              //hash_nodes[new_node.name] = tree;

              if (tree.hasOwnProperty('children')) {
                tree.children.push(new_node);
              } else {
                tree["children"] = [new_node];
              }
            }
          }

          for (var index = 0; index < data.length; index++) {
            add_to_tree(dummy_root, data[index], "root", 0);
          }

          return dummy_root;
        }


        //HTML Table
        d3sparql.htmltable = function (json, config) {
          config = config || {}

          var head = json.head.vars
          var data = json.results.bindings

          var opts = {
            "selector": config.selector || null
          }

          var table = d3sparql.select(opts.selector, "htmltable").append("table").attr(
            "class", "table table-bordered")
          var thead = table.append("thead")

          var tbody = table.append("tbody")
          thead.append("tr")
            .selectAll("th")
            .data(head)
            .enter()
            .append("th")
            .text(function (col) {
              return col
            })
          var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr")
          var cells = rows.selectAll("td")
            .data(function (row) {
              return head.map(function (col) {
                return row[col].value
              })
            })
            .enter()
            .append("td")
            .text(function (val) {
              return val
            })

          // default CSS
          table.style({
            "margin": "10px"
          })
          table.selectAll("th").style({
            "background": "#eeeeee",
            "text-transform": "capitalize",
          })
        }


        //Html Hash
        d3sparql.htmlhash = function (json, config) {
          config = config || {}

          var head = json.head.vars
          var data = json.results.bindings[0]
          var opts = {
            "selector": config.selector || null
          }

          var table = d3sparql.select(opts.selector, "htmlhash").append("table").attr(
            "class", "table table-bordered")
          var tbody = table.append("tbody")
          var row = tbody.selectAll("tr")
            .data(function () {
              return head.map(function (col) {
                return {
                  "head": col,
                  "data": data[col].value
                }
              })
            })
            .enter()
            .append("tr")
          row.append("th")
            .text(function (d) {
              return d.head
            })
          row.append("td")
            .text(function (d) {
              return d.data
            })

          // default CSS
          table.style({
            "margin": "10px"
          })
          table.selectAll("th").style({
            "background": "#eeeeee",
            "text-transform": "capitalize",
          })
        }


        //Bar chart
        d3sparql.barchart = function (json, config) {
          config = config || {}

          var labelData = [];
          var barData = [];
          var graphColors = [];
          var graphOutlines = [];
          var hoverColor = [];

          if (json) {
            json = json.results.bindings;
            json.forEach(function (o) {
              labelData.push(o.conceptType.value);
              barData.push(o.value.value);
            })
          }

          var i = 0;
          while (i <= barData.length) {
            var randomR = Math.floor((Math.random() * 130) + 100);
            var randomG = Math.floor((Math.random() * 130) + 100);
            var randomB = Math.floor((Math.random() * 130) + 100);
            var graphBackground = "rgb(" + randomR + ", " + randomG + ", " + randomB +
              ")";
            graphColors.push(graphBackground);
            var graphOutline = "rgb(" + (randomR - 80) + ", " + (randomG - 80) + ", " +
              (randomB - 80) + ")";
            graphOutlines.push(graphOutline);
            var hoverColors = "rgb(" + (randomR + 25) + ", " + (randomG + 25) + ", " +
              (randomB + 25) + ")";
            hoverColor.push(hoverColors);
            i++;
          };


          $("#result").hide();
          $("#myChartPieDiv").hide();
          $("#myChartBarDiv").show();

          var ctx = document.getElementById("myChartBar").getContext('2d');
          var configChart = {
            type: 'bar',
            data: {
              labels: labelData,
              datasets: [{
                label: 'label',
                data: barData,
                backgroundColor: graphColors,
                hoverBackgroundColor: hoverColor,
                borderColor: graphOutlines,
              }]
            },
            options: {
              maintainAspectRatio: false,
              legend: {
                display: false,
              },
              tooltips: {
                mode: 'index',
                intersect: false,
              },
              scales: {
                yAxes: [{
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: 'Number',
                    fontColor: 'black'

                  },
                }],
                xAxes: [{
                  type: 'category',
                  display: true,
                  gridLines: {
                    display: false,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Type',
                    fontColor: 'black'
                  },
                  ticks: {
                    maxRotation: 0,
                  }
                }]
              },
            }
          }

          var myChart = new Chart(ctx, configChart);
        }


        d3sparql.piechart = function (json, config) {
          config = config || {}
          var labelData = [];
          var pieData = [];
          var backgroundColorPie = [];
          $("#result").hide();
          $("#myChartBarDiv").hide();
          $("#myChartPieDiv").show();
          if (json) {
            json = json.results.bindings;
            json.forEach(function (o) {
              labelData.push(o.conceptType.value);
              pieData.push(o.value.value);
            })
          }

          // random color for pie
          function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }
          var k = 0;
          while (k <= pieData.length) {
            backgroundColorPie.push(getRandomColor());
            k++;
          };
          new Chart(document.getElementById("myChartPie"), {
            type: 'doughnut',
            data: {
              labels: labelData,
              datasets: [{
                backgroundColor: backgroundColorPie,
                data: pieData,
                borderWidth: 0,
              }]
            },
            options: {
              segmentShowStroke: false
            }
          });

        }


        //Scatterplot
        d3sparql.scatterplot = function (json, config) {
          config = config || {}

          var head = json.head.vars
          var data = json.results.bindings

          var opts = {
            "label_x": config.label_x || head[0],
            "label_y": config.label_y || head[1],
            "var_x": config.var_x || head[0],
            "var_y": config.var_y || head[1],
            "var_r": config.var_r || head[2] || 5,
            "min_r": config.min_r || 1,
            "max_r": config.max_r || 20,
            "width": config.width || 850,
            "height": config.height || 300,
            "margin_x": config.margin_x || 80,
            "margin_y": config.margin_y || 40,
            "selector": config.selector || null
          }

          var extent_x = d3.extent(data, function (d) {
            return parseInt(d[opts.var_x].value)
          })
          var extent_y = d3.extent(data, function (d) {
            return parseInt(d[opts.var_y].value)
          })
          var extent_r = d3.extent(data, function (d) {
            return parseInt(d[opts.var_r].value)
          })
          var scale_x = d3.scale.linear().range([opts.margin_x, opts.width -
              opts.margin_x
            ])
            .domain(extent_x)
          var scale_y = d3.scale.linear().range([opts.height - opts.margin_y,
              opts.margin_y
            ])
            .domain(extent_y)
          var scale_r = d3.scale.linear().range([opts.min_r, opts.max_r]).domain(
            extent_r)
          var axis_x = d3.svg.axis().scale(scale_x)
          var axis_y = d3.svg.axis().scale(scale_y).orient("left")

          var svg = d3sparql.select(opts.selector, "scatterplot").append(
              "svg")
            .attr("width", opts.width)
            .attr("height", opts.height)
          var circle = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("cx", function (d) {
              return scale_x(d[opts.var_x].value)
            })
            .attr("cy", function (d) {
              return scale_y(d[opts.var_y].value)
            })
            .attr("r", function (d) {
              return scale_r(d[opts.var_r].value)
            })
          var ax = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (opts.height - opts.margin_y) +
              ")")
            .call(axis_x)
          var ay = svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + opts.margin_x + ",0)")
            .call(axis_y)
          ax.append("text")
            .attr("class", "label")
            .text(opts.label_x)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + ((opts.width - opts.margin_x) /
                2) +
              "," + (opts.margin_y - 5) + ")")
          ay.append("text")
            .attr("class", "label")
            .text(opts.label_y)
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (opts.height / 2))
            .attr("y", 0 - (opts.margin_x - 20))

          // default CSS/SVG
          ax.attr({
            "stroke": "black",
            "fill": "none",
          })
          ay.attr({
            "stroke": "black",
            "fill": "none",
          })
          circle.attr({
            "stroke": "gray",
            "stroke-width": "1px",
            "fill": "lightblue",
            "opacity": 0.5,
          })
          //svg.selectAll(".label")
          svg.selectAll("text").attr({
            "stroke": "none",
            "fill": "black",
            "font-size": "8pt",
            "font-family": "sans-serif",
          })
        }


        //Force graph
        d3sparql.forcegraph = function (json, config) {
          var graph = createGraph(json);
          console.log("This json data")
          console.log(json)

          //var neighbors = {}; // Key = vertex, value = array of neighbors.
          $("#myChartBarDiv").hide();
          $("#myChartPieDiv").hide();
          $("#result").show();
          $("#result").empty();
          showGraph(graph.nodes, graph.edges, 'result');

          //bfs(neighborsSet, 56);
          //  var path = shortestPath(19, 17);
          //  var graphPath = pathToGraph(path, graph);
          //  showGraph(graphPath.nodes, graphPath.edges, 'shortest-path');

          // Get the word after hash char of a string
          function trimHash(str) {
            if (str.includes("#")) {
              var n = str.split('#');;
              var p = n[n.length - 1];
              return p;
            } else {
              return str;
            }
          }

          // Get the word after slash char of a string
          function trimSlash(str) {
            if (str.includes("/")) {
              var n = str.split("/").pop(-1);;
              return n;
            } else {
              return str;
            }
          }

          // Customization of the RDF type to show as in standards
          function replaceWithRDFType(str) {
            if (str.includes("22-rdf-syntax-ns")) {
              return "rdf:" + trimHash(str);
            } else if (str.includes('rdf-schema'))
              return "rdfs:" + trimHash(str);
            else if (str.includes('owl'))
              return "owl:" + trimHash(str);
            else if (str.includes('core#Concept') || str.includes(
                'narrower') || str.includes(
                'broader'))
              return "skos:" + trimHash(str);
            else
              return str;
          }

          function makeNodeLabel(node) {
            var nodeLabel = "";
            var key2 = node.value;
            var key3 = "";
            if (node.hasOwnProperty("xml:lang"))
              key3 = node['xml:lang'];
            var key4 = node['type'];

            if ((key2.includes("http://") || key2.includes("https://")) &&
              key4 ===
              "literal") {
              if (key2[key2.length - 1] === ('/'))
                key2 = key2.slice(0, -1);
              key2 = '<a href=' + key2 + '>' + key2 + '</a>';
            } else {
              if (key2[key2.length - 1] === ('/'))
                key2 = key2.slice(0, -1);
              key2 = trimHash(replaceWithRDFType(trimSlash(key2)));
            }

            if (key3) {
              nodeLabel = key2 + "@" + key3;
            } else {
              nodeLabel = key2;
            }
            return nodeLabel;
          }

          function createGraph(data) {
            var nodes = [];
            var edges = [];
            var lastId = 0;
            var edgesId = {};

            for (var i = 0; i < data['results']['bindings'].length; i++) {
              //Edge labels:
              var key1 = trimHash(replaceWithRDFType(trimSlash(data[
                'results'][
                'bindings'
              ][i]['predicate'].value)));
              var subjectId = 0;
              var objectId = 0;
              var subjectLabel = makeNodeLabel(data['results']['bindings'][
                i
              ][
                'subject'
              ]);
              var objectLabel = makeNodeLabel(data['results']['bindings'][i][
                'object'
              ]);
              var subjectFlag = false;
              var objectFlag = false;

              //Check if the node is added in nodes before.
              for (var j = 0; j < nodes.length; j++) { //TODO: It takes much time
                if (subjectLabel === nodes[j]['label']) {
                  subjectFlag = true;
                  subjectId = nodes[j]['id'];
                }
                if (objectLabel === nodes[j]['label']) {
                  objectFlag = true;
                  objectId = nodes[j]['id'];
                }
              }
              //Just push in the case it's not pushed before.
              if (!subjectFlag) {
                nodes.push({
                  id: ++lastId,
                  label: subjectLabel
                });
                subjectId = lastId;
              }
              if (!objectFlag) {
                nodes.push({
                  id: ++lastId,
                  label: objectLabel
                });
                objectId = lastId;
              }
              edges.push({
                from: subjectId,
                to: objectId,
                label: key1,
                font: {
                  color: 'green'
                }
              });
            }
            return {
              'nodes': nodes,
              'edges': edges,
              //'neighbors': neighbors
            };
          }

          function showGraph(nodes, edges, containerName) {
            // Preparing nodes and eddges to be shown.
            var sparqlNodes = new vis.DataSet();
            sparqlNodes.add(nodes);
            var sparqlEdges = new vis.DataSet();
            sparqlEdges.add(edges);

            // Provide the data in the vis format
            var graphData = {
              nodes: sparqlNodes,
              edges: sparqlEdges
            };

            // Layout of the graph and its container
            var options = {
              autoResize: false,
              height: '600px',
              width: '900px',
              nodes: {
                shape: 'dot',
                size: 20,
                color: {
                  border: '#2B7CE9',
                  background: '#97C2FC',
                  highlight: {
                    border: '#F2A3E9',
                    background: '#D2A9B6'
                  },
                  hover: {
                    border: '#2B7CE9',
                    background: '#D2E5FF'
                  }
                },
              },
              edges: {
                color: {
                  color: '#008000',
                  highlight: '#ADFF2F',
                  hover: '#228B22',
                  opacity: 1.0
                },
              },
              layout: {
                randomSeed: undefined,
                improvedLayout: false,
                hierarchical: {
                  enabled: false,
                  levelSeparation: 150,
                  nodeSpacing: 100,
                  treeSpacing: 200,
                  blockShifting: true,
                  edgeMinimization: true,
                  parentCentralization: true,
                  direction: 'RL', // UD, DU, LR, RL
                  sortMethod: 'hubsize' // hubsize, directed
                }
              },
              interaction: {
                navigationButtons: true,
                keyboard: true
              },
              physics: {
                enabled: true,
                barnesHut: {
                  gravitationalConstant: -2000,
                  centralGravity: 0.3,
                  springLength: 95,
                  springConstant: 0.04,
                  damping: 0.09,
                  avoidOverlap: 0
                },
                forceAtlas2Based: {
                  gravitationalConstant: -50,
                  centralGravity: 0.01,
                  springConstant: 0.08,
                  springLength: 100,
                  damping: 0.4,
                  avoidOverlap: 0
                },
                repulsion: {
                  centralGravity: 0.2,
                  springLength: 200,
                  springConstant: 0.05,
                  nodeDistance: 100,
                  damping: 0.09
                },
                hierarchicalRepulsion: {
                  centralGravity: 0.0,
                  springLength: 100,
                  springConstant: 0.01,
                  nodeDistance: 120,
                  damping: 0.09
                },
                maxVelocity: 50,
                minVelocity: 0.1,
                solver: 'barnesHut',
                adaptiveTimestep: true,
                barnesHut: {
                  gravitationalConstant: -8000,
                  springConstant: 0.04,
                  springLength: 95
                },
                stabilization: {
                  iterations: 987
                },
                stabilization: {
                  enabled: true,
                  iterations: 1000,
                  updateInterval: 100,
                  onlyDynamicEdges: false,
                  fit: true
                },
                timestep: 0.1,
                adaptiveTimestep: true
              }
            };

            // Make a container of network(graph)
            var container = document.getElementById(containerName);


            // Initialize your network!
            var network = new vis.Network(container, graphData, options);

            $("#result").height('600px').width('920px');

            network.fit();



            network.on("startStabilizing", function (params) {
              console.log("progress:", params);
            });

            network.on("stabilizationProgress", function (params) {
              $('.vis-network').addClass('ui');
              $('.vis-network').addClass('active');
              $('.vis-network').addClass('centered');
              $('.vis-network').addClass('inline');
              $('.vis-network').addClass('loader');
              console.log("progress:", params);
            });

            network.on("stabilizationIterationsDone", function (params) {
              $('.vis-network').removeClass('ui');
              $('.vis-network').removeClass('active');
              $('.vis-network').removeClass('centered');
              $('.vis-network').removeClass('inline');
              $('.vis-network').removeClass('loader');
              console.log("finished stabilization interations");
            });

            network.on("stabilized", function (params) {
              console.log("stabilized!", params);
            });


            // Enable dropdown selector for search a node on the graph.
            $('#select-entity').html("");
            $.each(nodes, function (index, value) {
              $('#select-entity').append($('<option/>', {
                value: nodes[index]['id'],
                text: nodes[index]['label']
              }));
            });

            sortSelect(document.getElementById('select-entity'));

            // Scale up a part of the graph(selected node) for search operation
            var focusOptions = {
              scale: 1,
              offset: {
                x: 0,
                y: 0
              },
              locked: true
            };

            // Show the change on selected node's layout.
            $('#select-entity').change(function () {
              var entityId = document.getElementById('select-entity').value;
              if (entityId != '') {
                changeLayout(entityId);
              }
            });

            // Apply changes of the layout of selected node.
            function changeLayout(id) {
              network.selectNodes([id], true)
              network.focus(id, focusOptions);
            }
          }

          function exploreGraph(s) {
            var edges = graph.edges;
            neighbors[s] = [];
            for (var i = 0; i < edges.length; i++) {
              var u = edges[i].from;
              var v = edges[i].to;
              if (u === s) {
                neighbors[s].push({
                  id: v,
                  edge: edges[i].label
                });
              }
            }
          }

          // Find bfs tree, not needed anymore.
          function bfs(neighbors, source) {
            var queue = [{
                vertex: source,
                count: 0
              }],
              visited = {
                source: true
              },
              tail = 0;
            while (tail < queue.length) {
              var u = queue[tail].vertex,
                count = queue[tail++].count; // Pop a vertex off the queue.
              console.log('distance from ' + source + ' to ' + u + ': ' +
                count);
              if (neighbors[u] != null) {
                for (var i = 0; i < neighbors[u].length; ++i) {
                  var v = neighbors[u][i].id;
                  if (!visited[v]) {
                    visited[v] = true;
                    queue.push({
                      vertex: v,
                      count: count + 1
                    });
                  }
                }
              }
            }
          }

          function shortestPath(source, target) {

            if (source == target) {
              return [{
                id: source,
                label: ''
              }];
            }

            var queue = [source],
              visited = {
                source: true
              },
              predecessor = {},
              tail = 0;

            while (tail < queue.length) {
              var u = queue[tail++], // Pop a vertex off the queue.
                preLabel = '';

              exploreGraph(u);

              for (var i = 0; i < neighbors[u].length; ++i) {
                var label = neighbors[u][i].edge;
                var v = neighbors[u][i].id;
                if (visited[v]) {
                  continue;
                }
                visited[v] = true;
                if (v === target) { // Check if the path is complete.
                  var path = [{
                    id: v,
                    label: label
                  }]; // If so, backtrack through the path.
                  while (u !== source) {
                    u = predecessor[u];
                    path.push(u);
                  }

                  path.push({
                    id: source,
                    label: ''
                  });
                  path.reverse();
                  console.log(path);

                  return path;
                }
                predecessor[v] = {
                  id: u,
                  label: preLabel
                };
                preLabel = label;
                queue.push(v);
              }
            }
            console.log('there is no path from ' + source + ' to ' + target);
          }

          // Retreive a graph network from path.
          function pathToGraph(path, graph) {
            var nodes = [],
              edges = [];
            if (path != null) {
              for (var i = 0; i < path.length; ++i) {
                nodes.push({
                  id: i + 1,
                  label: graph.nodes[(path[i].id) - 1].label
                });
                if (i != path.length - 1) {
                  edges.push({
                    from: i + 1,
                    to: i + 2,
                    label: path[i + 1].label,
                    font: {
                      color: 'blue'
                    }
                  });
                }
              }
            }

            return {
              'nodes': nodes,
              'edges': edges
            };
          }
        }


        //Sakey
        d3sparql.sankey = function (json, config) {
          config = config || {}

          var graph = (json.head && json.results) ? d3sparql.graph(json,
              config) :
            json

          var opts = {
            "width": config.width || 800,
            "height": config.height || 600,
            "margin": config.margin || 10,
            "selector": config.selector || null
          }

          var nodes = graph.nodes
          var links = graph.links
          for (var i = 0; i < links.length; i++) {
            links[i].value = 2 // TODO: fix to use values on links
          }
          var sankey = d3.sankey()
            .size([opts.width, opts.height])
            .nodeWidth(15)
            .nodePadding(10)
            .nodes(nodes)
            .links(links)
            .layout(32)
          var path = sankey.link()
          var color = d3.scale.category20()
          var svg = d3sparql.select(opts.selector, "sankey").append("svg")
            .attr("width", opts.width + opts.margin * 2)
            .attr("height", opts.height + opts.margin * 2)
            .append("g")
            .attr("transform", "translate(" + opts.margin + "," + opts.margin +
              ")")
          var link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", path)
            .attr("stroke-width", function (d) {
              return Math.max(1, d.dy)
            })
            .sort(function (a, b) {
              return b.dy - a.dy
            })
          var node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
              return "translate(" + d.x + "," + d.y + ")"
            })
            .call(d3.behavior.drag()
              .origin(function (d) {
                return d
              })
              .on("dragstart", function () {
                this.parentNode.appendChild(this)
              })
              .on("drag", dragmove)
            )
          node.append("rect")
            .attr("width", function (d) {
              return d.dx
            })
            .attr("height", function (d) {
              return d.dy
            })
            .attr("fill", function (d) {
              return color(d.label)
            })
            .attr("opacity", 0.5)
          node.append("text")
            .attr("x", -6)
            .attr("y", function (d) {
              return d.dy / 2
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) {
              return d.label
            })
            .filter(function (d) {
              return d.x < opts.width / 2
            })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start")

          // default CSS/SVG
          link.attr({
            "fill": "none",
            "stroke": "grey",
            "opacity": 0.5,
          })

          function dragmove(d) {
            d3.select(this).attr("transform", "translate(" + d.x + "," + (d
              .y = Math.max(
                0, Math.min(opts.height - d.dy, d3.event.y))) + ")")
            sankey.relayout()
            link.attr("d", path)
          }
        }


        //Round tree
        d3sparql.roundtree = function (json, config) {
          config = config || {}

          var tree = (json.head && json.results) ? d3sparql.tree(json,
            config) : json

          var opts = {
            "diameter": config.diameter || 800,
            "angle": config.angle || 360,
            "depth": config.depth || 200,
            "radius": config.radius || 5,
            "selector": config.selector || null
          }

          var tree_layout = d3.layout.tree()
            .size([opts.angle, opts.depth])
            .separation(function (a, b) {
              return (a.parent === b.parent ? 1 : 2) / a.depth
            })
          var nodes = tree_layout.nodes(tree)
          var links = tree_layout.links(nodes)
          var diagonal = d3.svg.diagonal.radial()
            .projection(function (d) {
              return [d.y, d.x / 180 * Math.PI]
            })
          var svg = d3sparql.select(opts.selector, "roundtree").append(
              "svg")
            .attr("width", opts.diameter)
            .attr("height", opts.diameter)
            .append("g")
            .attr("transform", "translate(" + opts.diameter / 2 + "," +
              opts.diameter /
              2 + ")")
          var link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", diagonal)
          var node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
              return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")"
            })
          var circle = node.append("circle")
            .attr("r", opts.radius)
          var text = node.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) {
              return d.x < 180 ? "start" : "end"
            })
            .attr("transform", function (d) {
              return d.x < 180 ? "translate(8)" :
                "rotate(180) translate(-8)"
            })
            .text(function (d) {
              return d.name
            })

          // default CSS/SVG
          link.attr({
            "fill": "none",
            "stroke": "#cccccc",
            "stroke-width": "1.5px",
          })
          circle.attr({
            "fill": "#ffffff",
            "stroke": "steelblue",
            "stroke-width": "1.5px",
            "opacity": 1,
          })
          text.attr({
            "font-size": "10px",
            "font-family": "sans-serif",
          })
        }


        //Dendrogram
        d3sparql.dendrogram = function (json, config) {

          var tree = d3sparql.tree(json, config);
          //console.log(tree);
          $("#myChartBarDiv").hide();
          $("#myChartPieDiv").hide();
          $("#result").show();
          // adjust zoomIn and zoomOut button on DendroGram
          document.getElementsByClassName('vis-zoomIn')[0].style.position = "inherit";
          document.getElementsByClassName('vis-zoomOut')[0].style.position = "inherit";
          dendShow(tree);

          function dendShow(treeData) {
            var margin = {
              top: 20,
              right: 220,
              bottom: 20,
              left: 220
            };

            var totalNodes = 0;
            var maxLabelLength = 0;
            // variables for drag/drop
            var selectedNode = null;
            var draggingNode = null;
            // panning variables
            var panSpeed = 200;
            var panBoundary = 20; // Within 20px from edges will pan when dragging.
            // Misc. variables
            var i = 0;
            var duration = 750;
            var root;
            var hash_nodes = {};
            var hash_ids = {};
            var selected_id = [];
            var treeLevel = 0;

            // size of the diagram
            var viewerWidth = 800 //$(document).width() * (2 / 3);
            var viewerHeight = 600 //$(document).height() * (2 / 3);

            var tree = d3.layout.tree()
              .size([viewerHeight, viewerWidth]);

            var treeHeight = viewerHeight;
            var treeWidth = viewerWidth;

            // define a d3 diagonal projection for use by the node paths later on.
            var diagonal = d3.svg.diagonal()
              .projection(function (d) {
                return [d.y, d.x];
              });

            // A recursive helper function for performing some setup by walking through all nodes
            function visit(parent, visitFn, childrenFn) {
              if (!parent) return;

              visitFn(parent);

              var children = childrenFn(parent);
              if (children) {
                var count = children.length;
                for (var i = 0; i < count; i++) {
                  visit(children[i], visitFn, childrenFn);
                }
              }
            }

            // Call visit function to establish maxLabelLength
            visit(treeData, function (d) {
              treeData.level = 0;
              totalNodes++;
              d.index = totalNodes;
              if (!(d.index in hash_nodes)) {
                hash_nodes[d.index] = d; //map each node with it's id
              }

              if (!(d.name in hash_ids)) {
                hash_ids[d.name] = [d.index]; //map each node's name with node's id
              } else {
                hash_ids[d.name].push(d.index);
              }

              maxLabelLength = Math.max(d.name.length, maxLabelLength);
            }, function (d) {
              if (d.children && d.children.length > 0) {
                for (var i = 0; i < d.children.length; i++) {
                  d.children[i].parent_id = d.index;
                  d.children[i].level = d.level + 1;
                }
                return d.children;
              } else {
                return null;
              }
            });

            // TODO: Pan function, can be better implemented.
            function pan(domNode, direction) {
              var speed = panSpeed;
              if (panTimer) {
                clearTimeout(panTimer);
                translateCoords = d3.transform(svgGroup.attr("transform"));
                if (direction == 'left' || direction == 'right') {
                  translateX = direction == 'left' ? translateCoords.translate[
                      0] +
                    speed : translateCoords.translate[0] - speed;
                  translateY = translateCoords.translate[1];
                } else if (direction == 'up' || direction == 'down') {
                  translateX = translateCoords.translate[0];
                  translateY = direction == 'up' ? translateCoords.translate[
                      1] +
                    speed : translateCoords.translate[1] - speed;
                }
                scaleX = translateCoords.scale[0];
                scaleY = translateCoords.scale[1];
                scale = zoomListener.scale();
                svgGroup.transition().attr("transform", "translate(" +
                  translateX +
                  "," + translateY + ")scale(" + scale + ")");
                d3.select(domNode).select('g.node').attr("transform",
                  "translate(" +
                  translateX + "," + translateY + ")");
                zoomListener.scale(zoomListener.scale());
                zoomListener.translate([translateX, translateY]);
                panTimer = setTimeout(function () {
                  pan(domNode, speed, direction);
                }, 50);
              }
            }

            // Define the zoom function for the zoomable tree
            var zoomListener = d3.behavior.zoom().scaleExtent([0.5, 1.5]).on(
              'zoom',
              zoomed);

            function zoomed() {
              svgGroup.attr("transform", "translate(" + zoomListener.translate() +
                ")scale(" + zoomListener.scale() + ")");
            }

            function interpolateZoom(translate, scale, center, zoomFlag) {
              var self = this;
              return d3.transition().duration().tween("zoom", function () {
                var iTranslate = d3.interpolate(zoomListener.translate(),
                    translate),
                  iScale = d3.interpolate(zoomListener.scale(), scale);

                if (zoomFlag) {
                  treeHeight *= 1 + (scale / 10);
                } else {
                  treeHeight *= 1 - (scale / 10);
                }
                tree = tree.size([treeHeight, treeWidth]);
                var svgTag = d3.select("#result svg");
                svgTag.attr("height", treeHeight + margin.top + margin.bottom); //TODO: make a flexibile size
                svgTag.attr("width", treeWidth + margin.right + margin.left)

                //svgTag[0][0].height.baseVal.value *= scale;
                //svgTag[0][0].width.baseVal.value *= scale;
                console.log(svgTag[0][0])
                return function (t) {
                  zoomListener
                    .scale(iScale(t))
                    .translate(iTranslate(t));
                  zoomed();
                };
              });
            }

            var direction = 1,
              in_out = false;
            $("#zoom_in").click(function () { //do something fired 5 times});
              in_out = true;
              direction = 1;
              console.log("zoomin");
            });
            $("#zoom_out").click(function () { //do something fired 5 times});
              in_out = false;
              direction = -1;
              console.log("zoomout");
            });

            function zoomOperator(node = root) {
              var clicked = d3.event.target,
                factor = 0.1,
                target_zoom = 1,
                center = [node.x0, node.y0],
                extent = zoomListener.scaleExtent(),
                translate = zoomListener.translate(),
                translate0 = [],
                l = [],
                view = {
                  x: translate[0],
                  y: translate[1],
                  k: zoomListener.scale(),
                };

              // var in_out = false;
              // d3.event.preventDefault();
              // if (this.id === 'zoom_in') {
              //   in_out = true;
              //   direction = 1;
              // }
              //  else if (this.id === 'zoom_out') {
              //   in_out = false;
              //   direction = -1;
              //   console.log("zoomout");
              // }



              target_zoom = zoomListener.scale() * (1 + factor * direction);

              if (target_zoom < extent[0] || target_zoom > extent[1]) {
                return false;
              }

              translate0 = [(center[0] - view.x) / view.k, (center[1] -
                  view.y) /
                view.k
              ];
              view.k = target_zoom;
              l = [translate0[0] * view.k + view.x, translate0[1] * view.k +
                view.y
              ];

              if (in_out) {
                view.x += center[0] - l[0] + 20;
              } else {
                view.x += center[0] - l[0] - 20;
              }

              view.y += center[1] - l[1];
              interpolateZoom([view.x, view.y], view.k, node, in_out);

              //TODO: not working well when zoom in and out
            }

            d3.selectAll('div.zoom').on('click', zoomOperator);

            function initiateDrag(d, domNode) {
              draggingNode = d;
              d3.select(domNode).select('.ghostCircle').attr(
                'pointer-events', 'none');
              d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
              d3.select(domNode).attr('class', 'node activeDrag');

              // if nodes has children, remove the links and nodes
              if (nodes.length > 1) {
                // remove link paths
                links = tree.links(nodes);
                nodePaths = svgGroup.selectAll("path.link")
                  .data(links, function (d) {
                    return d.target.id;
                  }).remove();
                // remove child nodes
                nodesExit = svgGroup.selectAll("g.node")
                  .data(nodes, function (d) {
                    return d.id;
                  }).filter(function (d, i) {
                    if (d.id == draggingNode.id) {
                      return false;
                    }
                    return true;
                  }).remove();
              }

              // remove parent link
              parentLink = tree.links(tree.nodes(draggingNode.parent));
              svgGroup.selectAll('path.link').filter(function (d, i) {
                if (d.target.id == draggingNode.id) {
                  return true;
                }
                return false;
              }).remove();

              dragStarted = null;
            }

            $("#result").empty();
            $("#result").height(viewerHeight).width(viewerWidth);

            // define the baseSvg, attaching a class for styling and the zoomListener
            baseSvg = d3.select("#result").append("svg")
              .attr("width", viewerWidth + margin.right + margin.left)
              .attr("height", viewerHeight + margin.top + margin.bottom)
              .append('g')
              .attr("transform", "translate(" + margin.left + "," + margin.top +
                ")")
              .attr("class", "overlay")
              .call(zoomListener);

            // Append a group which holds all nodes and which the zoom Listener can act upon.
            // Define the drag listeners for drag/drop behaviour of nodes.
            dragListener = d3.behavior.drag()
              .on("dragstart", function (d) {
                if (d == root) {
                  return;
                }
                dragStarted = true;
                nodes = tree.nodes(d);
                d3.event.sourceEvent.stopPropagation();
                // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
              })
              .on("drag", function (d) {
                if (d == root) {
                  return;
                }
                if (dragStarted) {
                  domNode = this;
                  initiateDrag(d, domNode);
                }

                // get coords of mouseEvent relative to svg container to allow for panning
                relCoords = d3.mouse($('svg').get(0));
                if (relCoords[0] < panBoundary) {
                  panTimer = true;
                  pan(this, 'left');
                } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                  panTimer = true;
                  pan(this, 'right');
                } else if (relCoords[1] < panBoundary) {
                  panTimer = true;
                  pan(this, 'up');
                } else if (relCoords[1] > ($('svg').height() -
                    panBoundary)) {
                  panTimer = true;
                  pan(this, 'down');
                } else {
                  try {
                    clearTimeout(panTimer);
                  } catch (e) {
                    console.log(e);
                  }
                }

                d.x0 += d3.event.dx;
                d.y0 += d3.event.dy;
                var node = d3.select(this);
                node.attr("transform", "translate(" + d.y0 + "," + d.x0 +
                  ")");
                updateTempConnector();
              }).on("dragend", function (d) {
                if (d == root) {
                  return;
                }
                domNode = this;
                if (selectedNode) {
                  // now remove the element from the parent, and insert it into the new elements children
                  var index = draggingNode.parent.children.indexOf(
                    draggingNode);
                  if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                  }
                  if (typeof selectedNode.children !== 'undefined' ||
                    typeof selectedNode
                    ._children !== 'undefined') {
                    if (typeof selectedNode.children !== 'undefined') {
                      selectedNode.children.push(draggingNode);
                    } else {
                      selectedNode._children.push(draggingNode);
                    }
                  } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                  }
                  // Make sure that the node being added to is expanded so user can see added node is correctly moved
                  expand(selectedNode);
                  endDrag();
                } else {
                  endDrag();
                }
              });

            function endDrag() {
              selectedNode = null;
              d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
              d3.select(domNode).attr('class', 'node');
              // now restore the mouseover event or we won't be able to drag a 2nd time
              d3.select(domNode).select('.ghostCircle').attr(
                'pointer-events', '');
              updateTempConnector();
              if (draggingNode !== null) {
                update(root);
                //centerNode(draggingNode);
                draggingNode = null;
              }
            }

            // Helper functions for collapsing and expanding nodes.
            function collapse(d) {
              if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
              }
            }

            function expand(d) {
              if (d._children) {
                d.children = d._children;
                d.children.forEach(expand);
                d._children = null;
              }
            }

            var overCircle = function (d) {
              selectedNode = d;
              updateTempConnector();
            };
            var outCircle = function (d) {
              selectedNode = null;
              updateTempConnector();
            };

            // Function to update the temporary connector indicating dragging affiliation
            var updateTempConnector = function () {
              var data = [];
              if (draggingNode !== null && selectedNode !== null) {
                // have to flip the source coordinates since we did this for the existing connectors on the original tree
                data = [{
                  source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                  },
                  target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                  }
                }];
              }
              var link = svgGroup.selectAll(".templink").data(data);

              link.enter().append("path")
                .attr("class", "templink")
                .attr("d", d3.svg.diagonal())
                .attr('pointer-events', 'none');

              link.attr("d", d3.svg.diagonal());

              link.exit().remove();
            };

            // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
            function centerNode(source) {
              scale = zoomListener.scale();
              x = -source.y0;
              y = -source.x0;
              x = x * scale + viewerWidth / 4;
              y = y * scale + viewerHeight / 3;
              d3.select('g').transition()
                .duration(duration)
                .attr("transform", "translate(" + x + "," + y + ")scale(" +
                  scale +
                  ")");
              zoomListener.scale(scale);
              zoomListener.translate();
            }

            // Toggle children function
            function toggleChildren(d) {
              if (d.children) {
                d._children = d.children;
                d.children = null;
              } else if (d._children) {
                d.children = d._children;
                d._children = null;
              }
              return d;
            }

            //Search the nodes with selected name.
            function searchNode(nodeName) {
              if (selected_id.length > 0) {
                for (var i = 0; i < selected_id.length; i++) {
                  hash_nodes[selected_id[i]].select = 0;
                }
                selected_id = [];
              }

              if (nodeName in hash_ids) {
                var found_nodes = hash_ids[nodeName];
                for (var i = 0; i < found_nodes.length; i++) {
                  focus(hash_nodes[found_nodes[i]]);
                }
              }
            }

            //Collapse parent of searched entity
            function collapseParent(d) {
              if (d.parent_id) {
                var parent = hash_nodes[d.parent_id];
                if (parent._children) {
                  collapseParent(parent);
                  parent.children = parent._children;
                  parent._children = null;
                }
                //collapseParent(parent);
              } else {
                return;
              }
            }

            //Focus on a specific node.
            function focus(d) {
              collapse(d);
              collapseParent(d);
              d.select = 1;
              selected_id.push(d.index);
              update(d);
            }

            // Toggle children on click.
            function click(d) {
              if (d3.event.defaultPrevented) return; // click suppressed
              d = toggleChildren(d);
              update(d);
            }

            function update(source, zoom_in = false, zoom_out = false) {
              // Compute the new height, function counts total children of root node and sets tree height accordingly.
              // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
              // This makes the layout more consistent.
              var levelWidth = [1]; // Number of tree levels.
              var childCount = function (level, n) {
                if (n.children && n.children.length > 0) {
                  if (levelWidth.length <= level + 1) levelWidth.push(0); //Represents the new node, which is added
                  //in its level in the case the level is biger than the last level of tree.

                  levelWidth[level + 1] += n.children.length; // Add #children of new node in its level.
                  n.children.forEach(function (d) {
                    childCount(level + 1, d);
                  });
                }
              };

              childCount(0, root);
              treeLevel = Math.max(source.level, treeLevel);

              var newHeight = treeHeight = d3.max(levelWidth) * 25; // 25 pixels per line
              var newWidth = treeWidth = (treeLevel + 1) * maxLabelLength *
                4;

              d3.select("#result svg")
                .attr("width", newWidth + margin.right + margin.left)
                .attr("height", newHeight + margin.top + margin.bottom);
              tree = tree.size([newHeight, newWidth]);

              // Compute the new tree layout.
              var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);
              // Set widths between levels based on maxLabelLength.
              nodes.forEach(function (d) {
                d.y = (d.depth * (maxLabelLength * 4));
              });

              // Update the nodes…
              var node = svgGroup.selectAll("g.node")
                .data(nodes, function (d) {
                  var ret_val = d.id || (d.id = ++i);
                  return ret_val;
                });

              // Enter any new nodes at the parent's previous position.
              var nodeEnter = node.enter().append("g")
                .call(dragListener)
                .attr("class", "node")
                .attr("transform", function (d) {
                  return "translate(" + (source.y0 || 0) + "," + (source.x0 ||
                      0) +
                    ")";
                })
                .on('click', click);

              nodeEnter.append("circle")
                .attr('class', 'nodeCircle')
                .attr("r", 0)
                .style("fill", function (d) {
                  return d._children ? "lightsteelblue" : "#fff";
                });

              nodeEnter.append("text")
                .attr("x", function (d) {
                  return d.children || d._children ? -10 : 10;
                })
                .attr("dy", ".35em")
                .attr('class', 'nodeText')
                .attr("text-anchor", function (d) {
                  return d.children || d._children ? "end" : "start";
                })
                .text(function (d) {
                  return d.name;
                })
                .style("fill-opacity", 0);

              // Update the text to reflect whether node has children or not.
              node.select('text')
                .attr("x", function (d) {
                  return d.children || d._children ? -10 : 10;
                })
                .attr("text-anchor", function (d) {
                  return d.children || d._children ? "end" : "start";
                })
                .style("font-size", function (d) {
                  return d.select == 1 ? 14 : 10;
                })
                .text(function (d) {
                  return d.name;
                });

              // Change the circle fill depending on whether it has children and is collapsed
              node.select("circle.nodeCircle")
                .attr("r", function (d) {
                  return d.select == 1 ? 8 : 4.5
                })
                .style("fill", function (d) {
                  if (d.select == 1) {
                    return "#DA3";
                  } else
                    return d._children ? "lightsteelblue" : "#fff";
                });

              // Transition nodes to their new position.
              var nodeUpdate = node.transition().duration(duration);
              nodeUpdate.attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
              });

              // Fade the text in
              nodeUpdate.select("text")
                .style("fill-opacity", 1);

              // Transition exiting nodes to the parent's new position.
              var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                  return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

              nodeExit.select("circle")
                .attr("r", 0);

              nodeExit.select("text")
                .style("fill-opacity", 0);

              // Update the links…
              var link = svgGroup.selectAll("path.link")
                .data(links, function (d) {
                  return d.target.id;
                });

              // Enter any new links at the parent's previous position.
              link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                  var o = {
                    x: source.x0 || 0,
                    y: source.y0 || 0
                  };
                  return diagonal({
                    source: o,
                    target: o
                  });
                });

              // Transition links to their new position.
              link.transition()
                .duration(duration)
                .attr("d", diagonal);

              // Transition exiting nodes to the parent's new position.
              link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                  var o = {
                    x: source.x,
                    y: source.y
                  };
                  return diagonal({
                    source: o,
                    target: o
                  });
                })
                .remove();

              // Stash the old positions for transition.
              nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
              });
            }

            svgGroup = baseSvg.append("g");

            // Define the root
            root = treeData;
            root.x0 = viewerHeight / 2;
            root.y0 = 0;

            // Layout the tree initially and center on the root node.
            root.children.forEach(collapse);
            update(root);


            // Fill in dropdown selector for search a node on the graph.
            $('#select-entity').html("");
            for (key in hash_ids) {
              $('#select-entity').append($('<option/>', {
                value: key,
                text: key
              }));
            }

            sortSelect(document.getElementById('select-entity'));

            // Show the change on selected node's layout.
            $('#select-entity').change(function () {
              var nodeName = document.getElementById('select-entity').value;
              if (nodeName != '') {
                searchNode(nodeName);
              }
            });
          }
        }

        function sortSelect(selElem) {
          var tmpAry = new Array();
          for (var i = 0; i < selElem.options.length; i++) {
            tmpAry[i] = new Array();
            tmpAry[i][0] = selElem.options[i].text;
            tmpAry[i][1] = selElem.options[i].value;
          }
          tmpAry.sort();
          tmpAry.splice(0, 0, ['choose entity', 'choose entity']);
          while (selElem.options.length > 0) {
            selElem.options[0] = null;
          }
          for (var i = 0; i < tmpAry.length; i++) {
            var op = new Option(tmpAry[i][0], tmpAry[i][1]);
            selElem.options[i] = op;
          }
          return;
        }


        //SunBurst
        d3sparql.sunburst = function (json, config) {
          config = config || {}

          var tree = (json.head && json.results) ? d3sparql.tree(json,
            config) : json

          var opts = {
            "width": config.width || 1000,
            "height": config.height || 900,
            "margin": config.margin || 150,
            "selector": config.selector || null
          }

          var radius = Math.min(opts.width, opts.height) / 2 - opts.margin
          var x = d3.scale.linear().range([0, 2 * Math.PI])
          var y = d3.scale.sqrt().range([0, radius])
          var color = d3.scale.category20()
          var svg = d3sparql.select(opts.selector, "sunburst").append("svg")
            .attr("width", opts.width)
            .attr("height", opts.height)
            .append("g")
            .attr("transform", "translate(" + opts.width / 2 + "," + opts.height /
              2 +
              ")");
          var arc = d3.svg.arc()
            .startAngle(function (d) {
              return Math.max(0, Math.min(2 * Math.PI, x(d.x)))
            })
            .endAngle(function (d) {
              return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)))
            })
            .innerRadius(function (d) {
              return Math.max(0, y(d.y))
            })
            .outerRadius(function (d) {
              return Math.max(0, y(d.y + d.dy))
            })
          var partition = d3.layout.partition()
            .value(function (d) {
              return d.value
            })
          var nodes = partition.nodes(tree)
          var path = svg.selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("class", "arc")
            .style("fill", function (d) {
              return color((d.children ? d : d.parent).name)
            })
            .on("click", click)
          var text = svg.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("transform", function (d) {
              var rotate = x(d.x + d.dx / 2) * 180 / Math.PI - 90
              return "rotate(" + rotate + ") translate(" + y(d.y) + ")"
            })
            .attr("dx", ".5em")
            .attr("dy", ".35em")
            .text(function (d) {
              return d.name
            })
            .on("click", click)

          // default CSS/SVG
          path.attr({
            "stroke": "#ffffff",
            "fill-rule": "evenodd",
          })
          text.attr({
            "font-size": "10px",
            "font-family": "sans-serif",
          })

          function click(d) {
            path.transition()
              .duration(750)
              .attrTween("d", arcTween(d))
            text.style("visibility", function (e) {
                // required for showing labels just before the transition when zooming back to the upper level
                return isParentOf(d, e) ? null : d3.select(this).style(
                  "visibility")
              })
              .transition()
              .duration(750)
              .attrTween("transform", function (d) {
                return function () {
                  var rotate = x(d.x + d.dx / 2) * 180 / Math.PI - 90
                  return "rotate(" + rotate + ") translate(" + y(d.y) +
                    ")"
                }
              })
              .each("end", function (e) {
                // required for hiding labels just after the transition when zooming down to the lower level
                d3.select(this).style("visibility", isParentOf(d, e) ?
                  null :
                  "hidden")
              })
          }

          function maxDepth(d) {
            return d.children ? Math.max.apply(Math, d.children.map(
                maxDepth)) : d.y +
              d.dy
          }

          function arcTween(d) {
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
              yd = d3.interpolate(y.domain(), [d.y, maxDepth(d)]),
              yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius])
            return function (d) {
              return function (t) {
                x.domain(xd(t))
                y.domain(yd(t)).range(yr(t))
                return arc(d)
              }
            }
          }

          function isParentOf(p, c) {
            if (p === c) return true
            if (p.children) {
              return p.children.some(function (d) {
                return isParentOf(d, c)
              })
            }
            return false
          }
        }


        //CirclePack
        d3sparql.circlepack = function (json, config) {
          config = config || {}

          var tree = (json.head && json.results) ? d3sparql.tree(json,
            config) : json

          var opts = {
            "width": config.width || 800,
            "height": config.height || 800,
            "diameter": config.diameter || 700,
            "selector": config.selector || null
          }

          var w = opts.width,
            h = opts.height,
            r = opts.diameter,
            x = d3.scale.linear().range([0, r]),
            y = d3.scale.linear().range([0, r])

          var pack = d3.layout.pack()
            .size([r, r])
            .value(function (d) {
              return d.value
            })

          var node = tree
          var nodes = pack.nodes(tree)

          var vis = d3sparql.select(opts.selector, "circlepack").append(
              "svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) /
              2 + ")")

          vis.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", function (d) {
              return d.children ? "parent" : "child"
            })
            .attr("cx", function (d) {
              return d.x
            })
            .attr("cy", function (d) {
              return d.y
            })
            .attr("r", function (d) {
              return d.r
            })
            /*
                // CSS: circle { ... }
                .attr("fill", function(d) { return d.children ? "#1f77b4" : "#cccccc" })
                .attr("fill-opacity", function(d) { return d.children ? ".1" : "1" })
                .attr("stroke", function(d) { return d.children ? "steelblue" : "#999999" })
                .attr("pointer-events", function(d) { return d.children ? "all" : "none" })
                .on("mouseover", function() { d3.select(this).attr("stroke", "#ff7f0e").attr("stroke-width", ".5px") })
                .on("mouseout", function() { d3.select(this).attr("stroke", "steelblue").attr("stroke-width", ".5px") })
            */
            .on("click", function (d) {
              return zoom(node === d ? tree : d)
            })

          vis.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("class", function (d) {
              return d.children ? "parent" : "child"
            })
            .attr("x", function (d) {
              return d.x
            })
            .attr("y", function (d) {
              return d.y
            })
            //    .attr("dy", ".35em")
            .style("opacity", function (d) {
              return d.r > 20 ? 1 : 0
            })
            .text(function (d) {
              return d.name
            })
            // rotate to avoid string collision
            //.attr("text-anchor", "middle")
            .attr("text-anchor", "start")
            .transition()
            .duration(1000)
            .attr("transform", function (d) {
              return "rotate(-30, " + d.x + ", " + d.y + ")"
            })

          d3.select(window).on("click", function () {
            zoom(tree)
          })

          function zoom(d, i) {
            var k = r / d.r / 2
            x.domain([d.x - d.r, d.x + d.r])
            y.domain([d.y - d.r, d.y + d.r])
            var t = vis.transition()
              .duration(d3.event.altKey ? 2000 : 500)
            t.selectAll("circle")
              .attr("cx", function (d) {
                return x(d.x)
              })
              .attr("cy", function (d) {
                return y(d.y)
              })
              .attr("r", function (d) {
                return k * d.r
              })
            t.selectAll("text")
              .attr("x", function (d) {
                return x(d.x)
              })
              .attr("y", function (d) {
                return y(d.y)
              })
              .style("opacity", function (d) {
                return k * d.r > 20 ? 1 : 0
              })
            d3.event.stopPropagation()
          }
        }


        //TreeMap
        d3sparql.treemap = function (json, config) {
          config = config || {}

          var tree = (json.head && json.results) ? d3sparql.tree(json,
            config) : json

          var opts = {
            "width": config.width || 800,
            "height": config.height || 500,
            "count": config.count || false,
            "color": config.color || d3.scale.category20c(),
            "margin": config.margin || {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            "selector": config.selector || null
          }

          var width = opts.width - opts.margin.left - opts.margin.right
          var height = opts.height - opts.margin.top - opts.margin.bottom
          var color = opts.color

          function count(d) {
            return 1
          }

          function size(d) {
            return d.value
          }

          var treemap = d3.layout.treemap()
            .size([width, height])
            .sticky(true)
            .value(opts.count ? count : size)

          var div = d3sparql.select(opts.selector, "treemap")
            .style("position", "relative")
            .style("width", opts.width + "px")
            .style("height", opts.height + "px")
            .style("left", opts.margin.left + "px")
            .style("top", opts.margin.top + "px")

          var node = div.datum(tree).selectAll(".node")
            .data(treemap.nodes)
            .enter()
            .append("div")
            .attr("class", "node")
            .call(position)
            .style("background", function (d) {
              return d.children ? color(d.name) : null
            })
            .text(function (d) {
              return d.children ? null : d.name
            })

          // default CSS/SVG
          node.style({
            "border-style": "solid",
            "border-width": "1px",
            "border-color": "white",
            "font-size": "10px",
            "font-family": "sans-serif",
            "line-height": "12px",
            "overflow": "hidden",
            "position": "absolute",
            "text-indent": "2px",
          })

          function position() {
            this.style("left", function (d) {
                return d.x + "px"
              })
              .style("top", function (d) {
                return d.y + "px"
              })
              .style("width", function (d) {
                return Math.max(0, d.dx - 1) + "px"
              })
              .style("height", function (d) {
                return Math.max(0, d.dy - 1) + "px"
              })
          }
        }


        //TreeMapZoom
        d3sparql.treemapzoom = function (json, config) {
          config = config || {}

          var tree = (json.head && json.results) ? d3sparql.tree(json,
            config) : json

          var opts = {
            "width": config.width || 800,
            "height": config.height || 500,
            "margin": config.margin || {
              top: 25,
              right: 0,
              bottom: 0,
              left: 0
            },
            "color": config.color || d3.scale.category20(),
            "format": config.format || d3.format(",d"),
            "selector": config.selector || null
          }

          var width = opts.width - opts.margin.left - opts.margin.right
          var height = opts.height - opts.margin.top - opts.margin.bottom
          var color = opts.color
          var format = opts.format
          var transitioning

          var x = d3.scale.linear().domain([0, width]).range([0, width])
          var y = d3.scale.linear().domain([0, height]).range([0, height])

          var treemap = d3.layout.treemap()
            .children(function (d, depth) {
              return depth ? null : d.children
            })
            .sort(function (a, b) {
              return a.value - b.value
            })
            .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
            .round(false)

          var svg = d3sparql.select(opts.selector, "treemapzoom").append(
              "svg")
            .attr("width", opts.width)
            .attr("height", opts.height)
            .style("margin-left", -opts.margin.left + "px")
            .style("margin.right", -opts.margin.right + "px")
            .append("g")
            .attr("transform", "translate(" + opts.margin.left + "," + opts
              .margin.top +
              ")")
            .style("shape-rendering", "crispEdges")

          var grandparent = svg.append("g")
            .attr("class", "grandparent")

          grandparent.append("rect")
            .attr("y", -opts.margin.top)
            .attr("width", width)
            .attr("height", opts.margin.top)
            .attr("fill", "#666666")

          grandparent.append("text")
            .attr("x", 6)
            .attr("y", 6 - opts.margin.top)
            .attr("dy", ".75em")
            .attr("stroke", "#ffffff")
            .attr("fill", "#ffffff")

          initialize(tree)
          layout(tree)
          display(tree)

          function initialize(tree) {
            tree.x = tree.y = 0
            tree.dx = width
            tree.dy = height
            tree.depth = 0
          }

          // Compute the treemap layout recursively such that each group of siblings
          // uses the same size (1×1) rather than the dimensions of the parent cell.
          // This optimizes the layout for the current zoom state. Note that a wrapper
          // object is created for the parent node for each group of siblings so that
          // the parent’s dimensions are not discarded as we recurse. Since each group
          // of sibling was laid out in 1×1, we must rescale to fit using absolute
          // coordinates. This lets us use a viewport to zoom.
          function layout(d) {
            if (d.children) {
              treemap.nodes({
                children: d.children
              })
              d.children.forEach(function (c) {
                c.x = d.x + c.x * d.dx
                c.y = d.y + c.y * d.dy
                c.dx *= d.dx
                c.dy *= d.dy
                c.parent = d
                layout(c)
              })
            }
          }

          function display(d) {
            grandparent
              .datum(d.parent)
              .on("click", transition)
              .select("text")
              .text(name(d))

            var g1 = svg.insert("g", ".grandparent")
              .datum(d)
              .attr("class", "depth")

            var g = g1.selectAll("g")
              .data(d.children)
              .enter()
              .append("g")

            g.filter(function (d) {
                return d.children
              })
              .classed("children", true)
              .on("click", transition)

            g.selectAll(".child")
              .data(function (d) {
                return d.children || [d]
              })
              .enter()
              .append("rect")
              .attr("class", "child")
              .call(rect)

            g.append("rect")
              .attr("class", "parent")
              .call(rect)
              .append("title")
              .text(function (d) {
                return format(d.value)
              })

            g.append("text")
              .attr("dy", ".75em")
              .text(function (d) {
                return d.name
              })
              .call(text)

            function transition(d) {
              if (transitioning || !d) return
              transitioning = true
              var g2 = display(d),
                t1 = g1.transition().duration(750),
                t2 = g2.transition().duration(750)

              // Update the domain only after entering new elements.
              x.domain([d.x, d.x + d.dx])
              y.domain([d.y, d.y + d.dy])

              // Enable anti-aliasing during the transition.
              svg.style("shape-rendering", null)

              // Draw child nodes on top of parent nodes.
              svg.selectAll(".depth").sort(function (a, b) {
                return a.depth - b.depth
              })

              // Fade-in entering text.
              g2.selectAll("text").style("fill-opacity", 0)

              // Transition to the new view.
              t1.selectAll("text").call(text).style("fill-opacity", 0)
              t2.selectAll("text").call(text).style("fill-opacity", 1)
              t1.selectAll("rect").call(rect)
              t2.selectAll("rect").call(rect)

              // Remove the old node when the transition is finished.
              t1.remove().each("end", function () {
                svg.style("shape-rendering", "crispEdges")
                transitioning = false
              })
            }
            return g
          }

          function text(text) {
            text.attr("x", function (d) {
                return x(d.x) + 6
              })
              .attr("y", function (d) {
                return y(d.y) + 6
              })
          }

          function rect(rect) {
            rect.attr("x", function (d) {
                return x(d.x)
              })
              .attr("y", function (d) {
                return y(d.y)
              })
              .attr("width", function (d) {
                return x(d.x + d.dx) - x(d.x)
              })
              .attr("height", function (d) {
                return y(d.y + d.dy) - y(d.y)
              })
              .attr("fill", function (d) {
                return color(d.name)
              })
            rect.attr({
              "stroke": "#ffffff",
              "stroke-width": "1px",
              "opacity": 0.8,
            })
          }

          function name(d) {
            return d.parent ?
              name(d.parent) + " / " + d.name :
              d.name
          }
        }


        //coordmap
        d3sparql.coordmap = function (json, config) {
          config = config || {}

          var head = json.head.vars
          var data = json.results.bindings

          var opts = {
            "var_lat": config.var_lat || head[0] || "lat",
            "var_lng": config.var_lng || head[1] || "lng",
            "width": config.width || 960,
            "height": config.height || 480,
            "radius": config.radius || 5,
            "color": config.color || "#FF3333",
            "topojson": config.topojson || "world-50m.json",
            "selector": config.selector || null
          }

          var projection = d3.geo.equirectangular()
            .scale(153)
            .translate([opts.width / 2, opts.height / 2])
            .precision(.1);
          var path = d3.geo.path()
            .projection(projection);
          var graticule = d3.geo.graticule();
          var svg = d3sparql.select(opts.selector, "coordmap").append("svg")
            .attr("width", opts.width)
            .attr("height", opts.height);

          svg.append("path")
            .datum(graticule.outline)
            .attr("fill", "#a4bac7")
            .attr("d", path);

          svg.append("path")
            .datum(graticule)
            .attr("fill", "none")
            .attr("stroke", "#333333")
            .attr("stroke-width", ".5px")
            .attr("stroke-opacity", ".5")
            .attr("d", path);

          d3.json(opts.topojson, function (error, world) {
            svg.insert("path", ".graticule")
              .datum(topojson.feature(world, world.objects.land))
              .attr("fill", "#d7c7ad")
              .attr("stroke", "#766951")
              .attr("d", path);

            svg.insert("path", ".graticule")
              .datum(topojson.mesh(world, world.objects.countries,
                function (a, b) {
                  return a !== b
                }))
              .attr("class", "boundary")
              .attr("fill", "none")
              .attr("stroke", "#a5967e")
              .attr("stroke-width", ".5px")
              .attr("d", path);

            svg.selectAll(".pin")
              .data(data)
              .enter().append("circle", ".pin")
              .attr("fill", opts.color)
              .attr("r", opts.radius)
              .attr("stroke", "#455346")
              .attr("transform", function (d) {
                return "translate(" + projection([
                  d[opts.var_lng].value,
                  d[opts.var_lat].value
                ]) + ")"
              });
          });
        }


        //namedmap
        d3sparql.namedmap = function (json, config) {
          config = config || {}

          var head = json.head.vars
          var data = json.results.bindings

          var opts = {
            "label": config.label || head[0] || "label",
            "value": config.value || head[1] || "value",
            "width": config.width || 1000,
            "height": config.height || 1000,
            "color_max": config.color_max || "red",
            "color_min": config.color_min || "white",
            "color_scale": config.color_scale || "log",
            "topojson": config.topojson || "japan.topojson",
            "mapname": config.mapname || "japan",
            "keyname": config.keyname || "name_local",
            "center_lat": config.center_lat || 34,
            "center_lng": config.center_lng || 137,
            "scale": config.scale || 10000,
            "selector": config.selector || null
          }

          var size = d3.nest()
            .key(function (d) {
              return d[opts.label].value
            })
            .rollup(function (d) {
              return d3.sum(d, function (d) {
                return parseInt(d[opts.value].value)
              })
            }).map(data, d3.map)
          var extent = d3.extent((d3.map(size).values()))

          if (d3sparql.debug) {
            console.log(JSON.stringify(size))
          }

          var svg = d3sparql.select(opts.selector, "namedmap").append("svg")
            .attr("width", opts.width)
            .attr("height", opts.height)

          d3.json(opts.topojson, function (topojson_map) {
            var geo = topojson.object(topojson_map, topojson_map.objects[
                opts.mapname])
              .geometries
            var projection = d3.geo.mercator()
              .center([opts.center_lng, opts.center_lat])
              .translate([opts.width / 2, opts.height / 2])
              .scale(opts.scale)
            var path = d3.geo.path().projection(projection)
            switch (opts.color_scale) {
              case "log":
                var scale = d3.scale.log()
                break
              default:
                var scale = d3.scale.linear()
                break
            }
            var color = scale.domain(extent).range([opts.color_min,
              opts.color_max
            ])

            svg.selectAll("path")
              .data(geo)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("stroke", "black")
              .attr("stroke-width", 0.5)
              .style("fill", function (d, i) {
                // map SPARQL results to colors
                return color(size[d.properties[opts.keyname]])
              })

            svg.selectAll(".place-label")
              .data(geo)
              .enter()
              .append("text")
              .attr("font-size", "8px")
              .attr("class", "place-label")
              .attr("transform", function (d) {
                var lat = d.properties.latitude
                var lng = d.properties.longitude
                return "translate(" + projection([lng, lat]) + ")"
              })
              .attr("dx", "-1.5em")
              .text(function (d) {
                return d.properties[opts.keyname]
              })
          })
        }

        d3sparql.select = function (selector, type) {
          if (selector) {
            return d3.select(selector).html("").append("div").attr("class",
              "d3sparql " + type)
          } else {
            return d3.select("body").append("div").attr("class",
              "d3sparql " + type)
          }
        }


        /* for IFRAME embed */
        d3sparql.frameheight = function (height) {
          d3.select(self.frameElement).style("height", height + "px")
        }

        /* for Node.js */
        //module.exports = d3sparql
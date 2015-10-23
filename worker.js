importScripts('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js', 'eb.js');
var window = window || {};

onmessage = function (e) {
    var data = e.data || {};
    var fbundling = d3.ForceEdgeBundling()
        .nodes(data.nodes || [])
        .edges(data.edges || [])
        .step_size(0.02)
        .iterations(30);
    var bundlingResults = fbundling();
    postMessage(bundlingResults);
    close();
}
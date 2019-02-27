// complete function that builds metadata panel
function buildMetadata(sample) {
  // use d3.json to fetch the metadata for a sample
  var metaData = `/metadata/${sample}`;
  //get the response, then do the function
  d3.json(metaData).then(function(response) {
    //use d3 to select the panel with id sample metadata
  var panelData = d3.select("#sample-metadata");
  // use .html("") to clear any existing metadata
  panelData.html("");
  // use object.entries to add each key and value pair to the panel
  var data = Object.entries(response);
  data.forEach(function(item) {
  panelData.append("div").text(item);
 });
 })}

function buildCharts(sample) {
  // use d3.json to fetch the sample data for the plots
  var sampleData = `/samples/${sample}`;
  // build a bubble chart using the sample data
  d3.json(sampleData).then(function(response){
    var bubbleOtuId = response.otu_ids;
    var bubbleOtuLabels = response.otu_labels;
    var bubbleSampleValues = response.sample_values;
    var bubbleTrace = {
      mode: 'markers',
      x: bubbleOtuId,
      y: bubbleSampleValues,
      text: bubbleOtuLabels,
      marker: {color: bubbleOtuIds, colorscale: 'Earth', size: bubbleSampleValues}
    };
    var bubbleData = [bubbleTrace];
    var layout = {
      showlegend: false,
      height: 600,
      width: 1500
      };
    Plotly.newPlot('bubble', bubbleData, layout);
// build pie - use slice to grab top ten sample values
  d3.json(sampleData).then(function(response){
    var topOtuIds = response.otu_ids.slice(0,10);
    var topOtuLabels = response.otu_labels.slice(0,10);
    var topSampleValues = response.sample_values.slice(0,10);
    var data = [{
      "labels": topOtuIds,
      "values": topSampleValues,
      "hovertext": topOtuLabels,
      "type": "pie"
    }];
  Plotly.newPlot('pie', data); 
  })
})
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize the dashboard

init();
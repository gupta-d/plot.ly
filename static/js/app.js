function buildMetadata(sample) {

  // following function builds the metadata panel

  // Using `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
d3.json("/metadata/" + sample).then((stuff) => {
console.log(stuff);
var thing = d3.select("#sample-metadata");
thing.html("");
var junk = Object.entries(stuff);
console.log(junk);
junk.forEach((metadatainfo) => {
  thing.append("h4")
  .text(metadatainfo[0] + ": " + metadatainfo[1])

});
});
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel

}

function buildCharts(sample) {
d3.json("/samples/" + sample).then((chartdata) =>{
  console.log(chartdata);
  var sampleValues = chartdata.sample_values
  var sampleLabels = chartdata.otu_ids
  var sample_otu_labels =chartdata.otu_labels
  var data = [{
  values: sampleValues.slice(0,10),
  labels: sampleLabels.slice(0,10),
  type: 'pie'
}];

var layout = {
  title: "Pie-Chart",
  height: 400,
  width: 500
};

Plotly.newPlot('pie', data, layout);




   // Building a Bubble Chart using the sample data
        trace1 = {
         x: sampleLabels,
         y: sampleValues,
         text: sample_otu_labels,
         mode: 'markers',
         type: 'scatter',

         marker: {
           size: sampleValues,
           color: sampleLabels,
         }
       };

         trace1 = [trace1];

         layout = {
           title: 'Bubble Chart',
           showlegend: false,
           height: 700,
           width: 1000
         }
         xaxis: {
            title: {
            text: 'otu_ids'
                    }
                };


       Plotly.newPlot("bubble", trace1, layout);

});
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

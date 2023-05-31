// Global Utility Variables
var data = {};

// Global HTML selectors
var inputSelector = d3.select("#selDataset");
var panelDemoInfo = d3.select("#sample-metadata");

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

// Populate the Demographic Info panel
function populateDemoInfo(idNum) {
  // Log a change
  console.log("Pop: " + idNum);

  // Just grab the one ID we want
  var metadataFilter = data.metadata.filter(item => item["id"] == idNum);
  console.log(`metaFilter length: ${metadataFilter.length}`);

  // Clear out the data first
  panelDemoInfo.html("");

  // Fill it back in
  Object.entries(metadataFilter[0]).forEach(([key, value]) => { var titleKey = titleCase(key); panelDemoInfo.append("h6").text(`${titleKey}: ${value}`) });
}

// Object Compare Function
function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }
    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

// Draw the bar plot
function drawBarPlot(idNum) {
  // Log a change
  console.log("Bar: " + idNum);

  // Just grab the one ID we want
  var samplesFilter = data.samples.filter(item => item["id"] == idNum);
  // console.log(`samplesFilter length: ${samplesFilter.length}`);

  // get values into arrays
  var sample_values = samplesFilter[0].sample_values;
  var otu_ids = samplesFilter[0].otu_ids;
  var otu_labels = samplesFilter[0].otu_labels;

  // Create an array of objects to sort so that all of the data is together
  var combinedList = [];
  for (var i = 0; i < sample_values.length; i++) {
    var otu_id = otu_ids[i];
    var otu_text = "OTU " + otu_id.toString();
    var combinedObject = { "sample_values": sample_values[i], "otu_ids": otu_text, "otu_labels": otu_labels[i] };
    combinedList.push(combinedObject);
  }

  // Sort and slice the list of objects
  var sortedList = combinedList.sort(compareValues("sample_values", "desc"));
  var slicedList = sortedList.slice(0, 10);

  // Grab the text into arrays with map now
  var sample_values_list = slicedList.map(item => item.sample_values).reverse();
  // console.log(`sample_values_list: ${sample_values_list}`);
  var otu_ids_list = slicedList.map(item => item.otu_ids).reverse();
  // console.log(`otu_ids_list: ${otu_ids_list}`);
  var otu_labels_list = slicedList.map(item => item.otu_labels).reverse();
  // console.log(`otu_labels_list: ${otu_labels_list}`);

  // Create the Trace
  var trace1 = {
    x: sample_values_list,
    y: otu_ids_list,
    text: otu_labels_list,
    type: "bar",
    orientation: "h"
  };

  // Create the data array for the plot
  var barData = [trace1];

  // Define the plot layout
  var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU ID" },
    margin: { t: 30, l: 150 }
  };

  // Plot the chart to a div tag with id "bar-plot"
  Plotly.newPlot("bar", barData, barLayout);
}

// Draw the bubble chart
function drawBubbleChart(idNum) {
  // Log a change
  console.log("Bubble: " + idNum);

  // Just grab the one ID we want
  var samplesFilter = data.samples.filter(item => item["id"] == idNum);
  // console.log(`samplesFilter length: ${samplesFilter.length}`);

  // get values into arrays
  var sample_values = samplesFilter[0].sample_values;
  var otu_ids = samplesFilter[0].otu_ids;
  var otu_labels = samplesFilter[0].otu_labels;

  // Create the Trace
  var trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'Earth'
    }
  };

  // Create the data array for the plot
  var bubbleData = [trace1];

  // Define the plot layout
  var bubbleLayout = {
    title: "Bacteria Cultures per Sample",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" },
    hovermode: 'closest',
    showlegend: false,
    height: 600,
    width: 1200
  };

  // Plot the chart to a div tag with id "bubble-plot"
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}
// Draw the gauge chart
function drawGaugeChart(idNum) {
  // Log a change
  console.log("Gauge: " + idNum);

  // Just grab the one ID we want
  var metadataFilter = data.metadata.filter(item => item["id"] == idNum);
  var washFrequency = metadataFilter[0].wfreq;

  // Create the data array for the plot
  var gaugeData = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: washFrequency,
      title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
      gauge: {
        axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "#f7fcf5" },
          { range: [1, 2], color: "#e5f5e0" },
          { range: [2, 3], color: "#c7e9c0" },
          { range: [3, 4], color: "#a1d99b" },
          { range: [4, 5], color: "#74c476" },
          { range: [5, 6], color: "#41ab5d" },
          { range: [6, 7], color: "#238b45" },
          { range: [7, 8], color: "#006d2c" },
          { range: [8, 9], color: "#00441b" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: washFrequency
        }
      }
    }
  ];

  // Define the plot layout
  var gaugeLayout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 }
  };

  // Plot the chart to a div tag with id "gauge-plot"
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
}


// Function to handle changes in the dropdown selection
function optionChanged(selectedId) {
  // Log a change
  console.log("Option: " + selectedId);

  // Call the functions to draw the charts and populate the demographic info panel
  populateDemoInfo(selectedId);
  drawBarPlot(selectedId);
  drawBubbleChart(selectedId);
  drawGaugeChart(selectedId);
}

// Function to initialize the dashboard
function init() {
  // Load the data
  d3.json("samples.json").then(function (jsonData) {
    // Store the data in the global variable
    data = jsonData;

    // Populate the dropdown menu with IDs
    var ids = data.names;
    ids.forEach(function (id) {
      inputSelector.append("option").text(id).property("value", id);
    });

    // Initialize the dashboard with the first ID
    var firstId = ids[0];
    populateDemoInfo(firstId);
    drawBarPlot(firstId);
    drawBubbleChart(firstId);
    drawGaugeChart(firstId);
  });
}

// Initialize the dashboard
init();




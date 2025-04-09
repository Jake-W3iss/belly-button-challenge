let data = d3.json("samples.json");
//console.log(data);





//funciton that populates the meta data
function demoInfo(sample)
{
    //console.log(sample);

    d3.json("samples.json").then((data) => {
        //grab all the metadata
        let metaData = data.metadata;
        //console.log(metadata);
        //filter based on the value of the sample
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
       // console.log(result);

       // access index 0 from the array
       let resultData = result[0];
       //console.log(resultData);

       //clear the metadata out
       d3.select("#sample-metadata").html("");

       // use object.entries to get the value key pairs
       Object.entries(resultData).forEach(([key, value]) => {
            // add to the sample data / demographics seciton
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
       });
    });
}
//fucntion that builds the graphs
function buildBarChart(sample)
{
    //console.log(sample);
    d3.json("samples.json").then((data) => {
        //grab all the samples
        let sampleData = data.samples;
        //console.log(sampleData);
        
        //filter based on the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
       // console.log(result);

       // access index 0 from the array
       let resultData = result[0];
       //console.log(resultData);

       //get the otu_ids, and sample vals
       let otu_ids = resultData.otu_ids;
       let otu_labels = resultData.otu_labels;
       let sample_values = resultData.sample_values;
       //console.log(otu_ids);
       //console.log(otu_labels);
       //console.log(sample_values);

       //nuild the bar chart
       // get the yTicks
       let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`);
       let xValues = sample_values.slice(0,10);
       let txtLabels = otu_labels.slice(0,10);

       let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: txtLabels.reverse(),
            type: "bar",
            orientation: "h"
       }

       let layout = {
            title: "Top 10 Belly Button Bacteria"
       };

       Plotly.newPlot("bar", [barChart], layout);

 
    });
}

function buildBubbleChart(sample){
    d3.json("samples.json").then((data) => {
        //grab all the samples
        let sampleData = data.samples;
        //console.log(sampleData);
        
        //filter based on the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
       // console.log(result);

       // access index 0 from the array
       let resultData = result[0];
       //console.log(resultData);

       //get the otu_ids, and sample vals
       let otu_ids = resultData.otu_ids;
       let otu_labels = resultData.otu_labels;
       let sample_values = resultData.sample_values;

       let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: 'markers',
            marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
            }
       }

       let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
       };

       Plotly.newPlot("bubble", [bubbleChart], layout);

 
    });
}

//funciton that initaites the dashboard
function initialize()
{

   let data = d3.json("samples.json");
   //console.log(data); 
    //load the data from the .json file
    //let data = d3.json("samples.json");
    //console.log(data);

    var select = d3.select("#selDataset");
    
    // use d3.json in order to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names; // made an array of just the names
        //console.log(sampleNames);

        //use foreach in order to create options for each sample in the 
        // selector
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample);
        
        });

    // when we initialized, pass in the informatin for the first sample
     let sample1 = sampleNames[0];
     //call the funciton to build the metadata
     demoInfo(sample1);   
     //call the funciton build the barchart
     buildBarChart(sample1);
     //call the function to buil the bubble chart
     buildBubbleChart(sample1);
    });
 
}

//funciton that updates the dsashboard
function optionChanged(item)
{
    //call the update to the meatdata
    demoInfo(item);
    //call funciton to build the bar chart
    buildBarChart(item);
    //call function to build the bubble chart
    buildBubbleChart(item);
}

// call the initialsize funciton
initialize()
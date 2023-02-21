let url = "/api/gr-levels"

// creating options element and injecting with unique  growth rates
const createGRoptions = () => {
    d3.json(url).then(data => {
        let growthrates = data.map(da => da.growth_rate)
        console.log("before removing duplicate names-->", growthrates)
        growthrates = [...new Set(growthrates)]
        console.log("after removing duplicates-->", growthrates)
      d3.select("#select_growthrate")
        .selectAll('option')
        .data(growthrates).enter()
        .append('option')
          .text(da => da)
    })  
  }
createGRoptions()

const plotGRAPH = (filterVal) => {
    console.log("-->", filterVal)
    d3.select("#growth_rate_for_linegraph").text(filterVal.toUpperCase())
    

    d3.json(url).then(dat => {
        let useCURRENT = gr => gr.growth_rate == filterVal
        console.log(useCURRENT)

        // getting the unique growth rates
        let growthrates = dat.map(d => d.growth_rate)
        growthrates = [...new Set(growthrates)]
        console.log("unique growth rates-->", growthrates)

        // use as x coordinates
        let levels = dat.filter(useCURRENT).map(d => d.level)
        console.log(`--levels of '${filterVal}' growth rate: ${levels}`)

        // use as y coordinates
        let exps = dat.filter(useCURRENT).map(d => d.exp)
        console.log(`--exps of '${filterVal}' growth rate: ${exps}`)


        // linechart
        linegraph1 = {
          type: 'scatter',
          x: levels,
          y: exps,
          mode: 'lines',
          name: 'Red',
          line: {
            color: 'rgb(219, 64, 82)',
            width: 3
          }
        };
        var layout = {
          width: 800,
          height: 500,
          title:'Experience vs Levels for Growth Rates ',
          xaxis: {
            title: 'Levels for Growth Rate',
            showgrid: false,
            zeroline: false
          },
          yaxis: {
            title: 'Experience Required for Pokemon to Reach Levels',
            showline: false
          }
        };
        var data = [linegraph1]
        Plotly.newPlot('linegraph1', data, layout);
        })
        }
        plotGRAPH("slow")
        /// When the value of growth rate changes

let optionChanged = (chosenVALUE) => {
plotGRAPH(chosenVALUE)
}
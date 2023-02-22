let url = "/api/gr-levels"

const plotGRAPH = () => {
    // console.log("-->", filterVal)
    // d3.select("#growth_rate_for_linegraph").text(filterVal.toUpperCase())
    

    d3.json(url).then(dat => {

        let useCURRENT = gr => gr.growth_rate == "slow"
        let slow = gr => gr.growth_rate == "slow"
        let medium = gr => gr.growth_rate == "medium"
        let fast = gr => gr.growth_rate == "fast"
        let medium_slow = gr => gr.growth_rate == "medium-slow"
        let slow_then_very_fast = gr => gr.growth_rate == "slow-then-very-fast"
        let fast_then_very_slow = gr => gr.growth_rate == "fast-then-very-slow"
        // console.log(useCURRENT)

        // getting the unique growth rates
        let growthrates = dat.map(d => d.growth_rate)
        growthrates = [...new Set(growthrates)]
        console.log("unique growth rates-->", growthrates)

        // use as x coordinates
        let levels = dat.filter(useCURRENT).map(d => d.level)
        console.log(`--levels of growth rate: ${levels}`)

        // use as y coordinates
        let slow_exps = dat.filter(slow).map(d => d.exp)
        let medium_exps = dat.filter(medium).map(d => d.exp)
        let fast_exps = dat.filter(fast).map(d => d.exp)
        let medium_slow_exps = dat.filter(medium_slow).map(d => d.exp)
        let slow_then_very_fast_exps = dat.filter(slow_then_very_fast).map(d => d.exp)
        let fast_then_very_slow_exps = dat.filter(fast_then_very_slow).map(d => d.exp)
        console.log(`--exps of growth rate: ${fast_then_very_slow_exps}`)
        c_scale = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]

      


        // linechart
        let trace = (y, c, g_rate) => {
          return {
            type: 'scatter',
            x: levels,
            y: y,
            mode: 'lines',
            name: g_rate,
            line: {
              color: c,
              width: 1
            }
          };
        }
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
        var data = [
          trace(slow_exps, c_scale[0], growthrates[0]), 
          trace(medium_exps,c_scale[1], growthrates[1]), 
          trace(fast_exps, c_scale[2], growthrates[2]), 
          trace(medium_slow_exps, c_scale[3], growthrates[3]), 
          trace(slow_then_very_fast_exps, c_scale[4], growthrates[4]), 
          trace(fast_then_very_slow_exps, c_scale[5], growthrates[5]) 
      ]
        Plotly.newPlot('linegraph', data, layout);
        })

        }
        plotGRAPH("All Growth Rates")

let optionChanged = (chosenVALUE) => {
plotGRAPH(chosenVALUE)
}
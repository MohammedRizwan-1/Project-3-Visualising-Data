let url = "/api/gr-levels"

// creating options element and injecting with unique  growth rates
const createGRoptions = () => {
    d3.json(url).then(dat => {
        let growthrates = dat.map(d => d.growth_rate)
        console.log("before removing duplicate names-->", growthrates)
        growthrates = [...new Set(growthrates)]
        console.log("after removing duplicates-->", growthrates)
      d3.select("#select_growthrate")
        .selectAll('option')
        .data(growthrates).enter()
        .append('option')
          .text(d => d)
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

    })
}
plotGRAPH("slow")



// When the value of growth rate changes
let optionChanged = (chosenVALUE) => {
    plotGRAPH(chosenVALUE)
}
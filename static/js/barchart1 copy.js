let pokeAPIURL = "/api/poke"

// creating options element and injecting with pokemon names
const createPOKEOPTIONS = () => {
    d3.json(pokeAPIURL).then(dat => {
        let pokeNAMES = dat.map(d => d.name)
        console.log("after removing duplicates-->", pokeNAMES)
      d3.select("#select_pokename")
        .selectAll('option')
        .data(pokeNAMES).enter()
        .append('option')
          .text(d => d)
    })  
  }
  createPOKEOPTIONS()

const plotBAR = (filterVal) => {
    console.log("-->", filterVal)
    d3.select("#growth_rate_for_bargraph1").text(filterVal.toUpperCase())
    

    d3.json(pokeAPIURL).then(dat => {

        // create filteration function
        let useCURRENT = pk => pk.name == filterVal
        console.log(useCURRENT)

        // getting the pokemon names
        let pokeNAMES = dat.map(d => d.name)
        // console.log("all poke characters-->", pokeNAMES)

        // to be used as x coordinates
        let baseSTATSx = ["base_attack", "base_def", "base_hp", "base_sp_attack", "base_sp_def", "base_speed"];
        console.log("-basestatsx-", baseSTATSx)

        // to be used as y coordinates
        let base_attack = dat.filter(useCURRENT).map(d => d.base_attack)
        let base_def = dat.filter(useCURRENT).map(d => d.base_def)
        let base_hp = dat.filter(useCURRENT).map(d => d.base_hp)
        let base_sp_attack = dat.filter(useCURRENT).map(d => d.base_sp_attack)
        let base_sp_def = dat.filter(useCURRENT).map(d => d.base_sp_def)
        let base_speed = dat.filter(useCURRENT).map(d => d.base_speed)

        // x coordinates
        let baseSTATSy = [base_attack[0], base_def[0], base_hp[0], base_sp_attack[0], base_sp_def[0], base_speed[0]]
        console.log(base_speed)

        // start of graph
        let trace = {
            x: baseSTATSx,
            y: baseSTATSy,
            type: "bar",
            // orientation: "h"
        }
        let data = [trace];
        let layout = {
            showlegend: false,
            
        };
        Plotly.newPlot("bargraph1", data, layout);

    })
}
plotBAR("bulbasaur")



// When the value of growth rate changes
barPLOTCHANGE = (chosenVALUE) => {
    plotBAR(chosenVALUE)
}
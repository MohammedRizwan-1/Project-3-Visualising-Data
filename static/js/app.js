let pokeAPIURL2 = "/api/poke"

// creating options element and injecting with pokemon names
const createPOKEOPTIONSMAIN = () => {
    d3.json(pokeAPIURL2).then(dat => {
        let pokeNAMES = dat.map(d => d.name)
        console.log("after removing duplicates-->", pokeNAMES)
      d3.select("#select_pokemain")
        .selectAll('option')
        .data(pokeNAMES).enter()
        .append('option')
          .text(d => d)
    })  
  }
  createPOKEOPTIONSMAIN()

const pokeSTATS = (filterVal) => {
    console.log("-->", filterVal)
    d3.select("#pokeNAMEMAIN").text(filterVal.toUpperCase())
    

    d3.json(pokeAPIURL2).then(dat => {

        // create filteration function
        let useCURRENT = pk => pk.name == filterVal
        console.log(useCURRENT)

        // getting the pokemon names
        let pokeNAMES = dat.map(d => d.name)
        // console.log("all poke characters-->", pokeNAMES)


        // get all average value sets for plot 
        const average = arr => arr.reduce((a,b) => a + b, 0) /arr.length
        let avgWEIGHT = average(dat.map(d => d.weight))
        let avgHEIGHT = average(dat.map(d => d.height))
        console.log("calc avg weight-----X", avgWEIGHT)

        // getting character attributes
        let charcterCOLOR = dat.filter(useCURRENT).map(d => d.color)
        let charcterWEIGHT = dat.filter(useCURRENT).map(d => d.weight)
        let charcterHEIGHT= dat.filter(useCURRENT).map(d => d.height)
        let charcterSHAPE = dat.filter(useCURRENT).map(d => d.shape)
        let charcterHABITAT = dat.filter(useCURRENT).map(d => d.habitat)
        let charcterTYPE1 = dat.filter(useCURRENT).map(d => d.type_1)
        let charcterTYPE2 = dat.filter(useCURRENT).map(d => d.type_2)
        let charcterIMG = dat.filter(useCURRENT).map(d => d.standard_pic)
        let characterEVOLVE = dat.filter(useCURRENT).map(d => d.evolves_from)
        let characterGR = dat.filter(useCURRENT).map(d => d.growth_rate)

        let maleRATE = dat.filter(useCURRENT).map(d => d.male_rate)
        let femaleRATE = dat.filter(useCURRENT).map(d => d.female_rate)
        let genderNeutralRATE = dat.filter(useCURRENT).map(d => d.gender_neutral_rate)


        
        console.log(charcterIMG)
        // to be used as x coordinates
        let baseSTATSx = ["base_attack", "base_def", "base_hp", "base_sp_attack", "base_sp_def", "base_speed"];
        console.log("-basestatsx-", baseSTATSx)

        // base stats
        // to be used as y coordinates
        let base_attack = dat.filter(useCURRENT).map(d => d.base_attack)
        let base_def = dat.filter(useCURRENT).map(d => d.base_def)
        let base_hp = dat.filter(useCURRENT).map(d => d.base_hp)
        let base_sp_attack = dat.filter(useCURRENT).map(d => d.base_sp_attack)
        let base_sp_def = dat.filter(useCURRENT).map(d => d.base_sp_def)
        let base_speed = dat.filter(useCURRENT).map(d => d.base_speed)

        // creating an array of y coordinates
        let baseSTATSy = [base_attack[0], base_def[0], base_hp[0], base_sp_attack[0], base_sp_def[0], base_speed[0]]
        console.log(base_speed)


        // push to html
        d3.select("#pokeNAMEMAIN>th").text(filterVal)
        // d3.select("#characterColor").text(charcterCOLOR)
        d3.select("#characterColor").style("background", d3.color(charcterCOLOR))
        d3.select("#characterWeight>td").text(charcterWEIGHT)
        d3.select("#characterHeight>td").text(charcterHEIGHT)
        d3.select("#characterShape").text(charcterSHAPE)
        d3.select("#characterHabitat>td").text(charcterHABITAT)
        d3.select("#characterType1_2>td").text(charcterTYPE1+" / "+charcterTYPE2)
        d3.select("#pokeIMGMAIN").attr("src", charcterIMG[0])
        d3.select("#characterEvolve>td").text(characterEVOLVE)
        d3.select("#growthRate>td").text(characterGR)

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
        // Plotly.newPlot("bargraph1", data, layout);

    })
}
pokeSTATS("bulbasaur")



// When the value of growth rate changes
changePOKESTATS = (chosenVALUE) => {
    pokeSTATS(chosenVALUE)
}
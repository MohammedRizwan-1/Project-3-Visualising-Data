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
        let avgMALERATE = average(dat.map(d => d.male_rate))
        let avgFEMALERATE = average(dat.map(d => d.female_rate))
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
        let chartOptions1 = {
            responsive: true,
            legend: {
              position: "top"
            },
            title: {
              display: true,
              text: "Character Weight & Height vs The Average"
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
          let chartOptions2 = {
            responsive: true,
            legend: {
              position: "top"
            },
            title: {
              display: true,
              text: "Character Gender Rate vs The Average"
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }          
        // Plot for Weight and height vs average weight and height
        new Chart(document.getElementById("compare_with_avg_wt_ht_plot"), {
            type: 'bar',
            data: {
              labels: ["Weight vs AVG", "Height vs AVG"],
              datasets: [{
                label: 'Selected Character',
                data: [charcterWEIGHT[0], charcterHEIGHT[0]],
                backgroundColor: "pink",
                borderColor: "red",          
                borderWidth: 1
              }, {
                label: 'The Average',
                data: [avgWEIGHT, avgHEIGHT],
                backgroundColor: "lightblue",
                borderColor: "blue",
          
                borderWidth: 1
              }]
            },
            options: chartOptions1
          });
        
        
        // Plot for Gender rate vs average Gender rate
        new Chart(document.getElementById("compare_with_avg_gender_rate_plot"), {
            type: 'bar',
            data: {
                labels: ["Male Rate vs AVG", "Female Rate vs AVG"],
                datasets: [{
                label: 'Selected Character',
                data: [maleRATE[0], femaleRATE[0]],
                backgroundColor: "lightgreen",
                borderColor: "green",
                borderWidth: 1
                }, {
                label: 'The Average',
                data: [avgMALERATE, avgFEMALERATE],
                backgroundColor: "yellow",
                borderColor: "orange",
            
                borderWidth: 1
                }]
            },
            options: chartOptions2
            });
        
          

        // Plotly.newPlot("compare_with_avg_wt_ht_plot", data = data1, layout,  {scrollZoom: true});

        // Plotly.newPlot("compare_with_avg_gender_rate_plot", data = data2, layout,  {scrollZoom: true});

    })
}
pokeSTATS("bulbasaur")



// When the value of growth rate changes
changePOKESTATS = (chosenVALUE) => {
    pokeSTATS(chosenVALUE)
}
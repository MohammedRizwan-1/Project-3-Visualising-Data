let pokeAPIURL = "/api/poke"

// creating options element and injecting with pokemon names
const createPOKEOPTIONS = () => {
    d3.json(pokeAPIURL).then(dat => {
        let pokeNAMES = dat.map(d => d.name)
        // console.log("after removing duplicates-->", pokeNAMES)
      d3.selectAll(".select_pokename")
        .selectAll('option')
        .data(pokeNAMES).enter()
        .append('option')
          .text(d => d)
    })  
  }
  createPOKEOPTIONS()

const plotBAR = (filterVal) => {
    console.log("-->", filterVal)
    d3.selectAll(".charName").text(filterVal.toUpperCase())
    

    d3.json(pokeAPIURL).then(dat => {

        // create filteration function
        let useCURRENT = pk => pk.name == filterVal
        console.log(useCURRENT)

        // getting the pokemon names
        let pokeNAMES = dat.map(d => d.name)
        // console.log("all poke characters-->", pokeNAMES)

        //Set Colors for Pie

        let ultimateColors = [['rgb(3 ,202, 252)','rgb(225, 88, 232)','rgb(110, 245, 175)']];
        // to be used as x coordinates
        let baseSTATSx = ["Base Attack", "Base Def", "Base Hp", "Base Sp Attack", "Base Sp Def", "Base Speed"];
        console.log("-basestatsx-", baseSTATSx)

        // to be used as y coordinates
        let base_attack = dat.filter(useCURRENT).map(d => d.base_attack)
        let base_def = dat.filter(useCURRENT).map(d => d.base_def)
        let base_hp = dat.filter(useCURRENT).map(d => d.base_hp)
        let base_sp_attack = dat.filter(useCURRENT).map(d => d.base_sp_attack)
        let base_sp_def = dat.filter(useCURRENT).map(d => d.base_sp_def)
        let base_speed = dat.filter(useCURRENT).map(d => d.base_speed)

        // y coordinates
        let baseSTATSy = [base_attack[0], base_def[0], base_hp[0], base_sp_attack[0], base_sp_def[0], base_speed[0]]
        console.log(base_speed)

        // radar plot
        var options = {
          series: [{
          name: "Pokemon Stats",
          data: baseSTATSy,
        }],
          chart: {
          height: 350,
          type: 'radar',
        },
        dataLabels: {
          enabled: true
        },
        plotOptions: {
          radar: {
            size: 150,
            polygons: {
              strokeColors: '#e9e9e9',
              fill: {
                colors: ['#f8f8f8', '#fff']
              }
            }
          }
        },
        title: {
          text: 'Pokemon Base Stats'
        },
        colors: ['#34b7eb'],
        markers: {
          size: 4,
          colors: ['#17769c'],
          strokeColor: '#17769c',
          strokeWidth: 2,
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val
            }
          }
        },
        xaxis: {
          categories: ["Base Attack", "Base Defence", "Base HP", "Base Sp Attack", "Base Sp Defence", "Base Speed"]
        },
        yaxis: {
          tickAmount: 7,
          labels: {
            formatter: function(val, i) {
              if (i % 2 === 0) {
                return val
              } else {
                return ''
              }
            }
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#stats_radar"), options);

        chart.render("bulbasaur");

        // piechart
        // to be used as labels
        let labels = ["male_rate", "female_rate", "gender_neutral_rate"]

        //to be used as values
        let male_rate = dat.filter(useCURRENT).map(d => d.male_rate)
        let female_rate = dat.filter(useCURRENT).map(d => d.female_rate)
        let gender_neutral_rate = dat.filter(useCURRENT).map(d => d.gender_neutral_rate)

        //Current values selection
        let values = [male_rate[0], female_rate[0], gender_neutral_rate[0]]


        //Pie Chart code
        let data2 = [{
            values: values,
            labels: ["male_rate", "female_rate", "gender_neutral_rate"],
            type: 'pie',
            name: 'Pokemon Genders',
            marker: {
                colors: ultimateColors[0]}
          }];
          
          let layout2 = {
            title: 'Gender Rates',
            height: 600,
            width: 700,
            showlegend: true
          };
          
          Plotly.newPlot('gender_pie', data2, layout2);


          // push to radar chart page
          d3.select("#bs_attack_barchartpage>td").text(base_attack)
          d3.select("#bs_def_barchartpage>td").text(base_def)
          d3.select("#bs_hp_barchartpage>td").text(base_hp)
          d3.select("#bs_sp_att_barchartpage>td").text(base_sp_attack)
          d3.select("#bs_sp_def_barchartpage>td").text(base_sp_def)
          d3.select("#bs_sp_barchartpage>td").text(base_speed)
          
          // push to pie chart page
          d3.select("#gr_male>td").text(male_rate)
          d3.select("#gr_female>td").text(female_rate)
          d3.select("#gr_genderneutral>td").text(gender_neutral_rate)


    })
}
plotBAR("bulbasaur")



// When the value of growth rate changes
barPLOTCHANGE = (chosenVALUE) => {
    plotBAR(chosenVALUE)
}
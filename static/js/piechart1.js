// //barchart1.js
// let pokeAPIURL = "api/poke"


// // creating options element and injecting with pokemon names
// const createPOKEOPTIONS = () => {
//     d3.json(pokeAPIURL).then(dat => {
//         let pokeNAMES = dat.map(d => d.name)
//         console.log("after removing duplicates-->", pokeNAMES)
//       d3.select("#select_pokename")
//         .selectAll('option')
//         .data(pokeNAMES).enter()
//         .append('option')
//           .text(d => d)
//     })  
//   }
//   createPOKEOPTIONS()

// const plotPIE = (filterVal) => {
//     console.log("-->", filterVal)
//     d3.select("#gender_pie").text(filterVal.toUpperCase())
    

//     d3.json(pokeAPIURL).then(dat => {
//         // create filteration function
//         let useCURRENT = pk => pk.name == filterVal
//         console.log(useCURRENT)

//         // getting the pokemon names
//         let pokeNAMES = dat.map(d => d.name)
//         // console.log("all poke characters-->", pokeNAMES)

//         // to be used as labels
//         let labels = ["male_rate", "female_rate", "gender_neutral_rate"]

//         //to be used as values
//         let male_rate = dat.filter(useCURRENT).map(d => d.male_rate)
//         let female_rate = dat.filter(useCURRENT).map(d => d.female_rate)
//         let gender_neutral_rate = dat.filter(useCURRENT).map(d => d.gender_neutral_rate)

//         //Current values selection
//         let values = [male_rate[0], female_rate[0], gender_neutral_rate[0]]

//         //Set Colors for Pie

//         var ultimateColors = [
//             ['rgb(3 ,202, 252)','rgb(225, 88, 232)','rgb(110, 245, 175)']
//         ];

//         //Pie Chart code
//         var data = [{
//             values: values,
//             labels: ["male_rate", "female_rate", "gender_neutral_rate"],
//             type: 'pie',
//             name: 'Pokemon Genders',
//             marker: {
//                 colors: ultimateColors[0]}
//           }];
          
//           var layout = {
//             height: 400,
//             width: 700,
//             showlegend: false
//           };
          
//           Plotly.newPlot('gender_pie', data, layout);
//     })
// }
// plotPIE("bulbasaur")



// // When the value of growth rate changes
// piePLOTCHANGE = (chosenVALUE) => {
//     plotPIE(chosenVALUE)
// }
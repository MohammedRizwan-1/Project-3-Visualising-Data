# Project 3 - The PandaChams Pokemon Tracker

<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/pancham.jpg" width=10% height=20%>
</p>

## Contents
* [Project Summary](#proposal-header)
* [Project Aims](#aims)
* [Required Dependencies and Libraries](#rq-dep)
* [Sources of Data](#data)
* [Data Extraction and Cleaning](#data-ext)
* [Database Creation](#base-cre)
* [Database Connection](#base-con)
* [Table creation](#tables)
* [Graph Creation](#graph)
* [Final Application](#app)

## <a id="proposal-header"></a>Project Summary
We have created a Pokemon App which provides the user with interactive visualisations about a specific pokemon. We used the PokeAPI to extract 1000 records from various endpoints which were cleaned and merged using Python via a Jupyter notebook. This was loaded into a PostgerSQL database and connected to our application via Flask. This was used to make a variety of tables and charts which display the information based on the user's selection using HTML and JavaScript. This was turned into a professional page using Bootstrap/CSS.  

## <a id="aims"></a>Aims of the Project
The Aim of this project was to create data visualization web application that allows users to interactively explore a dataset. We have chosen to create a Pokemon App which will allow users to search or select for a pokemon and retrieve a variety of information including their base stats, gender and growth rates as well as a height and weight comparison. 
Pokemon has been through many generations and has a wide range of characters so will allow us to create a large and detailed data set for the Database to feed our Flask API.

## <a id="rq-dep"></a> Required Dependencies and Libraries
The dependencies that have been used for this project are 
* Pandas
* Requests
* Json
* Numpy
* SQLAlchemy
* Config
* Warnings
* Flask

The Libraries which have been used for this project are 
* D3 [https://d3js.org/](https://d3js.org/)
* Plotly [https://plotly.com/](https://plotly.com/)
* Chart.js [https://www.chartjs.org/](https://www.chartjs.org/)
* APEXCharts [https://apexcharts.com/](https://apexcharts.com/)
* Bootstrap & Star Admin 2 – Bootstrap Admin Dashboard

## <a id="data"></a>Sources of Data
The initial data was collected from the [PokeAPI.co](https://pokeapi.co/). There were 3 different endpoints used to collect all the data that was required.
* Endpoint 1: Pokemon Species: [https://pokeapi.co/api/v2/pokemon-species/](https://pokeapi.co/api/v2/pokemon-species/)  
  This was used to gather details about the first 1000 pokemon and their characteristics.  
  
* Endpoint 2: Pokemon: [https://pokeapi.co/api/v2/pokemon/](https://pokeapi.co/api/v2/pokemon/)  
  This was used to gather additional statistics about each of the first 1000 pokemon which will be combined with the initial data.   
  
* Endpoint 3: Growth Rate: [https://pokeapi.co/api/v2/growth-rate/](https://pokeapi.co/api/v2/growth-rate/)  
  This was used to gather additional statistics about the amount of experience needed for each level for the pokemon growth rates.  
    
## <a id="data-ext"></a> Data Extraction and Cleaning
For each field that we wanted to collect information from an empty list was created. 
```ruby
#Use the Pokemon Species APIs to populate lists
poke_name = []
poke_happy = []
poke_catch = []
poke_color = []
poke_evolve = []
poke_gender = []
poke_generation = []
poke_growth = []
poke_habitat = []
poke_id = []
poke_shape = []
poke_baby = []
poke_leg = []
poke_myth = []
```
A for loop was created to move through the 1000 API pages to collect the information for each pokemon and append the lists that were created in the first step. As not all pokemon had information for their shape and habitat a try exception code block was used to ensure that the API call was able to complete. 

```ruby
for s in range(1000):
    url = "https://pokeapi.co/api/v2/pokemon-species/"+str(s+1)
    response = requests.get(url).json()
    poke_name.append(response["name"])
    poke_happy.append(response["base_happiness"])
    poke_catch.append(response["capture_rate"])
    poke_color.append(response["color"]["name"])
    poke_evolve.append(response["evolves_from_species"])
    poke_gender.append(response["gender_rate"])
    poke_generation.append(response["generation"]["name"])
    poke_growth.append(response["growth_rate"]["name"])
    try:
        poke_habitat.append(response["habitat"]["name"])
    except TypeError:
        poke_habitat.append("N/A")
    poke_id.append(response["id"])
    try:
        poke_shape.append(response["shape"]["name"])
    except TypeError:
        poke_shape.append("N/A")
    poke_baby.append(response["is_baby"])
    poke_leg.append(response["is_legendary"])
    poke_myth.append(response["is_mythical"])
```
Once the lists have been populated these were converted in to a dictionary and this dictionary was used to create a Pandas DataFrame. 

<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/DataFrame1.png">
</p>

This was repeated for the other APIs so that each had its own data frame. These were then merged to create a DataFrame which has all the relevant information required.

```ruby
#Merge the two Dataframes
poke_merge = pd.merge(poke_df, poke_df2, left_index=True, right_index=True)
poke_merge.head()
```
Some of the columns require data cleaning. Using json normalised some of the data was separated into the columns.

```ruby
#Sepearate the Dictionary in the type Colum
df_type_clean = pd.json_normalize(poke_merge['type_1'])
df_type_clean2 = pd.json_normalize(df_type_clean[1])
df_type_clean1 = pd.json_normalize(df_type_clean[0])
types_df = pd.merge(df_type_clean1,df_type_clean2,left_index=True, right_index=True)
types_df.head()
```
<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/Clean_1.png">
</p>

Null values were also replaced.
```ruby
#Remove Null Values
df_poke_named["type_2"].fillna("None",inplace=True)
df_poke_named["evolves_from"].fillna("Base",inplace=True)
```
Gender values needed to be reformatted to ensure that these were able to be used for creating the visualisations. 
```ruby
#Create Gender Rates for each gender 
gender_dict = {
    "id": poke_id,
    "male_rate" : poke_gender,
    "female_rate" : poke_gender,
    "gender_neutral_rate" : poke_gender,
}

poke_gender_df = pd.DataFrame(gender_dict)
poke_gender_df['male_rate'] = poke_gender_df['male_rate'].replace([0,1,2,3,4,5,6,7,8],[100,87.5,75,62.5,50,37.5,25,12.5,0])
poke_gender_df['female_rate'] = poke_gender_df['female_rate'].replace([1,2,3,4,5,6,7,8],[12.5,25,37.5,50,62.5,75,87.5,100])
poke_gender_df['gender_neutral_rate'] = poke_gender_df['gender_neutral_rate'].replace([-1,1,2,3,4,5,6,7,8],[100,0,0,0,0,0,0,0,0])
```
The data was then ready to be placed in the database. 

## <a id="base-cre"></a> Database Creation
The database was created in PostgreSQL via a Jupyter Notebook. An Engine was created to connect the Notebook to the Database. 
```ruby
protocol = 'postgresql'
username = 'postgres'
password = pw
host = 'localhost'
port = 5432
database_name = 'pandachams_db'
rds_connection_string = f'{protocol}://{username}:{password}@{host}:{port}/{database_name}'
engine = create_engine(rds_connection_string)

Base = declarative_base()
```
A table was then created to hold the data that had been extracted from the API.

```ruby
# Creating poke table
class poke(Base):
    extend_existing=True
    __tablename__ = "poke"
    
    poke_id = Column("poke_id", Integer, primary_key = True)
    name = Column("name", String)
    height = Column("height", Integer)
    weight = Column("weight", Integer)
    male_rate = Column("male_rate", Float)
    female_rate = Column("female_rate", Float)
    gender_neutral_rate = Column("gender_neutral_rate", Integer)
    type_1 = Column("type_1", String)
    type_2 = Column("type_2", String)
    color = Column("color", String)
    shape = Column("shape", String)
    growth_rate = Column("growth_rate", String)
    base_hp = Column("base_hp", Integer)
    base_attack = Column("base_attack", Integer)
    base_def = Column("base_def", Integer)
    base_sp_attack = Column("base_sp_attack", Integer)
    base_sp_def = Column("base_sp_def", Integer)
    base_speed = Column("base_speed", Integer)
    evolves_from = Column("evolves_from", String)
    habitat = Column("habitat", String)
    catch_rate = Column("catch_rate", Integer)
    is_baby = Column("is_baby", Boolean)
    is_legendary = Column("is_legendary", Boolean)
    is_mythical = Column("is_mythical", Boolean)
    standard_pic = Column("standard_pic", String)
    shiny_pic = Column("shiny_pic", String)
 ```
 The database was then ready to be connected to Flask

<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/Database_Example.png">
</p>

## <a id="base-con"></a> Database Connection
Python and Flask were used to create an API that could be used to create the visualisations. 

```ruby
# ############# START OF API routes ################
####################################################
# Poke route api
@app.route("/api/poke")
def poke_api():
    session = Session(bind=engine)
    pokes = session.query(poke).all()
    session.close()
    
    poke_list = []
    for row in pokes:
        poke_list.append({
              "poke_id": row.poke_id,                  
              "name": row.name,             
              "height": row.height,
              "weight": row.weight,
              "male_rate": row.male_rate,
              "female_rate": row.female_rate,
              "gender_neutral_rate": row.gender_neutral_rate,
              "type_1": row.type_1,
              "type_2": row.type_2,
              "color": row.color,
              "shape": row.shape,
              "growth_rate": row.growth_rate,
              "base_hp": row.base_hp,
              "base_attack": row.base_attack,
              "base_def": row.base_def,
              "base_sp_attack": row.base_sp_attack,
              "base_sp_def": row.base_sp_def,
              "base_speed": row.base_speed,
              "evolves_from": row.evolves_from,
              "habitat": row.habitat,
              "catch_rate": row.catch_rate,
              "is_baby": row.is_baby,
              "is_legendary": row.is_legendary,
              "is_mythical": row.is_mythical,
              "standard_pic": row.standard_pic,           
              "shiny_pic": row.shiny_pic            
            })
    
    # Return dictionary as a JSON file for JS processing
    return(jsonify(poke_list))

# ############# END OF API routes ################
```
This then gave us an API which could be fed into our final application. This has been done to ensure that we do not overload the PokeAPI that we have gathered our initial data from. 

<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/api_example.png" width=90% height=50%>
</p>

## <a id="tables"></a> Table Creation
Using JavaScript our API was loaded and used to provide the data required to make the visualisations. As these visualisations need to respond to the users Pokemon selection an option element was created. This will allow the correct data to be called when a Pokemon is selected. 

```js
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
```
The data then needs to be extracted from the API and mapped to the correct variable so the values can be called.

```js
    d3.json(pokeAPIURL2).then(dat => {

        // create filteration function
        let useCURRENT = pk => pk.name == filterVal
        console.log(useCURRENT)

        // getting the pokemon names
        let pokeNAMES = dat.map(d => d.name)
        // console.log("all poke characters-->", pokeNAMES)

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
```
This will then allow the user to select the pokemon they wish to have more information on and the chart will display the main stats as well as a pokemon

```HTML
<table class="tiny_table_style">
                              <tr>
                                <th id="pokeNAMEMAIN"></th>
                                <td><img id="pokeIMGMAIN" alt="pokemon pic", width="100"></td>
                              </tr>
                            </table>
                          </div>
                        </div>                        
                      </div>
                      <div class="mt-1">
                        <table class="table select-table big_table_style">
                            <tr id="characterWeight">
                              <th>Weight</th>
                              <td></td>
                            </tr>
                            <tr id="characterHeight">
                              <th>Height</th>
                              <td></td>
                            </tr>
                            <tr id="characterHabitat">
                              <th>Habitat</th>
                              <td></td>
                            </tr>
                            <tr id="characterType1_2">
                              <th>Type(1/2)</th>
                              <td></td>
                            </tr>
                            <tr id="characterEvolve">
                              <th>Evolves From</th>
                              <td></td>
                            </tr>
                            <tr id="growthRate">
                              <th>Growth Rate</th>
                              <td></td>
                            </tr>
                        </table>
                      </div>
                      <hr>
                      <div id="performance-line-legend">
                        <div class="chartjs-legend">
                          <table>
                            <tr>
                              <td>Color: </td>
                              <td id="characterColor"></td>
                              <td> <div style="padding-left: 20px;" >Shape:</div>  </td>
                              <td id="characterShape"></td>
                            </tr>
                          </table>
```


<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/CharacterChanges.png" width=90% height=50%>
</p>

Another table was created to allow users to scan through pokemon information or search for specific pokemon rather than selecting them from a dropdown list. 

<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/table1.png" width=90% height=50%>
</p>

## <a id="graph"></a> Graph Creation 
We have used 4 different charts to display to pokemon information. The first chart was made using Chart.js and is linked to the selectable pokemon table on the landing page of the application. This shows the weight, height and gender rates of the selected pokemon compared to the average of the whole sample. 

The average values for the plots were extracted from the API data. 
```js
// get all average value sets for plot 
        const average = arr => arr.reduce((a,b) => a + b, 0) /arr.length
        let avgWEIGHT = average(dat.map(d => d.weight))
        let avgHEIGHT = average(dat.map(d => d.height))
        let avgMALERATE = average(dat.map(d => d.male_rate))
        let avgFEMALERATE = average(dat.map(d => d.female_rate))
        console.log("calc avg weight-----X", avgWEIGHT)
```
These values were then passed to variables 
```js
let trace2 = {
            x: ["Weight vs AVG", "Height vs AVG"],
            y: [avgWEIGHT, avgHEIGHT],
            type: "bar",
            // orientation: "h"
        }

        let trace3 = {
            x: ["Male Rate vs AVG", "Female Rate vs AVG"],
            y: [maleRATE[0], femaleRATE[0]],
            type: "pie",
            // orientation: "h"
        }
```
The paramaters for the charts were set
```js
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
 ```
 The chart was then plotted
 ```js
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
```

<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/Comparasion%20chart.png" width=90% height=50%>
</p>

The second chart was made using APEXCharts. This is a Radar chart which shows the base stats of the selected pokemon. This uses POKEOPTIONSMAIN() to tell the chart which pokemon has been selected and the variable are mapped in the same way as above. 

The options are then set for the radar plot and the instruction set to render based on the selected pokemon and pushed to correct page of the application. 
```js
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
```

<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/radar_chart.png" width=90% height=50%>
</p>

The third chart is a pie chart which shows the gender rates that decide what gender you encounter when meeting pokemon in the wild. This chart was made using Plotly.
```js
/Pie Chart code
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
```
<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/pie_chart.png" width=90% height=50%>
</p>

The fourth chart was also made on Plotly. This is a line graph which shows the various growth rates which a pokemon can have. It shows level against the amount of experience required. There is a hover function on the graph which will allow the user to see the exact figures when they hover over the chart. 

```js
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
```
<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/Growth_rate_graph_plotly.png" width=90% height=50%>
</p>

## <a id="app"></a> Final Application
Star Admin is a styling template which with Bootstrap to design the page, and give it a professional look. The template was cleaned to leave the elements in that we required for the project. The HTML and JS code has been fed into this to allow the visualisations to be interactive. The final application has a landing page which shows the pokemon selector table and comparison graph. There are menus on the left hand side of the application which allow the user to navigate to the other charts and table as well as access the API we have created through FLASK to get the raw data and information.  

<p align="center">
<img src ="https://github.com/MohammedRizwan-1/Project-3-Visualising-Data/blob/main/Screenshots/Whole1.png" width=90% height=50%>
</p>

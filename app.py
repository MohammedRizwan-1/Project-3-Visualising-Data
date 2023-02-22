from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine, func

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

import pandas as pd
import numpy as np

import re


# Saved password in config file which will be gitignored
from config import pw

protocol = 'postgresql'
username = 'postgres'
password = pw
host = 'localhost'
port = 5432
database_name = 'pandachams_db'
rds_connection_string = f'{protocol}://{username}:{password}@{host}:{port}/{database_name}'
engine = create_engine(rds_connection_string)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the tables
poke = Base.classes.poke
gr_species_table = Base.classes.growth_rate_species
gr_levels_table = Base.classes.growth_rate_levels



# Flask Setup
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True



# Flask Routes
# ############# START OF FRONT PAGE route ################
# Home route
@app.route("/")
def index():
  return render_template("index.html")
# ############# END OF FRONT PAGE route ################


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

# Growth rate species api
@app.route('/api/gr-species')
def gr_species():
    session = Session(bind=engine)
    growth_rate_species = session.query(gr_species_table.id, gr_species_table.growth_rate, gr_species_table.species_name).all()
    session.close()
    
    gr_species = []
    for row in growth_rate_species:
        gr_species.append({
              "id": row[0],         
              "growth_rate": row[1],
              "species_name": row[2],  
           })
    # Return dictionary as a JSON file for JS processing
    return(jsonify(gr_species))


# Growth rate level api
@app.route('/api/gr-levels')
def gr_levels():
    session = Session(bind=engine)
    growth_rate_levels = session.query(gr_levels_table.id, gr_levels_table.growth_rate, gr_levels_table.levels, gr_levels_table.exp).all()
    session.close()
    
    gr_levels = []
    for row in growth_rate_levels:
        gr_levels.append({
              "id": row[0],                  
              "growth_rate": row[1],                    
              "level": row[2],                    
              "exp": row[3],                    
           })
    # Return dictionary as a JSON file for JS processing
    return(jsonify(gr_levels))
# ############# END OF API routes ################




# ############# START OF STATS route #################
######################################################
# stats route
@app.route('/stats')
def stats():
  session = Session(engine)
  gr_species_gr = session.query(gr_species_table.growth_rate).distinct().all()
  gr_levels_max_ex = session.query(gr_levels_table.exp).filter(gr_levels_table.levels == 100).all()

  session.close()
  return render_template("charts/stats.html", gr_species_gr = gr_species_gr, gr_levels_max_ex = gr_levels_max_ex)
# ############# END OF STATS route ###################



# ############ START OF TABLE routes ##################
#######################################################
# poke table route
@app.route('/poke-table')
def poketable():
  session = Session(engine)
  tb_data1 = session.query(poke.poke_id, poke.standard_pic, poke.name, poke.height, poke.weight, poke.male_rate, poke.female_rate, poke.type_1, poke.growth_rate, poke.base_hp).all()
  char_count = session.query(poke.name).count()
  avg_wt = session.query(func.round(func.avg(poke.weight)), 0).one()
  avg_ht = session.query(func.round(func.avg(poke.height)), 0).one()
  avg_malerate = session.query(func.round(func.avg(poke.male_rate)), 0).one()
  avg_femalerate = session.query(func.round(func.avg(poke.female_rate)), 0).one()
  avg_basehp = session.query(func.round(func.avg(poke.base_hp)), 0).one()
  avg_catchrate = session.query(func.round(func.avg(poke.catch_rate)), 0).one()

  session.close()

  return render_template("poke_table.html", tb_data1 = tb_data1, char_count= char_count, avg_wt = avg_wt, avg_ht = avg_ht, avg_malerate = avg_malerate, avg_femalerate = avg_femalerate, avg_basehp = avg_basehp, avg_catchrate = avg_catchrate)


# growth rate species route 
@app.route('/grspecies-table')
def growthrate_species():
  session = Session(engine)
  tb_data2 = session.query(gr_species_table.id, gr_species_table.growth_rate, gr_species_table.species_name).all()
  gr_species_count = session.query(gr_species_table.species_name).count()
  gr_species_gr = session.query(gr_species_table.growth_rate).distinct().all()
  session.close()

  return render_template("growthrate_species.html", tb_data2 = tb_data2, gr_species_count = gr_species_count, gr_species_gr = gr_species_gr)


# growth rate levels route
@app.route('/grlevels-table')
def growthrate_levels():
  session = Session(engine)
  tb_data3 = session.query(gr_levels_table.id, gr_levels_table.growth_rate, gr_levels_table.levels, gr_levels_table.exp).all()
  gr_levels_count = session.query(gr_levels_table.levels).filter(gr_levels_table.growth_rate == "slow").count()
  gr_species_gr = session.query(gr_species_table.growth_rate).distinct().all()
  gr_levels_max_ex = session.query(gr_levels_table.exp).filter(gr_levels_table.levels == 100).all()

  session.close()

  return render_template("growthrate_levels.html", tb_data3 = tb_data3, gr_levels_count = gr_levels_count, gr_species_gr = gr_species_gr, gr_levels_max_ex = gr_levels_max_ex)
# ############ END OF TABLE routes ###############




############# START OF CHARTS ROUTES ################
#####################################################
# linegraph route
@app.route('/linegraph')
def linegraph1():
  return render_template("charts/linegraph.html")
############# END OF charts routes ################


if __name__ == '__main__':
    app.run()
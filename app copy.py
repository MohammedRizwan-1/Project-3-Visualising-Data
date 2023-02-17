from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine,func, ForeignKey, Column, String, Integer, Text, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

import requests
import json
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

Base = declarative_base()


# Flask Setup
app = Flask(__name__)

# Flask Routes

# Home route
@app.route("/")
def index():
  return render_template("index.html")

# API routes
# Poke route api
@app.route("/api/poke")
def poke_api():
    session = Session(bind=engine)
    execute_string = "select * from poke"
    pokes = engine.execute(execute_string).fetchall()
    session.close()
    
    poke_list = []
    for row in pokes:
        poke_list.append({
              "poke_id": row[0],                  
              "name": row[1],                    
              "height": row[2],
              "weight": row[3],
              "male_rate": row[4],
              "female_rate": row[5],
              "gender_neutral_rate": row[6],
              "type_1": row[7],
              "type_2": row[8],
              "color": row[9],
              "shape": row[10],
              "growth_rate": row[11],
              "base_hp": row[12],
              "base_attack": row[13],
              "base_def": row[14],
              "base_sp_attack": row[15],
              "base_sp_def": row[16],
              "base_speed": row[17],
              "evolves_from": row[18],
              "habitat": row[19],
              "catch_rate": row[20],
              "is_baby": row[21],
              "is_legendary": row[22],
              "is_mythical": row[23],
              "standard_pic": row[24],           
              "shiny_pic": row[25]            
            })
    
    # Return dictionary as a JSON file for JS processing
    return(jsonify(poke_list))

# Growth rate species api
@app.route('/api/gr-species')
def gr_species():
    session = Session(bind=engine)
    execute_string = "select * from growth_rate_species"
    growth_rate_species = engine.execute(execute_string).fetchall()
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
    execute_string = "select * from growth_rate_levels"
    growth_rate_levels = engine.execute(execute_string).fetchall()
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


@app.route('/stats')
def stats():
  return render_template("stats.html")

@app.route('/poke-table')
def poketable():
  session = Session(bind=engine)
  execute_string = "select * from poke limit 10"
  tb_data1 = engine.execute(execute_string).fetchall()
  session.close()

  return render_template("poke_table.html", tb_data1 = tb_data1)

@app.route('/grspecies-table')
def growthrate_species():
  session = Session(bind=engine)
  execute_string = "select * from growth_rate_species limit 50"
  # execute_count_growthrate_species = "select COUNT(species_name) from growth_rate_species"
  
  tb_data2 = engine.execute(execute_string).fetchall()

  sel = [func.count(growth_rate_species.species_name)]
  growth_rate_species = session.query(*sel).all()
  # growth_rate_species = engine.execute(execute_count_growthrate_species).fetchone()
  session.close()

  return render_template("growthrate_species.html", tb_data2 = tb_data2, growth_rate_species = growth_rate_species)

@app.route('/grlevels-table')
def growthrate_levels():
  session = Session(bind=engine)
  execute_string = "select * from growth_rate_levels limit 10"
  tb_data3 = engine.execute(execute_string).fetchall()
  session.close()

  return render_template("growthrate_levels.html", tb_data3 = tb_data3)


@app.route('/about')
def about():
  html = "<p>about</p>"
  return html

if __name__ == '__main__':
    app.run()
from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine, ForeignKey, Column, String, Integer, Text, Boolean, Float
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
@app.route("/")
def index():
  return render_template("index.html")

@app.route("/api/poke")
def poke():
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

@app.route('/api/growthrate')
def growth_rate():
  return "growth rate here"


@app.route('/stats')
def stats():
  return render_template("stats.html")

@app.route('/tables')
def tables():
  session = Session(bind=engine)
  execute_string = "select * from poke limit 10"
  poke_table1 = engine.execute(execute_string).fetchall()
  session.close()

  # poke_table1 = pd.DataFrame(poke_table1).to_html()
  # poke_table1 = "table here"

  return render_template("table1.html", data1 = poke_table1)

@app.route('/about')
def about():
  html = "<p>about</p>"
  return html

if __name__ == '__main__':
    app.run()
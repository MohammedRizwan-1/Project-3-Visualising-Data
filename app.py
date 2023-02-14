from flask import Flask, render_template


# Flask Setup
app = Flask(__name__)

# Flask Routes
@app.route("/")
def index():
  return render_template("index.html")


@app.route('/about')
def about():
  html = "<p>about</p>"
  return html

if __name__ == '__main__':
    app.run()
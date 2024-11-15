from sklearn.datasets import fetch_openml
from flask import Flask
from PIL import Image
from flask import jsonify
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
import numpy as np
import pandas as pd
from flask import render_template
from flask import request

X, y = fetch_openml('mnist_784', return_X_y=True, as_frame=False)

X = X.astype('uint8')
y = y.astype('uint8')

knn = KNeighborsClassifier().fit(X, y)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    X = request.files['image']
    X = Image.open(X)
    X = X.convert('L')
    X = X.resize((28, 28))
    X = 255 - np.array(X)
    X = X.reshape(1, -1)
    y = knn.predict(X)
    y = int(y[0])
    return jsonify({"prediction": y})

if __name__ == '__main__':
    app.run()

import pickle
import numpy as np
from PIL import Image
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.neighbors import KNeighborsClassifier
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from flask import Flask, render_template, request, jsonify
import io

class ImageLoader(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return np.array(Image.open(X).resize((28, 28)).convert('L'))

class ImageReshaper(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X.reshape(1, -1)

with open('data.pkl', 'rb') as file:
    (x_train, y_train), (x_test, y_test) = pickle.load(file)

x_train = x_train.reshape(x_train.shape[0], -1)

lda = LinearDiscriminantAnalysis()
x_train = lda.fit_transform(x_train, y_train)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(x_train, y_train)

pipeline = Pipeline([
    ('loader', ImageLoader()),
    ('reshaper', ImageReshaper()),
    ('lda', lda),
    ('knn', knn)
])

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api', methods=['POST'])
def api():
    image = request.files['image']
    print(image)
    y_pred = pipeline.predict(image)
    return jsonify(float(y_pred[0])) # ugly

@app.route('/api/invert', methods=['POST'])
@app.route('/api/invert', methods=['POST'])
def invert_api():
    image_data = request.files['image']
    image = Image.open(image_data.stream)
    inverted_image = Image.eval(image, lambda x: 255 - x)  # Invert colors

    img_byte_arr = io.BytesIO()
    inverted_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0) 
    
    y_pred = pipeline.predict(img_byte_arr)  # Reshape for prediction
    return jsonify(float(y_pred[0]))  # Return prediction result


if __name__ == '__main__':
    app.run(debug=True)

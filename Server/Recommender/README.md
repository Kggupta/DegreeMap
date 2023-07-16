# DegreeMap Recommendation Model

# 1. Recommendation System Explained

1. What our system does:
Any good recomendation system should be able to make suggestions that are relevant to user. Our recomendation system is meant to achieve this effect using a textual analysis system which examines and classifies the similarities between course descriptions. Through the use of prod data, descriptions were processed and ingested by a universal sentence encoder model which was able to classify the semantic similarity between classes. Through this we are able to recommend relevant classes based on the classes users had previously take.

2. Limitations of our system:
Of course, our recommeder is not perfect and this is mainly because we are lacking user data. As a result we only base the recommendations on already available course data. Since we lack a large user base to train on, we have no way of developing a collaborative filtering system which makes use of the idea of "similar users". Thus we have decided that basing our recommendations on content-based filtering would be the next best thing. Though this still provides us with interesting and relevant recommendations, having user data and implementing a collavorative filtering system would further improve our recomendation engine.

# 2. Using the Model Notebook

1. Install pip for your python environment if you haven't already
2. Install tensorflow, tensorflow_hub, pandas, and numpy, if you haven't already 

```
pip install "tensorflow<2.12,>=2.11.0"
pip install tensorflow-hub
pip install pandas
pip install numpy
```

3. run through each cell of the notebook, reading the  first comment to understand main purpose of cell. 


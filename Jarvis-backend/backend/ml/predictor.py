import joblib
import numpy as np
import os

model = joblib.load(os.path.join(os.path.dirname(__file__), "stress_model.pkl"))

def predict_stress_from_tracker(
    screen_time,
    continuous_usage,
    night_usage,
    app_switches,
    breaks,
    productive_ratio
):
    features = np.array([[
        screen_time,
        continuous_usage,
        night_usage,
        app_switches,
        breaks,
        productive_ratio
    ]])

    prediction = model.predict(features)[0]

    # FIX: model was trained on string labels so prediction is already a string.
    # Old code mapped int 0/1/2 -> string, which always missed and returned "Medium".
    if prediction in ("Low", "Medium", "High"):
        return prediction

    # Fallback if model is ever retrained with numeric labels
    mapping = {0: "Low", 1: "Medium", 2: "High"}
    return mapping.get(int(prediction), "Medium")
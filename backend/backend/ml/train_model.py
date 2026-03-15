import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Load dataset
DATA_FILE = os.path.join(os.path.dirname(__file__), "training_data.csv")
MODEL_FILE = os.path.join(os.path.dirname(__file__), "stress_model.pkl")

data = pd.read_csv(DATA_FILE)

print(f"Dataset size: {len(data)} rows")
print(f"Label distribution:\n{data['stress'].value_counts()}\n")

if len(data) < 50:
    print(
        f"\n⚠️  WARNING: Only {len(data)} rows in training data. "
        "The model will overfit and accuracy is not trustworthy. "
        "Collect more real activity data before relying on predictions.\n"
    )

# FIX: Validate that feature ranges cover realistic tracker output.
# screen_time is in MINUTES. A typical workday is 240-600 min.
# If all Low rows have screen_time < 120, the model will never predict
# Medium/High during a normal short session.
print("Feature ranges per class:")
for label in data['stress'].unique():
    sub = data[data['stress'] == label]
    print(f"  {label}: screen_time [{sub['screen_time'].min():.0f}-{sub['screen_time'].max():.0f}]"
          f", night_usage [{sub['night_usage'].min():.0f}-{sub['night_usage'].max():.0f}]"
          f", productive_ratio [{sub['productive_ratio'].min():.2f}-{sub['productive_ratio'].max():.2f}]"
          f", app_switches [{sub['app_switches'].min():.0f}-{sub['app_switches'].max():.0f}]")

print()

# Separate features and labels
X = data.drop("stress", axis=1)
y = data["stress"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# FIX: max_depth=5 (was 4) to handle the wider feature ranges in the new
# training data while still limiting overfitting.
model = DecisionTreeClassifier(max_depth=5, random_state=42)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print("Test Accuracy:", round(accuracy, 4))
print("\nClassification Report:")
print(classification_report(y_test, predictions))

# Cross-validation
if len(data) >= 15:
    cv_scores = cross_val_score(model, X, y, cv=min(5, len(data) // 3))
    print(f"Cross-val accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    if cv_scores.mean() > 0.99:
        print("⚠️  CV accuracy is suspiciously perfect — training data may have "
              "non-overlapping class boundaries. Consider adding more varied samples.")

# Save model
joblib.dump(model, MODEL_FILE)
print(f"\nModel saved to: {MODEL_FILE}")

import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import os

def train_model():
    if not os.path.exists("dataset.csv"):
        print("dataset.csv not found. Run extract_features.py first.")
        return

    df = pd.read_csv("dataset.csv")
    
    # Select features for training
    features = [
        'task_age', 'time_to_due', 'block_count', 'total_blocked_hours',
        'column_change_count', 'time_in_current_column', 'dependency_count',
        'unresolved_dependencies', 'assignee_count', 'estimateHours',
        'difficulty', 'progress_ratio', 'is_overdue', 'blocked_ratio',
        'reassign_count', 'comment_count', 'desc_length', 'assignee_workload'
    ]
    
    X = df[features]
    y = df['risk_label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # XGBoost model
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        objective='binary:logistic',
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    print("Model Evaluation:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"Precision: {precision_score(y_test, y_pred):.4f}")
    print(f"Recall: {recall_score(y_test, y_pred):.4f}")
    print(f"F1 Score: {f1_score(y_test, y_pred):.4f}")
    
    # Save model
    joblib.dump(model, "model.pkl")
    # Save feature names to ensure consistency in prediction API
    joblib.dump(features, "features.pkl")
    print("Model saved to model.pkl")

if __name__ == "__main__":
    train_model()

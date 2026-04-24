import pandas as pd
import numpy as np
import os

def generate_realistic_synthetic(num_rows=3000):
    np.random.seed(42)
    
    data = []

    for i in range(num_rows):
        # Base task characteristics
        difficulty = np.random.randint(1, 6) # 1: Easy, 5: Very Hard
        estimate_hours = np.random.uniform(2, 60)
        
        # IT Specific: Underestimation tendency
        # Harder tasks are more likely to be underestimated
        underestimate_factor = 1.0 + (difficulty * 0.2 * np.random.random())
        actual_effort_needed = estimate_hours * underestimate_factor
        
        # Timeline
        task_age = np.random.uniform(1, 150)
        time_to_due = np.random.uniform(-20, 100)
        
        # Communication & Clarity
        # Low description length for high difficulty = higher risk
        desc_length = np.random.randint(0, 500)
        comment_count = np.random.randint(0, 15)
        
        # Workflow
        block_count = np.random.choice([0, 1, 2, 3], p=[0.6, 0.2, 0.1, 0.1])
        total_blocked_hours = block_count * np.random.uniform(4, 48)
        dependency_count = np.random.randint(0, 6)
        unresolved_dependencies = np.random.randint(0, dependency_count + 1) if dependency_count > 0 else 0
        
        column_change_count = np.random.randint(1, 8)
        time_in_current_column = np.random.uniform(1, task_age)
        
        # Resource factor
        assignee_count = np.random.randint(1, 4)
        reassign_count = np.random.randint(0, 4)
        assignee_workload = np.random.randint(1, 10) # How many tasks they have
        
        # Derived features
        progress_ratio = task_age / (task_age + abs(time_to_due) + 1)
        blocked_ratio = total_blocked_hours / (task_age + 1)
        is_overdue = int(time_to_due < 0)
        
        # --- REALISTIC IT RISK LOGIC ---
        risk_score = 0
        
        # 1. The "Silent Killer": High difficulty, low description, low comments
        if difficulty >= 4 and desc_length < 50 and comment_count < 2:
            risk_score += 3
            
        # 2. "Underestimation Trap": High activity/age but still in early columns
        if task_age > actual_effort_needed and column_change_count < 3:
            risk_score += 2
            
        # 3. "Dependency Hell": Many unresolved dependencies
        if unresolved_dependencies >= 3:
            risk_score += 3
            
        # 4. "Bottleneck": Assignee has too many tasks
        if assignee_workload > 6:
            risk_score += 1.5
            
        # 5. "Scope Creep/Churn": Too many column changes or reassignments
        if column_change_count > 5 or reassign_count > 2:
            risk_score += 2
            
        # 6. "Standard Blockers"
        if block_count > 1 or blocked_ratio > 0.4:
            risk_score += 2
            
        # 7. "Deadline Pressure"
        if is_overdue:
            risk_score += 4
        elif time_to_due < 24 and progress_ratio < 0.5:
            risk_score += 2

        # Final label: 1 (High Risk) if score > threshold
        # Add some randomness/uncertainty (IT projects are unpredictable)
        threshold = 4.5
        risk_prob = 1 / (1 + np.exp(-(risk_score - threshold)))
        risk_label = 1 if np.random.random() < risk_prob else 0

        data.append([
            task_age, time_to_due, block_count, total_blocked_hours,
            column_change_count, time_in_current_column, dependency_count, 
            unresolved_dependencies, assignee_count, estimate_hours, 
            difficulty, progress_ratio, is_overdue, blocked_ratio,
            reassign_count, comment_count, desc_length, assignee_workload,
            risk_label
        ])

    columns = [
        'task_age', 'time_to_due', 'block_count', 'total_blocked_hours',
        'column_change_count', 'time_in_current_column', 'dependency_count',
        'unresolved_dependencies', 'assignee_count', 'estimateHours',
        'difficulty', 'progress_ratio', 'is_overdue', 'blocked_ratio',
        'reassign_count', 'comment_count', 'desc_length', 'assignee_workload',
        'risk_label'
    ]

    df = pd.DataFrame(data, columns=columns)
    df.to_csv("synthetic_dataset.csv", index=False)
    print(f"Generated {num_rows} realistic IT project tasks.")

if __name__ == "__main__":
    generate_realistic_synthetic()

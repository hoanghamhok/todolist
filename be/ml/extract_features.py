import os
import pandas as pd
import psycopg2
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

def get_db_connection():
    db_url = os.getenv("DATABASE_URL")
    if "?schema=" in db_url:
        db_url = db_url.split("?")[0]
    return psycopg2.connect(db_url)

def extract_features():
    query = """
    WITH TaskStats AS (
        SELECT
            t.id AS task_id,
            t.created_at,
            t."dueDate",
            t."completedAt",
            t."estimateHours",
            t.difficulty,
            COALESCE(LENGTH(t.description), 0) AS desc_length,
            -- Time Features
            EXTRACT(EPOCH FROM (NOW() - t.created_at)) / 3600 AS task_age,
            CASE
                WHEN t."dueDate" IS NOT NULL THEN EXTRACT(EPOCH FROM (t."dueDate" - NOW())) / 3600
                ELSE 100 -- Default for no due date
            END AS time_to_due,
            -- Block Features
            (SELECT COUNT(*) FROM "TaskBlock" tb WHERE tb."taskId" = t.id) AS block_count,
            (SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (COALESCE(tb."unblockedAt", NOW()) - tb."blockedAt")) / 3600), 0)
             FROM "TaskBlock" tb WHERE tb."taskId" = t.id) AS total_blocked_hours,
            -- Workflow Features
            (SELECT COUNT(*) FROM "ActivityLog" al WHERE al."entityId" = t.id AND al.action = 'TASK_MOVED') AS column_change_count,
            (SELECT EXTRACT(EPOCH FROM (NOW() - COALESCE(MAX(al."createdAt"), t.created_at))) / 3600
             FROM "ActivityLog" al WHERE al."entityId" = t.id AND al.action = 'TASK_MOVED') AS time_in_current_column,
            -- Dependency Features
            (SELECT COUNT(*) FROM "TaskDependency" td WHERE td."taskId" = t.id) AS dependency_count,
            (SELECT COUNT(*) FROM "TaskDependency" td
             JOIN "Task" dep ON td."dependsOnTaskId" = dep.id
             WHERE td."taskId" = t.id AND dep."completedAt" IS NULL) AS unresolved_dependencies,
            -- Assignee & Workload
            (SELECT COUNT(*) FROM "TaskAssignee" ta WHERE ta."taskId" = t.id) AS assignee_count,
            (SELECT COUNT(*) FROM "ActivityLog" al WHERE al."entityId" = t.id AND al.action = 'ASSIGNEE_CHANGED') AS reassign_count,
            (
                SELECT COUNT(*) 
                FROM "TaskAssignee" ta2
                JOIN "Task" t2 ON ta2."taskId" = t2.id
                WHERE ta2."userId" IN (SELECT "userId" FROM "TaskAssignee" WHERE "taskId" = t.id)
                  AND t2."completedAt" IS NULL
                  AND t2."projectId" = t."projectId"
            ) AS assignee_workload,
            -- Comment & Activity
            (SELECT COUNT(*) FROM "Comment" c WHERE c."taskId" = t.id) AS comment_count
        FROM "Task" t
    )
    SELECT * FROM TaskStats;
    """
    
    conn = get_db_connection()
    df = pd.read_sql(query, conn)
    conn.close()

    # Derived features
    df['is_overdue'] = ((df['time_to_due'] < 0) & df['completedAt'].isnull()).astype(int)
    df['progress_ratio'] = df['task_age'] / (df['task_age'] + df['time_to_due'].abs() + 0.001)
    df['blocked_ratio'] = df['total_blocked_hours'] / (df['task_age'] + 1)
    
    # Fill defaults for ML
    df['estimateHours'] = df['estimateHours'].fillna(8)
    df['difficulty'] = df['difficulty'].fillna(2)
    
    # Risk label for training (unknown for real data)
    df['risk_label'] = -1
    
    # Define columns to keep (must match generate_synthetic_data.py)
    cols = [
        'task_age', 'time_to_due', 'block_count', 'total_blocked_hours',
        'column_change_count', 'time_in_current_column', 'dependency_count',
        'unresolved_dependencies', 'assignee_count', 'estimateHours',
        'difficulty', 'progress_ratio', 'is_overdue', 'blocked_ratio',
        'reassign_count', 'comment_count', 'desc_length', 'assignee_workload',
        'risk_label'
    ]
    
    df_filtered = df[cols].copy()
    
    # Load synthetic
    if os.path.exists("synthetic_dataset.csv"):
        syn_df = pd.read_csv("synthetic_dataset.csv")
        combined = pd.concat([syn_df, df_filtered], ignore_index=True)
        # Train only on synthetic for now (since we have labels)
        train_df = combined[combined['risk_label'] != -1].copy()
    else:
        # If no synthetic, this is just for prediction
        train_df = df_filtered

    train_df.to_csv("dataset.csv", index=False)
    print(f"Features extracted. Dataset size: {len(train_df)}")
    return train_df

if __name__ == "__main__":
    extract_features()

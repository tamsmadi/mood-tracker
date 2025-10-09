from datetime import datetime, timedelta
import sqlite3

sqlite_file = 'mood_tracker.db'

def get_db_connection():
    conn = sqlite3.connect(sqlite_file)
    conn.row_factory = sqlite3.Row
    return conn

def close_db_connection(conn):
    conn.close()

def get_mood_label(rating):
    if rating <= 2:
        return "terrible"
    elif rating <= 4:
        return "bad"
    elif rating <= 6:
        return "okay"
    elif rating <= 8:
        return "good"
    else:  # 9-10
        return "excellent"

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS moods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mood_rating INTEGER NOT NULL,
            mood_label TEXT NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute(''' SELECT COUNT(*) FROM moods ''')
    if cursor.fetchone()[0] == 0:
        ratings = [5, 7, 3, 8, 6, 9, 4, 2, 10, 1]
        for rating in ratings:
            label = get_mood_label(rating)
            cursor.execute('''
                INSERT INTO moods (mood_rating, mood_label)
                VALUES (?, ?)
            ''', (rating, label))
            
    conn.commit()
    close_db_connection(conn)
    # return conn    


def add_mood(mood_rating: int):
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO moods (mood_rating, mood_label)
        VALUES (?, ?)
    ''', (mood_rating, get_mood_label(mood_rating)))
    conn.commit()
    close_db_connection(conn)


def get_all_moods():
    conn = get_db_connection()
    moods = conn.execute('SELECT * FROM moods ORDER BY date DESC').fetchall()
    close_db_connection(conn)
    return [dict(mood) for mood in moods]

def get_recent_moods(days=7):
    cutoff_date = datetime.now() - timedelta(days=days)
    cutoff_str = cutoff_date.strftime('%Y-%m-%d %H:%M:%S')
    conn = get_db_connection()
    moods = conn.execute('SELECT * FROM moods WHERE date >= ? ORDER BY date DESC', (cutoff_str,)).fetchall()
    close_db_connection(conn)
    return [dict(mood) for mood in moods]
    

def get_last_moods(count=5):
    conn = get_db_connection()
    moods = conn.execute('SELECT * FROM moods ORDER BY date DESC LIMIT ?', (count,)).fetchall()
    close_db_connection(conn)
    return [dict(mood) for mood in moods]


def delete_mood(mood_id: int):
    conn = get_db_connection()
    conn.execute('DELETE FROM moods WHERE id = ?', (mood_id,))
    conn.commit()
    close_db_connection(conn)

if __name__ == "__main__":
    init_db()
    print(get_recent_moods(3))
    print(get_last_moods(3))
    print(get_all_moods())
    add_mood(5)
    print(get_all_moods())
    delete_mood(12)    
    print(len(get_all_moods()))
# Simple in-memory store for development when Supabase is not available
# Structure: { user_id: { table_name: [rows] } }

dev_data = {}


def get_or_create_user_store(user_id: str):
    """Get or create user's dev store"""
    if user_id not in dev_data:
        dev_data[user_id] = {
            'user_specs': [],
            'educations': [],
            'languages': [],
            'certificates': [],
            'projects': [],
            'activities': [],
            'goals': [],
            'tasks': [],
        }
    return dev_data[user_id]


def dev_insert(table: str, user_id: str, data: dict):
    """Insert data into dev store"""
    from datetime import datetime
    
    store = get_or_create_user_store(user_id)
    if table not in store:
        store[table] = []
    
    # Add ID if not present
    if 'id' not in data:
        data['id'] = len(store[table]) + 1
    
    # Add timestamps
    if 'created_at' not in data:
        data['created_at'] = datetime.now().isoformat()
    if 'updated_at' not in data:
        data['updated_at'] = datetime.now().isoformat()
    
    store[table].append(data)
    return data


def dev_select_all(table: str, user_id: str):
    """Select all rows for a user from table"""
    store = get_or_create_user_store(user_id)
    return store.get(table, [])


def dev_select_one(table: str, user_id: str, **filters):
    """Select one row matching filters"""
    store = get_or_create_user_store(user_id)
    rows = store.get(table, [])
    for row in rows:
        if all(row.get(k) == v for k, v in filters.items()):
            return row
    return None


def dev_update(table: str, user_id: str, update_data: dict, **filters):
    """Update rows matching filters"""
    store = get_or_create_user_store(user_id)
    rows = store.get(table, [])
    updated = []
    for row in rows:
        if all(row.get(k) == v for k, v in filters.items()):
            row.update(update_data)
            updated.append(row)
    return updated


def dev_delete(table: str, user_id: str, **filters):
    """Delete rows matching filters"""
    store = get_or_create_user_store(user_id)
    if table not in store:
        return
    store[table] = [row for row in store[table] if not all(row.get(k) == v for k, v in filters.items())]

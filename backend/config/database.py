import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# If running locally without real Supabase credentials, allow the app to start
# but set `supabase` to None so callers can handle absence of a client.
if not SUPABASE_URL or not SUPABASE_KEY:
    # Do not raise here to allow local development without Supabase configured.
    print("Warning: SUPABASE_URL or SUPABASE_KEY not set. Supabase client will be None.")
    supabase: Client | None = None
else:
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        # If the provided key is invalid or connection fails, fall back to None and
        # allow the server to run for frontend development. Log the error for
        # developer visibility.
        print(f"Warning: failed to create Supabase client: {e}\nSupabase client will be None.")
        supabase = None

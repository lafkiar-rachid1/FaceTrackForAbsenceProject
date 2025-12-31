from sqlalchemy import create_engine, text
from config import settings

def fix_constraint():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as connection:
        try:
            # Tenter de supprimer la contrainte problématique
            print("Tentative de suppression de la contrainte 'attendance_status_check'...")
            connection.execute(text("ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;"))
            connection.execute(text("ALTER TABLE attendance DROP CONSTRAINT IF EXISTS check_status;"))
            connection.commit()
            print("Contrainte supprimée avec succès (si elle existait).")
        except Exception as e:
            print(f"Erreur : {e}")

if __name__ == "__main__":
    fix_constraint()

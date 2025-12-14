"""Script pour créer les tables de la base de données"""
from app.database import engine, Base
from app.models import User, Attendance

def create_tables():
    """Créer toutes les tables dans la base de données"""
    print("Création des tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables créées avec succès!")

if __name__ == "__main__":
    create_tables()

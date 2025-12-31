"""
Script pour créer des utilisateurs de test (Admin et Professeur)
"""
import sys
from sqlalchemy.orm import Session
from database.connection import engine, SessionLocal
from models.database_models import Base, Role, User
from utils.security import get_password_hash


def create_roles(db: Session):
    """Créer les rôles de base"""
    roles_data = [
        {"role_name": "Admin"},
        {"role_name": "Professor"},
        {"role_name": "Student"}
    ]
    
    for role_data in roles_data:
        existing_role = db.query(Role).filter(Role.role_name == role_data["role_name"]).first()
        if not existing_role:
            role = Role(**role_data)
            db.add(role)
            print(f"✅ Rôle '{role_data['role_name']}' créé")
        else:
            print(f"ℹ️  Rôle '{role_data['role_name']}' existe déjà")
    
    db.commit()


def create_test_users(db: Session):
    """Créer des utilisateurs de test"""
    
    # Récupérer les rôles
    admin_role = db.query(Role).filter(Role.role_name == "Admin").first()
    professor_role = db.query(Role).filter(Role.role_name == "Professor").first()
    
    if not admin_role or not professor_role:
        print("❌ Erreur: Les rôles n'existent pas. Créez-les d'abord.")
        return
    
    # Utilisateur Admin
    admin_username = "admin"
    existing_admin = db.query(User).filter(User.username == admin_username).first()
    
    if not existing_admin:
        admin = User(
            username=admin_username,
            password_hash=get_password_hash("admin123"),  # Mot de passe: admin123
            full_name="Administrateur Système",
            role_id=admin_role.role_id
        )
        db.add(admin)
        print(f"\n✅ Admin créé:")
        print(f"   Username: {admin_username}")
        print(f"   Password: admin123")
    else:
        print(f"\nℹ️  Admin '{admin_username}' existe déjà")
    
    # Utilisateur Professeur
    professor_username = "prof.larbi"
    existing_prof = db.query(User).filter(User.username == professor_username).first()
    
    if not existing_prof:
        professor = User(
            username=professor_username,
            password_hash=get_password_hash("prof123"),  # Mot de passe: prof123
            full_name="Prof.  larbi",
            role_id=professor_role.role_id
        )
        db.add(professor)
        print(f"\n✅ Professeur créé:")
        print(f"   Username: {professor_username}")
        print(f"   Password: prof123")
    else:
        print(f"\nℹ️  Professeur '{professor_username}' existe déjà")
    
    # Deuxième professeur
    professor2_username = "prof.3abas"
    existing_prof2 = db.query(User).filter(User.username == professor2_username).first()
    
    if not existing_prof2:
        professor2 = User(
            username=professor2_username,
            password_hash=get_password_hash("prof123"),  # Mot de passe: prof123
            full_name="Prof.  3abas",
            role_id=professor_role.role_id
        )
        db.add(professor2)
        print(f"\n✅ Professeur créé:")
        print(f"   Username: {professor2_username}")
        print(f"   Password: prof123")
    else:
        print(f"\nℹ️  Professeur '{professor2_username}' existe déjà")
    
    db.commit()
    print("\n" + "="*50)
    print("🎉 Utilisateurs de test créés avec succès!")
    print("="*50)


def main():
    """Fonction principale"""
    print("="*50)
    print("Création des utilisateurs de test")
    print("="*50)
    
    try:
        # Créer les tables si elles n'existent pas
        Base.metadata.create_all(bind=engine)
        
        # Créer une session
        db = SessionLocal()
        
        try:
            # Créer les rôles
            print("\n📋 Création des rôles...")
            create_roles(db)
            
            # Créer les utilisateurs de test
            print("\n👥 Création des utilisateurs...")
            create_test_users(db)
            
            print("\n✨ Vous pouvez maintenant vous connecter avec:")
            print("\n1. Admin:")
            print("   - Username: admin")
            print("   - Password: admin123")
            print("\n2. Professeur 1:")
            print("   - Username: prof.larbi")
            print("   - Password: prof123")
            print("\n3. Professeur 2:")
            print("   - Username: prof.3abas")
            print("   - Password: prof123")
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

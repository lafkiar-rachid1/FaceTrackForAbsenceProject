"""
Script pour supprimer et recréer les utilisateurs de test
"""
import sys
from sqlalchemy.orm import Session
from database.connection import engine, SessionLocal
from models.database_models import Base, Role, User
from utils.security import get_password_hash


def delete_test_users(db: Session):
    """Supprimer les utilisateurs de test existants"""
    usernames = ["admin", "prof.larbi", "prof.3abas"]
    
    for username in usernames:
        user = db.query(User).filter(User.username == username).first()
        if user:
            db.delete(user)
            print(f"🗑️  Utilisateur '{username}' supprimé")
    
    db.commit()
    print("\n✅ Anciens utilisateurs supprimés")


def create_roles(db: Session):
    """Créer les rôles de base"""
    roles_data = [
        {"role_name": "admin"},
        {"role_name": "prof"},
        {"role_name": "student"}
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
    """Créer des utilisateurs de test avec la bonne version de bcrypt"""
    
    # Récupérer les rôles
    admin_role = db.query(Role).filter(Role.role_name == "admin").first()
    professor_role = db.query(Role).filter(Role.role_name == "prof").first()
    
    if not admin_role or not professor_role:
        print("❌ Erreur: Les rôles n'existent pas. Créez-les d'abord.")
        return
    
    print(f"\n📝 Hachage des mots de passe avec bcrypt...")
    
    # Utilisateur Admin
    admin_username = "admin"
    admin = User(
        username=admin_username,
        password_hash=get_password_hash("admin123"),
        full_name="Administrateur Système",
        role_id=admin_role.role_id
    )
    db.add(admin)
    print(f"\n✅ Admin créé:")
    print(f"   Username: {admin_username}")
    print(f"   Password: admin123")
    
    # Professeur 1
    professor_username = "prof.larbi"
    professor = User(
        username=professor_username,
        password_hash=get_password_hash("prof123"),
        full_name="Prof. Larbi",
        role_id=professor_role.role_id
    )
    db.add(professor)
    print(f"\n✅ Professeur créé:")
    print(f"   Username: {professor_username}")
    print(f"   Password: prof123")
    
    # Professeur 2
    professor2_username = "prof.3abas"
    professor2 = User(
        username=professor2_username,
        password_hash=get_password_hash("prof123"),
        full_name="Prof. 3abas",
        role_id=professor_role.role_id
    )
    db.add(professor2)
    print(f"\n✅ Professeur créé:")
    print(f"   Username: {professor2_username}")
    print(f"   Password: prof123")
    
    db.commit()
    print("\n" + "="*50)
    print("🎉 Utilisateurs recréés avec succès!")
    print("="*50)


def main():
    """Fonction principale"""
    print("="*50)
    print("Réinitialisation des utilisateurs de test")
    print("="*50)
    
    try:
        # Créer une session
        db = SessionLocal()
        
        try:
            # Supprimer les anciens utilisateurs
            print("\n🔄 Suppression des anciens utilisateurs...")
            delete_test_users(db)
            
            # Créer les rôles
            print("\n📋 Vérification des rôles...")
            create_roles(db)
            
            # Créer les nouveaux utilisateurs
            print("\n👥 Création des nouveaux utilisateurs...")
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
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

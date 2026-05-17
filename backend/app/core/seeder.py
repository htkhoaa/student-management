from app.db.session import SessionLocal
from app.models.user_model import User
from app.models.constant import GenderType, UserRole
from app.models.class_model import Class
from app.models.student_model import Student
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
import logging

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_classes(db: Session):
    logger.info("🚀 Seeding Classes...")
    class_names = []
    for x in range(21, 26):
        for i in range(1, 4):
            class_names.append(f"{x}PFIEV{i}")
    class_names.sort()

    for name in class_names:
        if not db.query(Class).filter(Class.name == name).first():
            db.add(Class(name=name))

    db.commit()
    logger.info("✅ Seeded classes successfully")


def seed_users_and_students(db: Session):
    logger.info("🚀 Seeding data Users and Students...")

    # 1. Admin cố định
    if not db.query(User).filter(User.username == "admin").first():
        db.add(User(
            username="admin",
            email="admin@dut.edu.vn",
            password_hash=get_password_hash("admin"),
            role=UserRole.ADMIN,
            is_active=True
        ))

    available_classes = db.query(Class).order_by(Class.name).all()
    if not available_classes:
        logger.error("❌ Not found any class.")
        return

    students_data = [
        ("Albert Einstein", "123230001"), ("Marie Curie", "123230002"), ("Isaac Newton", "123230003"),
        ("Nikola Tesla", "123230004"), ("Leonardo da Vinci", "123230005"), ("Charles Darwin", "123230006"),
        ("Stephen Hawking", "123230007"), ("Steve Jobs", "123230008"), ("Bill Gates", "123230009"),
        ("Elon Musk", "123230010"), ("Alan Turing", "123230011"), ("Ada Lovelace", "123230012"),
        ("Galileo Galilei", "123230013"), ("Thomas Edison", "123230014"), ("Alexander Fleming", "123230015"),
        ("Louis Pasteur", "123230016"), ("Sigmund Freud", "123230017"), ("Aristotle", "123230018"),
        ("Plato", "123230019"), ("Socrates", "123230020"), ("Johannes Kepler", "123230021"),
        ("Max Planck", "123230022"), ("Richard Feynman", "123230023"), ("Enrico Fermi", "123230024"),
        ("Niels Bohr", "123230025"), ("Werner Heisenberg", "123230026"), ("Edwin Hubble", "123230027"),
        ("Carl Sagan", "123230028"), ("Gregor Mendel", "123230029"), ("James Clerk Maxwell", "123230030"),
        ("Michael Faraday", "123230031"), ("Dmitri Mendeleev", "123230032"), ("John von Neumann", "123230033"),
        ("Claude Shannon", "123230034"), ("Grace Hopper", "123230035"), ("Tim Berners-Lee", "123230036"),
        ("Linus Torvalds", "123230037"), ("Jeff Bezos", "123230038"), ("Mark Zuckerberg", "123230039"),
        ("Warren Buffett", "123230040"), ("Nelson Mandela", "123230041"), ("Mahatma Gandhi", "123230042"),
        ("Martin Luther King", "123230043"), ("Abraham Lincoln", "123230044"), ("Winston Churchill", "123230045"),
        ("Napoleon Bonaparte", "123230046"), ("Julius Caesar", "123230047"), ("Marco Polo", "123230048"),
        ("Christopher Columbus", "123230049"), ("Ferdinand Magellan", "123230050"), ("James Watt", "123230051"),
        ("Alessandro Volta", "123230052"), ("Andre-Marie Ampere", "123230053"), ("Georg Ohm", "123230054"),
        ("Heinrich Hertz", "123230055"), ("Benjamin Franklin", "123230056"), ("Nikolaus Otto", "123230057"),
        ("Rudolf Diesel", "123230058"), ("Karl Benz", "123230059"), ("Henry Ford", "123230060"),
        ("Wright Brothers", "123230061"), ("Neil Armstrong", "123230062"), ("Yuri Gagarin", "123230063"),
        ("Buzz Aldrin", "123230064"), ("Roald Amundsen", "123230065"), ("Robert Peary", "123230066"),
        ("Ernest Shackleton", "123230067"), ("Edmund Hillary", "123230068"), ("Tenzing Norgay", "123230069"),
        ("Jacques Cousteau", "123230070"), ("Charles Babbage", "123230071"), ("John Nash", "123230072"),
        ("Blaise Pascal", "123230073"), ("Rene Descartes", "123230074"), ("Gottfried Leibniz", "123230075"),
        ("Euclid", "123230076"), ("Archimedes", "123230077"), ("Pythagoras", "123230078"), ("Hypatia", "123230079"),
        ("Rosalind Franklin", "123230080"), ("Katherine Johnson", "123230081"), ("Margaret Hamilton", "123230082"),
        ("Joan of Arc", "123230083"), ("Queen Elizabeth I", "123230084"), ("Queen Victoria", "123230085"),
        ("Catherine the Great", "123230086"), ("Cleopatra", "123230087"), ("Nefertiti", "123230088"),
        ("Alexander the Great", "123230089"), ("Genghis Khan", "123230090"), ("Sun Tzu", "123230091"),
        ("Confucius", "123230092"), ("Lao Tzu", "123230093"), ("Buddha", "123230094"), ("Akbar the Great", "123230095"),
        ("Ashoka the Great", "123230096"), ("Simon Bolivar", "123230097"), ("George Washington", "123230098"),
        ("Thomas Jefferson", "123230099"), ("John Adams", "123230100"), ("James Madison", "123230101"),
        ("James Monroe", "123230102"), ("Andrew Jackson", "123230103"), ("Franklin Roosevelt", "123230104"),
        ("Harry Truman", "123230105"), ("Dwight Eisenhower", "123230106"), ("John Kennedy", "123230107"),
        ("Lyndon Johnson", "123230108"), ("Richard Nixon", "123230109"), ("Ronald Reagan", "123230110"),
        ("Barack Obama", "123230111"), ("Rosa Parks", "123230112"), ("Malcolm X", "123230113"),
        ("Mother Teresa", "123230114"), ("Dalai Lama", "123230115"), ("Desmond Tutu", "123230116"),
        ("Kofi Annan", "123230117"), ("Malala Yousafzai", "123230118"), ("Indira Gandhi", "123230119"),
        ("Margaret Thatcher", "123230120"), ("Che Guevara", "123230121"), ("Fidel Castro", "123230122"),
        ("Ho Chi Minh", "123230123"), ("Vo Nguyen Giap", "123230124"), ("Jawaharlal Nehru", "123230125"),
        ("Mustafa Kemal Ataturk", "123230126"), ("Charles de Gaulle", "123230127"), ("Otto von Bismarck", "123230128"),
        ("Sun Yat-sen", "123230129"), ("Mao Zedong", "123230130"), ("Deng Xiaoping", "123230131"),
        ("Hideki Tojo", "123230132"), ("Emperor Hirohito", "123230133"), ("Queen Nefertari", "123230134"),
        ("Ramses II", "123230135"), ("Hammurabi", "123230136"), ("Cyrus the Great", "123230137"),
        ("Darius the Great", "123230138"), ("Hannibal Barca", "123230139"), ("Spartacus", "123230140"),
        ("William the Conqueror", "123230141"), ("Richard the Lionheart", "123230142"), ("Saladin", "123230143"),
        ("Joan of Arc", "123230144"), ("Isabella I", "123230145"), ("Hernan Cortes", "123230146"),
        ("Francisco Pizarro", "123230147"), ("Vasco da Gama", "123230148"), ("Amerigo Vespucci", "123230149"),
        ("James Cook", "123230150"), ("Roald Dahl", "123230151"), ("Ernest Hemingway", "123230152"),
        ("Mark Twain", "123230153"), ("William Shakespeare", "123230154"), ("Charles Dickens", "123230155"),
        ("Leo Tolstoy", "123230156"), ("Fyodor Dostoevsky", "123230157"), ("Victor Hugo", "123230158"),
        ("Johann Wolfgang von Goethe", "123230159"), ("Dante Alighieri", "123230160"), ("Homer", "123230161"),
        ("Virgil", "123230162"), ("Hans Christian Andersen", "123230163"), ("Brothers Grimm", "123230164"),
        ("Lewis Carroll", "123230165"), ("J.R.R. Tolkien", "123230166"), ("C.S. Lewis", "123230167"),
        ("Agatha Christie", "123230168"), ("Arthur Conan Doyle", "123230169"), ("Stephen King", "123230170"),
        ("Ludwig van Beethoven", "123230171"), ("Wolfgang Amadeus Mozart", "123230172"),
        ("Johann Sebastian Bach", "123230173"), ("Pyotr Ilyich Tchaikovsky", "123230174"),
        ("Frederic Chopin", "123230175"), ("Claude Debussy", "123230176"), ("Richard Wagner", "123230177"),
        ("Giuseppe Verdi", "123230178"), ("Igor Stravinsky", "123230179"), ("Louis Armstrong", "123230180"),
        ("Elvis Presley", "123230181"), ("John Lennon", "123230182"), ("Paul McCartney", "123230183"),
        ("Michael Jackson", "123230184"), ("Bob Dylan", "123230185"), ("Freddie Mercury", "123230186"),
        ("David Bowie", "123230187"), ("Jimi Hendrix", "123230188"), ("Miles Davis", "123230189"),
        ("Charlie Chaplin", "123230190"), ("Walt Disney", "123230191"), ("Alfred Hitchcock", "123230192"),
        ("Steven Spielberg", "123230193"), ("Stanley Kubrick", "123230194"), ("Akira Kurosawa", "123230195"),
        ("Orson Welles", "123230196"), ("Pablo Picasso", "123230197"), ("Vincent van Gogh", "123230198"),
        ("Claude Monet", "123230199"), ("Salvador Dali", "123230200"), ("Michelangelo", "123230201")
    ]

    for i, (name, username) in enumerate(students_data):
        email = f"{username}@dut.edu.vn"

        if not db.query(User).filter(User.username == username).first():
            target_class = available_classes[i % len(available_classes)]

            new_student = Student(
                full_name=name,
                email=email,
                gender=GenderType.MALE if i % 2 == 0 else GenderType.FEMALE,
                phone=f"0905{100000 + i}",
                class_id=target_class.id
            )
            db.add(new_student)
            db.flush()

            db.add(User(
                username=username,
                email=email,
                password_hash=get_password_hash("student"),
                role=UserRole.STUDENT,
                student_id=new_student.id,
                is_active=True
            ))

    db.commit()
    logger.info("✅ Seeded students successfully!")

def run_seed():
    db = SessionLocal()
    try:
        seed_classes(db)
        seed_users_and_students(db)
        logger.info("🌟 SEEDING COMPLETED SUCCESSFULLY!")
    except Exception as e:
        logger.error(f"❌ Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
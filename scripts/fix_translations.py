import os
import re

# Definiamo i pattern da correggere.
# Il testo nei compendi di D&D 5e si rivolge tipicamente al personaggio in seconda persona (tu/tuo),
# ma la traduzione automatica usa spesso la terza persona o terza persona plurale
replacements = [
    (r"\bal proprio lavoro\b", "al tuo lavoro"),
    (r"\bil loro addestramento\b", "il tuo addestramento"),
    (r"\bi propri doveri\b", "i tuoi doveri"),
    (r"\bil proprio coinvolgimento\b", "il tuo coinvolgimento"),
    (r"\bla propria incolumità\b", "la tua incolumità"),
    (r"\bdedicare la propria vita\b", "dedicare la tua vita"),
    (r"\buna propria bottega\b", "una tua bottega"),
    (r"\ble proprie preferenze\b", "le tue preferenze"),
    (r"\bfacendo le proprie azioni\b", "compiendo le tue azioni"),
    
    (r"\bil loro lato politico\b", "il tuo schieramento politico"),
    (r"\bil loro status\b", "il tuo status"),
    (r"\bal loro campo\b", "al tuo campo"),
    (r"\bdal loro oggetto preferito\b", "dal tuo strumento preferito"),
    (r"\balle loro vette\b", "alle tue vette"),
    (r"\bloro guadagnano 1 punto\b", "ottieni 1 punto"),
    (r"\bdei propri superiori\b", "dei tuoi superiori"),

    # Phrase specific errors found in Carrere
    (r"\bcreazioni di fabbro\b", "lavori di forgiatura"),
    (r"\bpiù pretenziosi\b", "più esigenti"),
    (r"\bpurché forniscano\b", "purché tu fornisca"),
    (r"\bnon cumuli\b", "non puoi cumulare"),
    (r"\bSe eri\b", "Se sei"),
    (r"\buna spiegazione del gioco di ruolo\b", "una spiegazione interpretativa"),
    (r"\blo strumento in cui hai\b", "lo strumento da artigiano in cui hai"),
    (r"\bdiventa quello preferito\b", "diventa il tuo preferito"),

    # Naming translation fixes
    (r"\"value\": \"Ventura:", '"value": "Impresa:'),
    (r"\"name\": \"Ventura:", '"name": "Impresa:'),
    (r"\bVenturiero\b", "Avventuriero"),
    (r"\bConfraternita dei Morti\b", "Confraternita dei Mortificati"),
    (r"\bScoundrel Lavoro\b", "Lavoro della Canaglia"),
    (r"\"name\": \"Truffatore\"", '"name": "Canaglia"'),
    (r"\"name\": \"Furfante\"", '"name": "Ladro"'),
    (r"\"name\": \"Geniere\"", '"name": "Sminatore"'),
    (r"\"name\": \"Sminatore\"", '"name": "Geniere"'), # No wait, Geniere is probably correct. Let's not touch Sapper unless Need Games used something else. Actually 'Geniere' is a common and correct translation.
    (r"\bLe forniture di Alchemist\b", "Strumenti da Alchimista"),
    (r"\bScala del Merchant\b", "Bilancia da Mercante"),
    (r"\bWagon di Merchant\b", "Carro da Mercante"),
    (r"\bSpecializzazione Sapper\b", "Specializzazione del Geniere"),
    (r"\bPacchetto Explorer\b", "Dotazione da Esploratore"),
    (r"\bSenso di bestia\b", "Senso Bestiale"),
    (r"\"name\": \"Beast Bond\"", '"name": "Legame Bestiale"'),
    (r"\"name\": \"Summon Beast\"", '"name": "Evoca Bestia"'),
    (r"\"name\": \"Summon guerriero Spirito\"", '"name": "Evoca Spirito Guerriero"'),
    (r"\bfede guerriero\b", "Guerriero della Fede"),
    (r"\bGuerriero della Fierce\b", "Guerriero Feroce"),
    (r"\bMiglioramento del punteggio di capacità\b", "Aumento dei Punteggi di Caratteristica"),
    (r"\bAttacco extra\b", "Attacco Extra"),
    (r"\bPronti per Avventura\b", "Pronto all'Avventura"),
    (r"\bEsploratore nato\b", "Esploratore Nato"),
    (r"\bPotere alchimico\b", "Potere Alchemico"),
    (r"\"name\": \"Le forniture di Alchemist\"", '"name": "Strumenti da Alchimista"'),
]

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for pattern, subst in replacements:
        # Usa case insensitive per match come "Il loro status" 
        content = re.sub(pattern, subst, content, flags=re.IGNORECASE)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    base_dir = "./src/packs"
    count = 0
    # Processa solo file JSON nelle cartelle _it o -it
    for root, dirs, files in os.walk(base_dir):
        if "-it" in root or "_it" in root:
            for file in files:
                if file.endswith(".json"):
                    if fix_file(os.path.join(root, file)):
                        count += 1
    print(f"Fixed {count} files.")

if __name__ == "__main__":
    main()

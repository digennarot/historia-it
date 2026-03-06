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
    (r"\bStrusto\b", "Astuto"),
    (r"\bcome se fossi erano\b", "come se fossi"),
    (r"\bscorrimento magico\b", "pergamena magica"),
    (r"\bun colpo morire\b", "un Dado Vita"),
    (r"\bogni morire si spende\b", "ogni Dado Vita speso"),
    (r"\bnd rimuove\b", "e rimuove"),
    (r"\bd'arma ranged\b", "con arma a distanza"),
    (r"\bprende (\d+d\d+) danni\b", r"subisce \g<1> danni"),
    (r"\bnimbly wielded\b", "brandito agilmente"),
    (r"\bcolpire lethally\b", "colpire letalmente"),
    (r"\bpunti di colpo\b", "Punti Ferita"),
    (r"\bquando imbibed\b", "quando ingerito"),
    (r"\bo amministrato\b", "o somministrato"),
    (r"\bcondizioni ammalate\b", "le malattie"),
    (r"\bfase bianc\b", "fase albedo"),
    
    # Missing spaces around HTML tags
    (r"</span>(?=[a-zA-Z])", "</span> "),
    (r"</em>(?=[a-zA-Z])", "</em> "),
    (r"</strong>(?=[a-zA-Z])", "</strong> "),
    (r"(?<=[a-zA-Z])<span\b", " <span"),
    (r"(?<=[a-zA-Z])<em\b", " <em"),
    (r"(?<=[a-zA-Z])<strong\b", " <strong"),

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
    
    # D&D 5e Terminology fixes
    (r"\bcontrollo di abilità\b", "prova di caratteristica"),
    (r"\b(t|T)iro di attacco\b", r"\1iro per colpire"),
    (r"\b(r|R)otolo di attacco\b", r"\1iro per colpire"),
    (r"\bcolpo rotolo\b", "tiro per colpire"),
    (r"\battacco ranged\b", "attacco a distanza"),
    (r"\barma ranged\b", "arma a distanza"),
    (r"\b(t|T)iro di salvataggio\b", r"\1iro salvezza"),
    (r"\bsalvare gettare\b", "tiro salvezza"),
    (r"\bsalvando tiro\b", "tiro salvezza"),
    (r"\bsalvataggio fallito\b", "tiro salvezza fallito"),
    (r"\bsalvataggio di successo\b", "tiro salvezza superato"),
    (r"\bfare un tiro salvezza\b", "effettuare un tiro salvezza"),
    (r"\bTiro Salvezza della (Costituzione|Forza|Saggezza|Intelligenza|Destrezza|Carisma|Charisma)\b", r"Tiro Salvezza su \1"),
    (r"\bTiro Salvezza di (Costituzione|Forza|Saggezza|Intelligenza|Destrezza|Carisma|Charisma)\b", r"Tiro Salvezza su \1"),
    (r"\b(c|C)antrip\b", r"\1rucchetto"),
    (r"\bscanalatura di incantesimo\b", "slot incantesimo"),
    (r"\bscanalature di incantesimi\b", "slot incantesimo"),
    (r"\bfessura incantesimo\b", "slot incantesimo"),
    (r"\brotola un\b", "tira un"),
    (r"\brotolare\b", "tirare"),
    (r"\b(un|Un) (breve|lungo) riposo\b", r"\1 riposo \2"),
    (r"\bazione in più\b", "azione bonus"),
    
    # Deep Terminology fixes
    (r"\b(t|T)empo di fusione\b", r"\1empo di lancio"),
    (r"\b(t|T)empo di colata\b", r"\1empo di lancio"),
    (r"\b(t|T)empo di lancio dell'azione\b", r"\1empo di lancio"),
    (r"\bfondere( un)? incantesimo\b", "lanciare un incantesimo"),
    (r"\bcolare incantesimi\b", "lanciare incantesimi"),
    (r"\bgettare l'incantesimo\b", "lanciare l'incantesimo"),
    (r"\bgettano un incantesimo\b", "lanciano un incantesimo"),
    (r"\b(l|L)ivell(o|i) di esaurimento\b", r"\1ivell\2 di sfinimento"),
    (r"\bcadere incline\b", "cadere a terra prono"),
    (r"\bè incline\b", "è prono"),
    (r"\b(c|C)ondizione limitata\b", r"\1ondizione trattenuto"),
    (r"\bazione (Dash|Scatto)\b", "azione di Scatto"),
    (r"\bazione Disengage\b", "azione di Disimpegno"),
    (r"\bnel tuo giro\b", "nel tuo turno"),
    (r"\bper un giro\b", "per un turno"),
    (r"\bfino al prossimo giro\b", "fino al prossimo turno"),
    (r"\balla fine del giro\b", "alla fine del turno"),
    (r"\bsui giri successivi\b", "nei turni successivi"),
    (r"\bciascuno dei vostri giri\b", "ciascuno dei vostri turni"),
    (r"\bl'obiettivo\b", "il bersaglio"),
    (r"\bL'obiettivo\b", "Il bersaglio"),
    (r"\bun obiettivo\b", "un bersaglio"),
    (r"\bqualsiasi obiettivo\b", "qualsiasi bersaglio"),
    (r"\bgli obiettivi\b", "i bersagli"),
    (r"\b(p|P)unto di successo\b", r"\1unto Ferita"),
    (r"\b(p|P)unti di successo\b", r"\1unti Ferita"),
    (r"\b(p|P)unto di impatto\b", r"\1unto Ferita"),
    (r"\b(p|P)unti per colpire\b", r"\1unti Ferita"),
    (r"\b(l|L)ancio di risparmio\b", r"\1iro salvezza"),
    (r"\b(a|A)rma marziale\b", r"\1rma da guerra"),
    (r"\b(a|A)rmi marziali\b", r"\1rmi da guerra"),
    (r"\b(t|T)iro salvatore\b", r"\1iro salvezza"),
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

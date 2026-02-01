# Validierung der Implementierung

Du hast die Aufgabe zu validieren, dass ein Implementierungsplan korrekt ausgeführt wurde. Überprüfe alle Erfolgskriterien und identifiziere Abweichungen oder Probleme.

## Initiales Setup

Wenn aufgerufen:
1. **Kontext bestimmen** – Befindest du dich in einer bestehenden Konversation oder startest du frisch?
   - Falls bestehend: Überprüfe, was in dieser Sitzung implementiert wurde.
   - Falls frisch: Ermittle durch Codebasis-Analyse, was umgesetzt wurde.

2. **Finde den Plan**:
   - Wenn ein Plan-Pfad angegeben ist, nutze diesen.

## Validierungsprozess

### Schritt 1: Kontextanalyse

Wenn du frisch beginnst oder mehr Kontext brauchst:

1. **Lese den Implementierungsplan** vollständig.
2. **Identifiziere, was sich geändert haben sollte**:
   - Liste alle Dateien auf, die geändert sein sollten.
   - Notiere alle Erfolgskriterien (automatisiert und manuell).
   - Bestimme die Schlüsselfunktionalitäten, die überprüft werden müssen.

3. **Starte Recherche-Aufgaben**, um die Implementierung zu überprüfen:
   ```
   Aufgabe 1 – Datenbankänderungen verifizieren:
   Prüfe, ob Migration [N] hinzugefügt wurde und ob Schemaänderungen dem Plan entsprechen.
   Check: Migrationsdateien, Schema-Version, Tabellenstruktur
   Ergebnis: Umgesetztes vs. im Plan spezifiziertes

   Aufgabe 2 – Codeänderungen verifizieren:
   Finde alle geänderten Dateien im Zusammenhang mit [Feature].
   Vergleiche tatsächliche Änderungen mit den Planspezifikationen.
   Ergebnis: Datei-für-Datei-Vergleich
   ```

### Schritt 2: Systematische Validierung

Für jede Phase im Plan:

1. **Abschlussstatus prüfen**:
   - Suche nach Checkmarks im Plan (`- [x]`).
   - Verifiziere, dass der tatsächliche Code den markierten Abschluss widerspiegelt.

2. **Manuelle Kriterien bewerten**:
   - Liste, was manuell getestet werden muss.
   - Gib klare Schritte für die Benutzerverifikation an.

3. **Gründlich über Edge Cases nachdenken**:
   - Wurden Fehlerbedingungen behandelt?
   - Fehlen Validierungen?
   - Könnte die Implementierung bestehende Funktionalität brechen?

### Schritt 3: Validierungsbericht erstellen

Erstelle eine umfassende Validierungszusammenfassung:

```markdown
## Validierungsbericht: [Plan-Name]

### Implementierungsstatus
✓ Phase 1: [Name] – Vollständig implementiert
✓ Phase 2: [Name] – Vollständig implementiert
⚠️ Phase 3: [Name] – Teilweise implementiert (siehe Probleme)

### Ergebnisse der automatisierten Verifikation
✓ Build erfolgreich: `make build`
✓ Tests erfolgreich: `make test`
✗ Linting-Probleme: `make lint` (3 Warnungen)

### Code Review Ergebnisse

#### Entspricht dem Plan:
- Datenbankmigration fügt [Tabelle] korrekt hinzu
- API-Endpunkte implementieren spezifizierte Methoden
- Fehlerbehandlung folgt dem Plan

#### Abweichungen vom Plan:
- Andere Variablennamen in [file:line] genutzt
- Zusätzliche Validierung in [file:line] hinzugefügt (Verbesserung)

#### Potenzielle Probleme:
- Fehlender Index auf Fremdschlüssel könnte Performance beeinträchtigen
- Kein Rollback in Migration implementiert

### Manuelle Tests erforderlich:
1. UI-Funktionalität:
   - [ ] Überprüfen, dass [Feature] korrekt angezeigt wird
   - [ ] Fehlerfälle mit ungültigen Eingaben testen

2. Integration:
   - [ ] Funktion mit bestehendem [Komponente] bestätigen
   - [ ] Performance mit großen Datenmengen prüfen

### Empfehlungen:
- Linting-Warnungen vor dem Merge beheben
- Integrationstest für [Szenario] hinzufügen
- Neue API-Endpunkte dokumentieren
```

## Arbeiten mit bestehendem Kontext

Wenn du Teil der Implementierung warst:
- Überprüfe die Gesprächshistorie
- Sieh dir deine Todo-Liste an
- Fokussiere die Validierung auf die in dieser Sitzung umgesetzte Arbeit
- Sei ehrlich über Abkürzungen oder unvollständige Punkte

## Wichtige Richtlinien

1. **Gründlich, aber pragmatisch sein** – Fokus auf das Wesentliche
2. **Alles dokumentieren** – Erfolge und Probleme
3. **Kritisch denken** – löst die Implementierung wirklich das Problem?
4. **Wartbarkeit berücksichtigen** – ist die Lösung langfristig tragfähig?

## Validierungs-Checkliste

Immer überprüfen:
- [ ] Alle als abgeschlossen markierten Phasen sind wirklich erledigt
- [ ] Code folgt bestehenden Mustern
- [ ] Keine Regressionen eingeführt
- [ ] Fehlerbehandlung ist robust
- [ ] Dokumentation wurde bei Bedarf aktualisiert
- [ ] Manuelle Testschritte sind klar beschrieben

## Beziehung zu anderen Befehlen

---

Remember: Good validation catches issues before they reach production. Be constructive but thorough in identifying gaps or improvements.
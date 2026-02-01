# Research Codebase

Untersuche die Codebasis umfassend und dokumentiere alle relevanten Stellen, die im Zusammenhang mit der Benutzerfrage stehen. Formuliere die User Query / das Problem verständlich und übersichtlich.
Zusätzlich zur **User Query** wird ein **ausgearbeitetes Konzept** (Kontext-Dump, Architekturplan, Vorentscheidungen) übergeben, das du bei deiner Analyse berücksichtigen sollst.

---

## Eingaben
- **User Query:** Die konkrete Forschungsfrage, die beantwortet werden soll  
- **Research Context** Ausgearbeitetes Konzept oder Vorüberlegungen, die als Hintergrund und Leitplanken dienen  

---

## Arbeite folgende Schritte ab

### 1. Verwende das “Read File” Tool um alle Dateien, die direkt erwähnt werden auszulesen
Wenn der Benutzer bestimmte Dateien (Dokumente, JSON, Docs) erwähnt, lesen Sie diese zuerst vollständig
- So stellst du sicher, dass du den vollständigen Kontext hast, bevor du die Recherche in einzelne Schritte zerlegst.
- Kontext: überprüfe beim Lesen, wie sich der Code zu den gegebenen Konzepten verhält.

### 2. Zerlege die Frage in konkrete Code-Bereiche, die untersucht werden müssen — ohne Bewertung oder Lösung:
- Zerlege die Anfrage des Nutzers in klar abgrenzbare Forschungsbereiche
- Nimm dir Zeit für tiefgehendes Nachdenken über zugrunde liegende Muster, Zusammenhänge und architektonische Implikationen, die der Nutzer möglicherweise sucht
- Identifiziere spezifische Komponenten, Muster oder Konzepte, die untersucht werden sollten
- Erstelle eine Liste der Teilbereiche oder Dateien, die zur Beantwortung der Frage untersucht werden sollten.
- Überlege, welche Verzeichnisse, Dateien oder Architektur-Muster relevant sind
- Berücksichtige dabei explizit den übergebenen Research Context  
- Überprüfe: Wo unterstützt der Code die Konzeptideen? Wo widerspricht er? Wo muss man anpassen?

### 3. Arbeite Schritt für Schritt diese Teil-Rechercheaufgaben ab
- Stelle Verbindungen zwischen Query, Codebasis und Konzept her
**Konzentriere dich auf**
- WO befinden sich die relevanten Dateien und Komponenten
- WIE funktioniert bestimmter Code
- Welche Beispiele mit ähnlicher Implementation findest du?

### 4. Fasse die Ergebnisse zusammen und erstelle ein Research Document erstellen

- Speichere ein Markdown File in documentation/Jan/Research/. 
- Dokumentiere relevante Code-Stellen und deren Beziehungen (z. B. welche Komponenten sich gegenseitig aufrufen).
- Füge zur Referenz spezifische Dateipfade und Zeilennummern hinzu.
- Füge einen Abschnitt *"Context Considerations"* hinzu, in dem du darstellst, wie das ausgearbeitete Konzept berücksichtigt werden kann.
- File Naming Convention: short and concise; kebab-case
- Verwende Folgendes Format

```markdown
# Research: [User's Question/Topic]

## Research Question
[Beschreibe das Problem]

## Detailed Findings

### [Component/Area 1]
- Finding with reference ([file.ext:line](link))
- Connection to other components
- Implementation details

### [Component/Area 2]
...

## Context Considerations
- [Wie beeinflusst der Research Context die Analyse?]
- [Wo bestätigt der Code das Konzept?]
- [Wo gibt es Abweichungen oder offene Punkte?]

## Code References
- `path/to/file.py:123` - Description of what's there
- `another/file.ts:45-67` - Description of the code block

## Architecture Insights
[Patterns, conventions, and design decisions discovered]


## Open Questions
[Any areas that need further investigation]
```

### 5.  Folgefrage bearbeiten

- Wenn der Nutzer Folgefragen hat, diese im selben Research-Dokument ergänzen
- Einen neuen Abschnitt hinzufügen: ## Follow-up Research
- Continue updating the document

## Wichtige Hinweise:
- Führe stets eine neue Codebase-Analyse durch – verlasse dich niemals ausschließlich auf bestehende Research-Dokumente.
- Focus on finding concrete file paths and line numbers for developer reference
- Du solltest dich auf read-only operations konzentrieren
- Consider cross-component connections and architectural patterns
- NEVER write the research document with placeholder values

Ich bin mir sicher du schaffst das, bei erfolgreicher Erstellung des Research Papers, bekommst du Trinkgeld

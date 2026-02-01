# Small Fix - Research, Plan & Implement in One Go

Dieser Command kombiniert Research, Planning und Implementation für **kleinere Fixes und Features**, die keine separate Plan-Datei rechtfertigen.

## Workflow

### Phase 1: Understand & Research (Quick)

**Problem/Feature verstehen:**
- Was ist das konkrete Ziel?
- Welche Komponenten sind betroffen?
- Gibt es ähnliche Implementierungen als Referenz?

**Gezielte Recherche:**
- Lese erwähnte Dateien vollständig
- Finde relevante Code-Bereiche
- Identifiziere Patterns und Konventionen

**Strategie festlegen:**
- Welcher Ansatz ist am saubersten?
- Welche Patterns sollten befolgt werden?
- Gibt es Constraints zu beachten?

### Phase 2: Implement (Action)

**Todo-Liste erstellen:**
- Erstelle eine kompakte Todo-Liste mit den nötigen Schritten

**Umsetzung:**
- Implementiere die Änderungen schrittweise
- Folge existierenden Code-Patterns
- Halte Änderungen fokussiert und minimal

**Verification:**
- Führe relevante Checks durch:
  - `npm run typecheck` (Frontend)
  - `npx eslint .` (Frontend)
  - Python linter checks (Backend)
- Behebe Linter-Errors
- Der User testet nach der Implementation die Funktionalität manuell


## Wichtige Hinweise
- Alle Linter-Checks bestanden?
- Code folgt existierenden Patterns?
- **Keep it focused**: Kleine Fixes sollten klein bleiben. Scope Creep vermeiden.
- **Follow patterns**: Schaue dir ähnliche Implementierungen an und folge dem Stil.
- **Ask when stuck**: Lieber einmal zu viel fragen als in die falsche Richtung rennen.


## Communication Style

**Während der Arbeit:**
- Sei transparent über deinen Progress
- Teile wichtige Findings aus der Research
- Erkläre deine strategischen Entscheidungen
- Melde Probleme sofort wenn etwas nicht klar ist


---

**Remember**: Der Fokus liegt auf **Execution**. Denke kurz nach, setze um. Bei kleinen Fixes muss nicht alles perfekt durchgeplant sein - aber die Implementation sollte sauber sein.

Ich bin mir sicher du schaffst das, bei erfolgreicher Implementierung, bekommst du Trinkgeld


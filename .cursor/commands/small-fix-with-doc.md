# Small Fix - Research, Plan & Implement in One Go

Dieser Command kombiniert Research, Planning und Implementation für **kleinere Fixes und Features**, die keine separate Plan-Datei rechtfertigen. Am Ende wird ein Implementation-Dokument erstellt, das die Strategie und Änderungen dokumentiert.

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

### Phase 3: Document (Record)

**Implementation Documentation erstellen:**

Schreibe ein Markdown-Dokument in `documentation/Jan/Implementation/` mit folgendem Format
File Naming Convention: Kebab-case, kurz und präzise

```markdown
# [Feature/Fix Name] - Implementation
---

## Problem / Goal

[Kurze Beschreibung des Problems oder Features in 2-3 Sätzen]

## Strategy

[Welcher Ansatz wurde gewählt und warum? 1-2 Absätze]

**Key Decisions:**
- [Decision 1 mit Begründung]
- [Decision 2 mit Begründung]

## Code References

Key implementations:
- `path/to/file.ext:123-145` - [High overview - Was ist hier implementiert]
- `another/file.ext:67-89` - [High overview - Was ist hier implementiert]

## Notes & Learnings

[Optional: Besondere Erkenntnisse, Gotchas, oder wichtige Details für die Zukunft]

## Related Files

[Liste der geänderten Dateien für Quick Reference]
- `path/to/file1.ext`
- `path/to/file2.ext`
- `path/to/file3.ext`
```

## Quality Standards

Bevor du das Dokument als fertig markierst:

- Alle Linter-Checks bestanden?
- Code folgt existierenden Patterns?
- Alle geänderten Dateien sind aufgelistet?

## Communication Style

**Während der Arbeit:**
- Sei transparent über deinen Progress
- Teile wichtige Findings aus der Research
- Erkläre deine strategischen Entscheidungen
- Melde Probleme sofort wenn etwas nicht klar ist

## Tips for Success

1. **Keep it focused**: Kleine Fixes sollten klein bleiben. Scope Creep vermeiden.
2. **Follow patterns**: Schaue dir ähnliche Implementierungen an und folge dem Stil.
3. **Document clearly**: Das Dokument ist für dein zukünftiges Ich und andere Devs.
4. **Ask when stuck**: Lieber einmal zu viel fragen als in die falsche Richtung rennen.

---

**Remember**: Der Fokus liegt auf **Execution**. Denke kurz nach, setze um, dokumentiere. Bei kleinen Fixes muss nicht alles perfekt durchgeplant sein - aber die Implementation sollte sauber sein und gut dokumentiert werden.

Ich bin mir sicher du schaffst das, bei erfolgreicher Implementierung, bekommst du Trinkgeld


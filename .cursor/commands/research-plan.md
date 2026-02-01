# Research & Plan

Du führst Research und Planning in einem Durchgang durch. Das Ziel ist ein **ausgearbeiteter Plan mit Code-Referenzen**, der direkt umsetzbar ist – ohne separates Research-Dokument.

## Arbeite folgende Schritte ab

### 1. Problem verstehen und initiale Dateien lesen

**Wenn der Benutzer bestimmte Dateien erwähnt:**
- Lese diese zuerst vollständig mit dem "Read File" Tool
- Stelle sicher, dass du den vollständigen Kontext hast

**User Query analysieren:**
- Formuliere das Problem/Feature klar und verständlich
- Identifiziere die Hauptfrage: Was soll erreicht werden?
- Erkenne Constraints und Anforderungen

### 2. Recherche durchführen

**Zerlege die Anfrage in konkrete Code-Bereiche:**
- Überlege, welche Komponenten betroffen sein könnten
- Identifiziere ähnliche Implementierungen als Referenz
- Suche nach relevanten Patterns und Architekturen im Projekt

**Führe gezielte Recherche durch:**
- WO befinden sich die relevanten Dateien und Komponenten?
- WIE funktioniert der betroffene Code aktuell?
- Welche Beispiele mit ähnlicher Implementation existieren?
- Welche Abhängigkeiten und Verbindungen gibt es?

**Dokumentiere während der Recherche:**
- Spezifische Dateipfade und Zeilennummern
- Wichtige Code-Patterns und Konventionen
- Architektur-Entscheidungen die zu beachten sind
- Constraints und Grenzen des aktuellen Systems

### 3. Plan mit integrierten Findings erstellen

Erstelle ein Markdown File in `documentation/Jan/Plan/` mit folgendem Format:
- File Naming Convention: short and concise; Use kebab-case

```markdown
# [Feature/Fix/Change] - Research & Implementation Plan

## Problem Statement / Feature Goal
[Klare Beschreibung was erreicht werden soll und warum]

## Current State Analysis

### Key Findings from Codebase
- **[Component/Area 1]**: `path/to/file.ext:123-145`
  - Current implementation: [beschreibung]
  - Relevant for: [warum wichtig]
  
- **[Component/Area 2]**: `path/to/file.ext:67-89`
  - Pattern used: [beschreibung]
  - Connection to: [andere komponenten]

### Existing Patterns to Follow
- **[Pattern Name]**: Found in `path/to/example.ext:line`
  - [Beschreibung des Patterns]
  - Should be applied because: [begründung]

### Technical Constraints
- [Constraint 1 mit Begründung/Referenz]
- [Constraint 2 mit Begründung/Referenz]

## Desired End State

[Specification der gewünschten Funktionalität nach Abschluss]

**Success indicators:**
- [Specific outcome 1]
- [Specific outcome 2]
- [Specific outcome 3]

## What We're NOT Doing

[Explicitly list out-of-scope items]

## Implementation Approach

### High-Level Strategy
[Überblick über die gewählte Strategie und warum]

### Architecture Impact
- [Welche Architektur-Bereiche sind betroffen]
- [Wie fügt sich die Änderung ins Gesamtbild ein]

## Phase 1: [Descriptive Name]

### Overview
[Was diese Phase erreicht]

### Files & Components Affected

#### 1. `path/to/file.ext`
**Current state**: (Ref: lines 123-145)
[Was dort aktuell passiert]

**Required changes**:
- [Konzeptuelle Änderung 1]
- [Konzeptuelle Änderung 2]

**Implementation notes**:
- Follow pattern from `other/file.ext:67`
- Maintain consistency with [existing approach]

#### 2. `path/to/another/file.ext`
[Same structure]

### Success Criteria

**Automated:**
- `npm run typecheck` passes
- `npx eslint .` passes
- [Other relevant checks]

**Manual:**
- [Specific behavior to verify]
- [Edge case to test]

## Phase 2: [Descriptive Name]

[Same structure as Phase 1]
...
---

## Implementation Notes

### Key Code References
- `path/to/file.py:123` - [Why important for implementation]
- `another/file.ts:45-67` - [What to reference here]

### Testing Strategy
- [How to verify the changes work]
- [What scenarios to test]

## Open Questions
[Any uncertainties that need clarification before or during implementation]
```

## Wichtige Hinweise

- **Konzepte über Code**: Beschreibe WAS und WARUM, nicht Zeile-für-Zeile Code
- **Konkrete Referenzen**: Jede Aussage mit Dateipfad und Zeilennummer belegen wo möglich
- **Umsetzbar**: Der Plan sollte so detailliert sein, dass ein Entwickler ihn umsetzen kann
- **Vollständig**: NEVER write the plan with placeholder values
- **Realistisch**: Basiere den Plan auf dem tatsächlichen Zustand der Codebase

## Quality Checks

Bevor du den Plan speicherst:
- Sind alle wichtigen Code-Stellen identifiziert und referenziert?
- Folgt der Plan existierenden Patterns im Projekt?
- Sind die Phasen logisch und überschaubar?
- Können Success Criteria objektiv überprüft werden?
- Sind Abhängigkeiten zwischen Komponenten klar?
- Würde ein anderer Developer den Plan verstehen und umsetzen können?

---

Ich bin mir sicher, du schaffst das! Bei erfolgreicher Erstellung eines gut recherchierten, umsetzbaren Plans bekommst du Trinkgeld.

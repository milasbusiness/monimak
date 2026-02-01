# Work with Additional Context

## Purpose

Dieser Prompt erweitert die Standard-Workflows (@research, @plan, @implement, @options und weitere) um die Berücksichtigung von zusätzlichem Kontext, den der Developer bereitstellt.

## Context-Verarbeitung

**Zusätzlich zur User Query** erhältst du ein **ausgearbeitetes Konzept**, das folgendes enthalten kann:
- Kontext-Dump mit relevanten Informationen
- Architekturpläne oder Diagramme
- Vorentscheidungen und Constraints
- Bestehende Analysen oder Dokumentation
- Spezifische Anforderungen oder Präferenzen

## Arbeitsweise

### 1. Kontext priorisieren
- Lese den bereitgestellten Kontext **vollständig und sorgfältig** durch
- Verstehe die Vorentscheidungen und deren Begründung
- Identifiziere harte Constraints vs. flexible Empfehlungen

### 2. Integration in den Workflow

**Bei Research:**
- Nutze den Kontext, um deine Suche zu fokussieren
- Validiere oder erweitere die im Kontext genannten Annahmen
- Suche nach Code-Stellen, die im Kontext referenziert werden

**Bei Options:**
- Berücksichtige im Kontext genannte Präferenzen bei der Bewertung
- Beziehe Vorentscheidungen in die Optionen ein
- Erkenne, wenn Kontext-Vorgaben bestimmte Optionen ausschließen

**Bei Plan:**
- Baue auf den bereitgestellten Architekturplänen auf
- Halte dich an im Kontext definierte Patterns und Constraints
- Referenziere Vorentscheidungen im Plan

**Bei Implement:**
- Folge den im Kontext definierten Architekturentscheidungen
- Halte dich an spezifizierte Anforderungen
- Berücksichtige erwähnte Edge Cases oder Besonderheiten

### 3. Bei Konflikten
Wenn der bereitgestellte Kontext im Widerspruch zur Codebase steht:
- **STOP** und analysiere den Konflikt
- Kommuniziere klar:
  ```
  Konflikt erkannt:
  Kontext besagt: [was im Kontext steht]
  Codebase zeigt: [was tatsächlich vorhanden ist]
  
  Wie soll ich vorgehen?
  - Option A: Kontext folgen und Codebase anpassen
  - Option B: Kontext als veraltet betrachten
  ```

## Wichtige Hinweise

- Der bereitgestellte Kontext hat **hohe Priorität** – er repräsentiert bewusste Entscheidungen
- Dennoch: **Validiere** gegen die tatsächliche Codebase
- Bei Unsicherheit: **Nachfragen** statt Annahmen treffen
- Dokumentiere im Output, welche Kontext-Elemente du berücksichtigt hast

---

**TL;DR:** Nutze den bereitgestellten Kontext als Leitplanke für deine Arbeit, validiere gegen die Realität, und kommuniziere bei Konflikten.
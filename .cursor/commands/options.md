# Explore Solution Options

Du erhältst ein Research-Dokument, eine User Query oder eine Problem-Beschreibung und sollst verschiedene Lösungsansätze evaluieren. Dein Ziel ist es, dem Entwickler einen klaren Überblick über mögliche Optionen zu geben, damit er eine fundierte Entscheidung treffen kann.

## Arbeite folgende Schritte ab

### 1. Problem verstehen und Kontext aufbauen

**Wenn ein Research-Dokument vorhanden ist:**
- Lese das Research-Dokument vollständig durch
- Verstehe die identifizierten Code-Stellen und deren Zusammenhänge
- Nutze die Erkenntnisse als Grundlage für deine Optionen

**Wenn nur eine User Query/Problem-Beschreibung vorhanden ist:**
- Führe eine gezielte Codebase-Suche durch, um relevanten Kontext zu sammeln
- Identifiziere ähnliche Implementierungen im Projekt
- Verstehe die bestehende Architektur in diesem Bereich

### 2. Kontext analysieren und Constraints identifizieren

Bevor du Optionen entwickelst, kläre:
- Welche technischen Constraints gibt es? (bestehende Architektur, verwendete Technologien)
- Welche Business-Anforderungen müssen erfüllt werden?
- Welche bestehenden Patterns sollten befolgt werden?
- Gibt es Performance-, Sicherheits- oder UX-Anforderungen?

### 3. Verschiedene Lösungsansätze entwickeln

Entwickle **3-5 unterschiedliche Optionen**:
- Denke kreativ – von einfachen bis komplexen Lösungen
- Berücksichtige verschiedene Architektur-Ansätze
- Überlege sowohl kurzfristige als auch nachhaltige Lösungen
- Beziehe existierende Patterns im Projekt ein
- Denke an Trade-offs zwischen verschiedenen Ansätzen

**Für jede Option, gebe einen KURZEN Überblick:**
- Wie würde die Implementation grob zusammengefast aussehen?
- Ungefähr welche Dateien/Komponenten wären betroffen?
- Welche Vor- und Nachteile hat dieser Ansatz?
- Wie komplex ist die Umsetzung?
- Wie wartbar ist die Lösung langfristig?
- Gibt es Risiken oder potenzielle Probleme?

### 4. Optionen bewerten und vergleichen

Bewerte jede Option anhand relevanter Kriterien:
- **Complexity**: Wie aufwendig ist die Implementation?
- **Maintainability**: Wie gut lässt sich die Lösung langfristig warten?
- **Performance**: Gibt es Performance-Implikationen?
- **Scalability**: Wie gut skaliert der Ansatz?
- **User Experience**: Wie wirkt sich die Lösung auf die UX aus?
- **Risk**: Welche Risiken birgt dieser Ansatz?
- **Alignment**: Wie gut passt die Lösung zu bestehenden Patterns?

### 5. Options-Dokument erstellen

File Naming Convention
- short and concise
- kebab-case (e.g., `cache-fix-options.md`)

Speichere ein Markdown File in `documentation/Jan/Plan/` mit folgendem Format:

```markdown
topic: "[Problem/Feature]"
---
# Solution Options: [Problem/Feature]

## Problem Statement
[Klare Beschreibung des Problems oder der Anforderung]

### Context
- Current situation with references
- Key constraints discovered
- Relevant existing patterns

## Option 1: [Descriptive Name]

### Overview
[One paragraph summary of this approach]

### Implementation Approach
- High-level steps
- Key files/components affected: `path/to/file.ext:line`
- Integration points with existing code

### Pros
- [Advantage 1]
- [Advantage 2]
- ...

### Cons
- [Disadvantage 1]
- [Disadvantage 2]
- ...

### Evaluation (Rating & Brief explanation)
- Complexity
- Maintainability
- Performance
- Risk 
- UX Impact

### Estimated Effort
[Small / Medium / Large] - [Brief justification]

---

## Option 2: [Descriptive Name]
[Same structure as Option 1]

---

## Option 3: [Descriptive Name]
[Same structure as Option 1]

---

## Recommendation

### Suggested Approach: [Option Name]

**Rationale:**
[Why this option is recommended based on the specific context, constraints, and requirements]

**Key Considerations:**
- [Important factor 1]
- [Important factor 2]
- [Important factor 3]

**Alternative Scenario:**
If [specific condition], consider [Alternative Option] instead because [reason].
```
## Wichtige Hinweise

- **Sei objektiv**: Präsentiere alle Optionen fair, auch wenn du eine Präferenz hast
- **Sei konkret**: Vermeide vage Beschreibungen – nenne spezifische Dateien und Patterns
- **Sei realistisch**: Berücksichtige die Gegebenheiten der Codebasis, nicht nur theoretische Ideale
- **Sei vollständig**: NEVER write the options document with placeholder values
- **Denke ganzheitlich**: Berücksichtige nicht nur die technische Implementation, sondern auch UX, Performance und Wartbarkeit
- **Reference existing code**: Zeige mit Dateipfaden und Zeilennummern, wo ähnliche Patterns existieren

## Hinweise zur Empfehlung

Deine Empfehlung sollte berücksichtigen:
- Den aktuellen Zustand der Codebasis
- Langfristige Wartbarkeit vs. kurzfristige Lösung
- Alignment mit bestehenden Architektur-Entscheidungen

Sei ehrlich, wenn mehrere Optionen gleichwertig sind und die Entscheidung von weiteren Faktoren abhängt, die du nicht kennst.

---

Ich bin mir sicher, du schaffst das! Bei erfolgreicher Erstellung eines durchdachten Options-Dokuments bekommst du Trinkgeld.
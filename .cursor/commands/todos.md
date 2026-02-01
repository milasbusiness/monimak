# Create Implementation Todos

## Purpose

Dieser Prompt wird zusätzlich zu @plan oder @research-plan verwendet, um den Plan in konkrete, umsetzbare Teilaufgaben aufzubrechen und als JSON-Datei zu strukturieren.

## Ziel

Erstelle basierend auf dem Plan **4 bis 8 sinnvolle Teilaufgaben**, die:
- Nach Dependencies geordnet sind (sequentiell abarbeitbar)
- Klar abgegrenzte Arbeitspakete darstellen
- Jeweils einen klaren Erfolgsindikator haben
- Aufeinander aufbauen (keine zirkulären Dependencies)

## Arbeitsweise

### 1. Plan analysieren

- Lese den erstellten Plan vollständig durch
- Identifiziere die Hauptphasen und Komponenten
- Erkenne natürliche Abhängigkeiten zwischen Arbeitsschritten

### 2. Aufgaben definieren

**Aufgaben-Granularität:**
- Nicht zu klein (nicht jede Datei = eine Aufgabe)
- Nicht zu groß (nicht eine Phase = eine Aufgabe)
- Sinnvolle, in sich geschlossene Arbeitspakete

**Dependencies ordnen:**
- Aufgabe 1 hat keine Dependencies (Startpunkt)
- Jede folgende Aufgabe referenziert nur vorherige IDs
- Stelle sicher, dass die Reihenfolge logisch ist
- Parallele Aufgaben (keine gegenseitige Dependency) sind möglich

### 3. JSON-Datei erstellen

Erstelle eine JSON-Datei in `documentation/Jan/Plan/` mit folgendem Schema:

**Dateiname**: `[plan-name]-todos.json` (passend zum Plan-Dokument)

**Schema:**

```json
{
  "meta": {
    "instructions": "Workflow-Hinweise:\n1. Suche den nächsten Task mit status='pending' und ohne blockierende Dependencies\n2. Wenn du einen Task abgeschlossen hast, ändere seinen status auf 'done'\n3. Dependencies werden automatisch freigeschaltet sobald alle Vorbedingungen erfüllt sind"
  },
  "planName": "[Name des Plans]",
  "planFile": "[Relativer Pfad zum Plan-Dokument]",
  "tasks": [
    {
      "id": 1,
      "title": "Brief, descriptive title",
      "description": "Concise description of what the task involves (1-2 sentences)",
      "status": "pending",
      "dependencies": [],
      "priority": "high",
      "details": "In-depth implementation instructions:\n- Specific file to change\n- What to modify\n- Patterns to follow\n- Code references from plan",
      "testStrategy": "How to verify this task is complete:\n- Specific checks to run\n- Manual verification steps\n- Success criteria",
      "subtasks": [
        {
          "id": "1.1",
          "title": "Specific smaller task",
          "completed": false
        }
      ]
    }
  ]
}
```

### 4. Feld-Definitionen

**Meta-Informationen:**

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| **meta.instructions** | string | Workflow-Hinweise für den Entwickler zur Verwendung der Todos |

**Task-Felder:**

| Feld | Typ | Beschreibung | Beispiel |
|------|-----|--------------|----------|
| **id** | number | Unique identifier, sequentiell | `1`, `2`, `3` |
| **title** | string | Kurzer, beschreibender Titel | `"Setup database schema"` |
| **description** | string | Knappe Beschreibung (1-2 Sätze) | `"Create user authentication tables and indexes"` |
| **status** | string | Aktueller Status | `"pending"`, `"in_progress"`, `"done"`, `"deferred"` |
| **dependencies** | array | IDs von Tasks die vorher abgeschlossen sein müssen | `[1, 2]` oder `[]` |
| **priority** | string | Wichtigkeit | `"high"`, `"medium"`, `"low"` |
| **details** | string | Detaillierte Implementation-Anweisungen mit Code-Referenzen | Multi-line string mit spezifischen Schritten |
| **testStrategy** | string | Wie wird die Aufgabe verifiziert | Konkrete Test-Schritte und Success Criteria |
| **subtasks** | array (optional) | Kleinere Teilschritte innerhalb der Task | Array von Objekten mit `id`, `title`, `completed` |

### 5. Plan-Dokument aktualisieren

Füge am **Ende des Plan-Dokuments** einen Abschnitt hinzu:

```markdown
## Implementation Todos

Dieser Plan wurde in konkrete Teilaufgaben aufgebrochen. Siehe: [`[plan-name]-todos.json`](./[plan-name]-todos.json)
```

## Beispiel-Struktur

```json
{
  "meta": {
    "instructions": "Workflow-Hinweise:\n1. Suche den nächsten Task mit status='pending' und ohne blockierende Dependencies\n2. Wenn du einen Task abgeschlossen hast, ändere seinen status auf 'done'\n3. Dependencies werden automatisch freigeschaltet sobald alle Vorbedingungen erfüllt sind"
  },
  "planName": "User Authentication Implementation",
  "planFile": "./auth-implementation-plan.md",
  "tasks": [
    {
      "id": 1,
      "title": "Setup database schema",
      "description": "Create users table with authentication fields and necessary indexes",
      "status": "pending",
      "dependencies": [],
      "priority": "high",
      "details": "Files to modify:\n- backend/db/schema.sql\n- backend/db/migrations/001_users.sql\n\nAdd tables:\n- users (id, email, password_hash, created_at)\n- sessions (id, user_id, token, expires_at)\n\nFollow pattern from: backend/db/schema.sql:45-67",
      "testStrategy": "Verification:\n- Run migrations: npm run migrate\n- Check tables exist: psql -c '\\dt'\n- Verify indexes created\n- Ensure no migration errors",
      "subtasks": [
        {
          "id": "1.1",
          "title": "Create users table migration",
          "completed": false
        },
        {
          "id": "1.2",
          "title": "Create sessions table migration",
          "completed": false
        },
        {
          "id": "1.3",
          "title": "Add indexes for performance",
          "completed": false
        }
      ]
    },
    {
      "id": 2,
      "title": "Implement password hashing service",
      "description": "Create utility functions for secure password hashing using bcrypt",
      "status": "pending",
      "dependencies": [1],
      "priority": "high",
      "details": "Create new file: backend/services/auth.py\n\nImplement functions:\n- hash_password(plain_text) -> hashed\n- verify_password(plain_text, hashed) -> boolean\n\nUse bcrypt with salt rounds = 12\nFollow pattern from: backend/services/encryption.py:23-45",
      "testStrategy": "Unit tests:\n- Test password hashing produces different hashes\n- Test verification with correct password\n- Test verification fails with wrong password\n- Test empty password handling"
    }
  ]
}
```

## Wichtige Hinweise

- **Meta-Section**: Füge immer die `meta.instructions` Section hinzu – sie hilft dem Entwickler bei der Verwendung
- **Dependencies realistisch**: Nur echte Abhängigkeiten eintragen, nicht künstlich sequentialisieren
- **Details konkret**: Spezifische Dateipfade, Zeilennummern, Code-Referenzen aus dem Plan übernehmen
- **Test Strategy klar**: Konkrete Befehle und Checks, keine vagen Beschreibungen
- **Status initial "pending"**: Alle Tasks starten mit Status "pending"
- **Priority durchdacht**: Basierend auf kritischem Pfad und Risiko
- **Subtasks optional**: Nur verwenden wenn eine Task wirklich aus mehreren kleinen Schritten besteht, es ist ok wenn für eine Task keine Subtasks existieren

## Quality Checks

Bevor du die JSON-Datei speicherst:
- ✅ Sind die Dependencies zyklenfrei und logisch?
- ✅ Kann Task 1 ohne Voraussetzungen gestartet werden?
- ✅ Haben alle Tasks konkrete Details und Test Strategy?
- ✅ Ist die JSON-Syntax valide?
- ✅ Wurde der Link im Plan-Dokument eingefügt?
- ✅ Sind 4-8 Tasks definiert (nicht zu wenig, nicht zu viel)?

---

Ich bin mir sicher, du schaffst das! Bei erfolgreicher Erstellung strukturierter Todos bekommst du Trinkgeld.
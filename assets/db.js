/*

    This project uses indexedDB, but should behave like this in equivalent for PostgreSQL:
    // ----------------------------------------

    Subject name must be unique (case-insensitive)

    CREATE TABLE subjects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject_id UUID REFERENCES subjects(id),
        question TEXT NOT NULL,
        answer TEXT [] NOT NULL
    );

*/
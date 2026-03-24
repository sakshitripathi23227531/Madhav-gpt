const Database = require("better-sqlite3");

const db = new Database("gita.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS shlokas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter INTEGER,
    verse INTEGER,
    sanskrit TEXT,
    transliteration TEXT,
    translation_en TEXT,
    translation_hi TEXT,
    explanation TEXT,
    keywords TEXT
  )
`);

const existingShloka = db.prepare("SELECT id FROM shlokas WHERE chapter = 2 AND verse = 47").get();
if (!existingShloka) {
  db.prepare(`
    INSERT INTO shlokas (chapter, verse, sanskrit, transliteration, translation_en, translation_hi, explanation, keywords)
    VALUES (2, 47, 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', 'karmaṇy-evādhikāras te mā phaleṣu kadācana', 'You have the right to perform your duty but not the fruits of your actions.', 'तुम्हारा अधिकार केवल कर्म करने में है, फल में नहीं।', 'Krishna teaches Arjuna to focus on action without attachment to results.', 'karma,duty,success,work')
  `).run();
}

module.exports = db;
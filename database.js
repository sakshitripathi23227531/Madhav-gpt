const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("gita.db");

db.serialize(() => {

  db.run(`
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

});

module.exports = db;

db.run(`
INSERT INTO shlokas
(chapter, verse, sanskrit, transliteration, translation_en, translation_hi, explanation, keywords)
VALUES
(
2,
47,
'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
'karmaṇy-evādhikāras te mā phaleṣu kadācana',
'You have the right to perform your duty but not the fruits of your actions.',
'तुम्हारा अधिकार केवल कर्म करने में है, फल में नहीं।',
'Krishna teaches Arjuna to focus on action without attachment to results.',
'karma,duty,success,work'
)
`);
import { loadAllQuizFiles } from "./quiz-data";

function main() {
  const files = loadAllQuizFiles();
  const allQuizzes = files.flatMap((f) => f.data);
  const total = allQuizzes.length;

  console.log("Quiz Coverage Report");
  console.log("====================");
  console.log(`Total: ${total} questions (${files.length} files)\n`);

  // By Category
  const byCategory: Record<string, number> = {};
  for (const q of allQuizzes) {
    byCategory[q.category] = (byCategory[q.category] || 0) + 1;
  }
  console.log(
    "By Category:     " +
      Object.entries(byCategory)
        .map(([k, v]) => `${k} ${v}`)
        .join(" | ")
  );

  // By Type
  const byType: Record<string, number> = {};
  for (const q of allQuizzes) {
    byType[q.type] = (byType[q.type] || 0) + 1;
  }
  console.log(
    "By Type:         " +
      Object.entries(byType)
        .map(([k, v]) => `${k} ${v}`)
        .join(" | ")
  );

  // By Difficulty
  const byDifficulty: Record<string, number> = {};
  for (const q of allQuizzes) {
    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
  }
  console.log(
    "By Difficulty:   " +
      Object.entries(byDifficulty)
        .map(([k, v]) => `${k} ${v}`)
        .join(" | ")
  );

  // Difficulty x Subcategory matrix
  console.log("\nDifficulty x Subcategory:");
  const difficulties = ["초급", "중급", "고급"];
  const subcategories = [...new Set(allQuizzes.map((q) => q.subcategory))].sort();

  // Header
  const maxSubLen = Math.max(...subcategories.map((s) => s.length));
  console.log("  " + "".padEnd(maxSubLen + 2) + difficulties.map((d) => d.padStart(4)).join("  "));

  for (const sub of subcategories) {
    const counts = difficulties.map((d) => {
      return allQuizzes.filter((q) => q.subcategory === sub && q.difficulty === d).length;
    });
    console.log(
      "  " +
        sub.padEnd(maxSubLen + 2) +
        counts.map((c) => String(c).padStart(4)).join("  ")
    );
  }

  // Code Languages
  const langCounts: Record<string, number> = {};
  for (const q of allQuizzes) {
    if (q.codeLanguage) {
      langCounts[q.codeLanguage] = (langCounts[q.codeLanguage] || 0) + 1;
    }
  }
  if (Object.keys(langCounts).length > 0) {
    const sorted = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
    console.log(
      "\nCode Languages:  " + sorted.map(([lang, count]) => `${lang}:${count}`).join("  ")
    );
  }
}

main();

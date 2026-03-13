import { loadAllQuizFiles, extractKeywords } from "./quiz-data";
import type { Quiz } from "../src/types/quiz";

interface SearchResult {
  id: string;
  category: string;
  subcategory: string;
  difficulty: string;
  type: string;
  question: string;
}

function toResult(q: Quiz): SearchResult {
  return {
    id: q.id,
    category: q.category,
    subcategory: q.subcategory,
    difficulty: q.difficulty,
    type: q.type,
    question: q.question.length > 120 ? q.question.slice(0, 120) + "..." : q.question,
  };
}

function searchableText(q: Quiz): string {
  const parts = [q.question, q.explanation];
  if (q.options) parts.push(...q.options);
  if (q.codeTemplate) parts.push(q.codeTemplate);
  if (q.blankAnswers) {
    for (const answers of q.blankAnswers) {
      parts.push(...answers);
    }
  }
  return parts.join(" ");
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "";
      args[key] = value;
      if (value) i++;
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = loadAllQuizFiles();
  const allQuizzes = files.flatMap((f) => f.data);

  // --id: lookup by ID
  if (args.id) {
    const q = allQuizzes.find((q) => q.id === args.id);
    if (q) {
      console.log(JSON.stringify(q, null, 2));
    } else {
      console.error(`No question found with id: ${args.id}`);
      process.exit(1);
    }
    return;
  }

  // --similar: find similar questions by keyword Jaccard similarity
  if (args.similar) {
    const target = allQuizzes.find((q) => q.id === args.similar);
    if (!target) {
      console.error(`No question found with id: ${args.similar}`);
      process.exit(1);
      return;
    }

    const targetKeywords = new Set(extractKeywords(searchableText(target)));
    const scored = allQuizzes
      .filter((q) => q.id !== target.id)
      .map((q) => ({
        quiz: q,
        similarity: jaccardSimilarity(targetKeywords, new Set(extractKeywords(searchableText(q)))),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    console.log(`Top 10 similar to ${target.id}:\n`);
    for (const { quiz, similarity } of scored) {
      console.log(`  ${(similarity * 100).toFixed(1)}%  ${quiz.id}  ${quiz.question.slice(0, 80)}...`);
    }
    return;
  }

  // Filter-based search
  let results = allQuizzes;

  if (args.keyword) {
    const kw = args.keyword.toLowerCase();
    results = results.filter((q) => searchableText(q).toLowerCase().includes(kw));
  }

  if (args.subcategory) {
    results = results.filter((q) => q.subcategory === args.subcategory);
  }

  if (args.category) {
    results = results.filter((q) => q.category === args.category);
  }

  if (args.type) {
    results = results.filter((q) => q.type === args.type);
  }

  if (args.difficulty) {
    results = results.filter((q) => q.difficulty === args.difficulty);
  }

  if (Object.keys(args).length === 0) {
    console.log("Usage:");
    console.log("  --id <id>                    Lookup by ID (returns full question)");
    console.log("  --keyword <text>             Search in all text fields");
    console.log("  --subcategory <name>         Filter by subcategory");
    console.log("  --category <name>            Filter by category");
    console.log("  --type <type>                Filter by question type");
    console.log("  --difficulty <difficulty>     Filter by difficulty");
    console.log("  --similar <id>               Find similar questions (Jaccard similarity)");
    console.log("\nFilters can be combined.");
    return;
  }

  console.log(`Found ${results.length} questions:\n`);
  console.log(JSON.stringify(results.map(toResult), null, 2));
}

main();

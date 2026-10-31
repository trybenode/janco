/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides forms integration and shared functionality for the customer and janitor PWA.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: web/app/book/page.tsx, web/app/janitor/register/page.tsx, web/app/portal/chat/[jobId]/page.tsx, web/app/registration/page.tsx.
 */

export function normalizePlainText(value: string, maxLength: number, multiline = false): string {
  const normalized = value.normalize("NFKC").replace(/[\u0000\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n");
  const compact = multiline
    ? normalized.split("\n").map((line) => line.replace(/[ \t]+/g, " ").trim()).join("\n").replace(/\n{3,}/g, "\n\n")
    : normalized.replace(/\s+/g, " ").trim();
  return compact.slice(0, maxLength);
}

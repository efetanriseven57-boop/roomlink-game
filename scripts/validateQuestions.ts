import { validateLocalizedQuestionBanks } from "../data/questions";

const errors = validateLocalizedQuestionBanks();
if (errors.length) {
  throw new Error(errors.join("\n"));
}
console.log("All locale, branch, and difficulty question banks are valid.");
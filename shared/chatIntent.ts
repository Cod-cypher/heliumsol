/**
 * Phrases that mean "get me a person".
 *
 * Shared so the server (which hands off deterministically on a match, whether
 * or not the model calls request_human) and the widget (which shows the
 * "finding a team member" steps while that happens) agree on what counts.
 */
const ASKS_FOR_HUMAN =
  /\b(real (person|human)|speak (to|with) (a |someone|somebody)|talk to (a )?(real )?(person|human|someone|somebody)|human being|customer service|sales rep|account manager|call me|phone me|ring me|is this a bot|are you a (bot|robot|human|real)|not a bot)\b/i;

export function asksForHuman(text: string): boolean {
  return ASKS_FOR_HUMAN.test(text);
}

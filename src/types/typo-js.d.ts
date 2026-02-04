declare module 'typo-js' {
  class Typo {
    constructor(
      lang: string,
      affData?: string | null,
      dicData?: string | null,
      options?: { dictionaryPath?: string }
    );
    check(word: string): boolean;
    suggest(word: string, limit?: number): string[];
  }
  export default Typo;
}

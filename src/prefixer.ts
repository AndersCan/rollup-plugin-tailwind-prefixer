/**
 * Prefix all words with the given prefix
 */
export function prefixer( prefix: string, words: string ) {
  if ( !words ) return words;
  const trimmed = words.replace( /\s+/g, " " );
  if ( !trimmed || trimmed === " " ) return words;

  const splitWords = trimmed.split( " " );

  const splitWordsLength = splitWords.length;
  const endResult = [];
  for ( let i = 0; i < splitWordsLength; i++ ) {
    const word = splitWords[i];
    if ( word === "" ) continue;

    const splitIndex = word.lastIndexOf( ":" );
    if ( splitIndex === -1 ) {
      endResult.push( `${prefix}${word}` );
      continue;
    }

    const [ utility, classname ] = splitAt( word, splitIndex );
    endResult.push( `${utility}:${prefix}${classname}` );
  }

  return endResult.join( " " );
}

function splitAt( str: string, index: number ) {
  const first = str.slice( 0, index );
  const second = str.slice( index + 1 );
  return [ first, second ];
}

/**
 * Prefix *all* classes with the given prefix.
 * Handles tailwind utilities (classes with `:`) correctly
 */
export function tailwindClassPrefixer( prefix: string, classNames: string ) {
  if ( !classNames ) return classNames;

  const startsWithSpace = classNames[0] === " ";
  const endsWithSpace = classNames[classNames.length - 1] === " ";

  if ( !classNames || classNames === " " ) return classNames;

  const splitWords = classNames.split( " " );

  const splitWordsLength = splitWords.length;
  const endResult = [];
  for ( let i = 0; i < splitWordsLength; i++ ) {
    const klass = splitWords[i];
    if ( klass === undefined || klass === "" ) continue;

    const splitIndex = klass.lastIndexOf( ":" );
    if ( splitIndex === -1 ) {
      endResult.push( `${prefix}${klass}` );
      continue;
    }

    const [ utility, classname ] = splitAt( klass, splitIndex );
    endResult.push( `${utility}:${prefix}${classname}` );
  }

  const pre = startsWithSpace ? " " : "";
  const post = endsWithSpace ? " " : "";

  return `${pre}${endResult.join( " " )}${post}`;
}

function splitAt( str: string, index: number ) {
  const first = str.slice( 0, index );
  const second = str.slice( index + 1 );
  return [ first, second ];
}

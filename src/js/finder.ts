/**
 * find the all start and end positions
 */
export function finder(
  fullstring: string,
  searchStart: string,
  searchEnd: string,
) {
  return findery( fullstring, searchStart, searchEnd );
}

interface Match {
  start: number;
  end: number;
  value: string;
}

export function findery(
  fullstring: string,
  searchStart: string,
  searchEnd: string,
): Match[] {
  let currentString = fullstring;

  const matches = [];
  let correctingIndex = 0;

  while ( currentString ) {
    const start = currentString.indexOf( searchStart );
    if ( start === -1 ) return matches;

    const endPart = currentString.slice( start + searchStart.length );

    const endIndex = endPart.indexOf( searchEnd );
    if ( endIndex === -1 ) {
      return matches;
    }

    const end = endIndex + searchEnd.length + start + searchStart.length;
    const rawValue = currentString.slice( start, end );

    // const parsed = removeMatch?
    matches.push( {
      start: start + correctingIndex,
      end: end + correctingIndex,
      value: rawValue,
    } );

    correctingIndex += end;
    currentString = currentString.slice( end );
  }
  return matches;
}

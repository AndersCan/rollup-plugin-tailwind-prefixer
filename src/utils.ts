export function errorIf( test: boolean, warnMessage: string, details?: any ) {
  if ( test ) {
    throw new Error(
      `rollup-plugin-tailwind-prefixer: ${warnMessage} \n ${
        JSON.stringify(
          details,
          null,
          2,
        )
      }`,
    );
  }
}

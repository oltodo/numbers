export type Range = [number, number];

export enum SequencingMode {
  literalOnly,
  digitalOnly,
  literalThenDigital,
  digitalThenLiteral,
  alternateDigitalAndLiteral,
  alternateLiteralAndDigital,
  alternateLiteralAndDigitalRandomly,
}

export interface Config {
  range: Range;
  sequencingMode: SequencingMode;
}

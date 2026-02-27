export interface ResponseMetadata {
  data_source: string;
  domain: string;
  disclaimer: string;
  freshness?: string;
}

export interface ToolResponse<T> {
  results: T;
  _metadata: ResponseMetadata;
}

export function generateResponseMetadata(builtAt?: string): ResponseMetadata {
  return {
    data_source: 'ANATEL, ANS, ANVISA, ANEEL, ANAC — Brazilian federal sectoral regulatory agencies',
    domain: 'brazilian-sectoral-regulations',
    disclaimer:
      'Regulatory reference data compiled from official Brazilian government sources. ' +
      'This is not legal or compliance advice. Regulations may have been amended after the last data refresh. ' +
      'Consult qualified Brazilian legal counsel and the relevant regulatory agency for binding interpretations. ' +
      'Ansvar Systems AB assumes no liability for decisions based on this data.',
    freshness: builtAt,
  };
}

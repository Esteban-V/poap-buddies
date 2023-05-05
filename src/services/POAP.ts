import { Headers } from 'node-fetch';
import fetch from 'node-fetch-retry';
import { getMatchingEvents } from '../utils/POAP';

type TokenId = number | string;

const { POAP_API_BASE_URL, POAP_API_KEY } = process.env;

const fetchWithApiHeaders = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: getApiHeaders(),
    retry: 3,
    pause: 500,
  }).catch((err) => {
    throw new Error(`Error fetching POAPs: ${err}`);
  });

  return response.json();
};

export const getTokenInfo = (tokenId: TokenId) => {
  const url = `${POAP_API_BASE_URL}/token/${tokenId}`;
  return fetchWithApiHeaders(url);
};

export const getAddressTokens = async (address: string) => {
  const url = `${POAP_API_BASE_URL}/actions/scan/${address}`;
  const result = await fetchWithApiHeaders(url);
  if(result.error) {
    throw new Error(`Error fetching POAPs for address "${address}": is it valid?`);
  }
  return result;
};

export const getInCommonPOAPS = async (address1: string, address2: string) => {
  let error = null;

  const tokens1 = await getAddressTokens(address1).catch((err) => { error = err.message; return [] });
  const tokens2 = await getAddressTokens(address2).catch((err) => { error = err.message; return [] });

  const commonPOAPS = getMatchingEvents(tokens1, tokens2);
  const differentPOAPS = tokens1.length + tokens2.length - commonPOAPS.length;

  return {
    error,
    address1POAPS: tokens1.length,
    address2POAPS: tokens2.length,
    differentPOAPS,
    commonPct: ((commonPOAPS.length / differentPOAPS) * 100).toFixed(1),
    commonPOAPS,
  };
};

const getApiHeaders = () => {
  const requestHeaders = new Headers();
  requestHeaders.set('x-api-key', POAP_API_KEY || '');
  return requestHeaders;
};

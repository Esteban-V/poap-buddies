import { POAP } from '../types/POAPEvent';

function getMatchingEvents(array1: POAP[], array2: POAP[]): POAP[] {
  const eventIds2 = new Set(array2.map((eventObj) => eventObj.event.id));
  const matchingEvents = array1.filter((eventObj) => eventIds2.has(eventObj.event.id));
  matchingEvents.sort((a, b) => a.event.id - b.event.id);
  return matchingEvents;
}

function minifyWalletAddress(address: string): string {
  return address.length < 12 ? address : `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function processAddress(input: string): string {
  const ensRegex = /^[a-z0-9]+(\.[a-z0-9]+)+$/;
  const walletRegex = /^0x[a-fA-F0-9]{40}$/;

  if (ensRegex.test(input)) {
    return input;
  } else if (walletRegex.test(input)) {
    return minifyWalletAddress(input);
  }

  return input;
}

export { getMatchingEvents, processAddress };

import legalJargon from '../data/legalJargon.json' with { type: 'json' };

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function findJargon(text) {
  return legalJargon.reduce((matches, item) => {
    const regex = new RegExp(`\\b${escapeRegex(item.term)}\\b`, 'gi');
    const occurrences = [...text.matchAll(regex)].map((match) => match.index);
    if (occurrences.length) matches.push({ ...item, occurrences });
    return matches;
  }, []);
}

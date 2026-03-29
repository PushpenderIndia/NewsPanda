// Topic mapping between IDs and names
export const TOPICS = [
  { id: '1', name: 'Tech' },
  { id: '2', name: 'Startups' },
  { id: '3', name: 'Finance' },
  { id: '4', name: 'Politics' },
  { id: '5', name: 'Sports' },
  { id: '6', name: 'AI' },
  { id: '7', name: 'Crypto' },
  { id: '8', name: 'World News' },
  { id: '9', name: 'Entertainment' },
];

export const getTopicNameById = (id: string): string => {
  const topic = TOPICS.find(t => t.id === id);
  return topic?.name || 'Tech';
};

export const getTopicIdByName = (name: string): string => {
  const topic = TOPICS.find(t => t.name === name);
  return topic?.id || '1';
};

export const convertIdsToNames = (ids: string[]): string[] => {
  return ids.map(id => getTopicNameById(id));
};

export const convertNamesToIds = (names: string[]): string[] => {
  return names.map(name => getTopicIdByName(name));
};

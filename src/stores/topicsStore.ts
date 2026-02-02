import { create } from 'zustand';
import type { Topic } from '../domain/models';
import { topicRepo } from '../repositories';

type TopicsState = {
  topicsBySubject: Record<string, Topic[]>;
  loadingBySubject: Record<string, boolean>;
  errorBySubject: Record<string, string | undefined>;
  refreshBySubject: (subjectId: string) => Promise<void>;
  createTopic: (input: { subjectId: string; name: string; iconEmoji?: string }) => Promise<Topic>;
  renameTopic: (
    id: string,
    subjectId: string,
    patch: { name?: string; iconEmoji?: string | undefined },
  ) => Promise<Topic>;
  deleteTopic: (id: string, subjectId: string) => Promise<void>;
};

export const useTopicsStore = create<TopicsState>((set, get) => ({
  topicsBySubject: {},
  loadingBySubject: {},
  errorBySubject: {},

  refreshBySubject: async (subjectId) => {
    set((s) => ({
      loadingBySubject: { ...s.loadingBySubject, [subjectId]: true },
      errorBySubject: { ...s.errorBySubject, [subjectId]: undefined },
    }));

    try {
      const topics = await topicRepo.listBySubject(subjectId);
      set((s) => ({
        topicsBySubject: { ...s.topicsBySubject, [subjectId]: topics },
        loadingBySubject: { ...s.loadingBySubject, [subjectId]: false },
      }));
    } catch (e) {
      set((s) => ({
        loadingBySubject: { ...s.loadingBySubject, [subjectId]: false },
        errorBySubject: {
          ...s.errorBySubject,
          [subjectId]: e instanceof Error ? e.message : 'Fehler beim Laden',
        },
      }));
    }
  },

  createTopic: async ({ subjectId, name, iconEmoji }) => {
    const created = await topicRepo.create({ subjectId, name, iconEmoji });
    await get().refreshBySubject(subjectId);
    return created;
  },

  renameTopic: async (id, subjectId, patch) => {
    const updated = await topicRepo.update(id, patch);
    await get().refreshBySubject(subjectId);
    return updated;
  },

  deleteTopic: async (id, subjectId) => {
    await topicRepo.delete(id);
    await get().refreshBySubject(subjectId);
  },
}));

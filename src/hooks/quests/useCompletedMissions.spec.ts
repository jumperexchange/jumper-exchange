import { describe, expect, it } from 'vitest';
import type { QuestData } from 'src/types/strapi';
import { deriveCompletedMissions } from './useCompletedMissions';

const quest = (
  slug: string,
  tasks: Array<{ uuid: string; hasTask: boolean }>,
): QuestData =>
  ({
    documentId: `doc-${slug}`,
    Slug: slug,
    Title: slug,
    tasks_verification: tasks.map((task) => ({
      uuid: task.uuid,
      hasTask: task.hasTask,
    })),
  }) as QuestData;

const verification = (slug: string, stepId: string, timestamp: string) => ({
  slug,
  stepId,
  timestamp,
});

describe('deriveCompletedMissions', () => {
  it('returns missions whose verifiable tasks are all verified', () => {
    const quests = [
      quest('a', [
        { uuid: 'a1', hasTask: true },
        { uuid: 'a2', hasTask: true },
      ]),
    ];
    const verifications = [
      verification('a', 'a1', '2026-01-10'),
      verification('a', 'a2', '2026-02-20'),
    ];

    const result = deriveCompletedMissions(verifications, quests);

    expect(result).toHaveLength(1);
    expect(result[0].quest.Slug).toBe('a');
    // completedAt is the latest verification
    expect(result[0].completedAt).toEqual(new Date('2026-02-20'));
  });

  it('joins verifications to quests by slug, not questId', () => {
    // Mirrors real develop data: the verification's questId references a
    // Strapi document that no longer exists, but the slug still matches.
    const quests = [
      quest('boost-from-hyperflow', [
        { uuid: '0199568b-8135-7454-9150-5d405697b30a', hasTask: true },
      ]),
    ];
    const verifications = [
      {
        questId: 'kgrn48bpza6gi1xh9mgqzhiv',
        slug: 'boost-from-hyperflow',
        stepId: '0199568b-8135-7454-9150-5d405697b30a',
        timestamp: '2026-01-23T09:08:52.339Z',
      },
    ];

    const result = deriveCompletedMissions(verifications, quests);

    expect(result).toHaveLength(1);
    expect(result[0].quest.Slug).toBe('boost-from-hyperflow');
  });

  it('excludes missions with unverified tasks', () => {
    const quests = [
      quest('a', [
        { uuid: 'a1', hasTask: true },
        { uuid: 'a2', hasTask: true },
      ]),
    ];

    const result = deriveCompletedMissions(
      [verification('a', 'a1', '2026-01-10')],
      quests,
    );

    expect(result).toHaveLength(0);
  });

  it('ignores non-verifiable tasks when checking completion', () => {
    const quests = [
      quest('a', [
        { uuid: 'a1', hasTask: true },
        { uuid: 'a2', hasTask: false },
      ]),
    ];

    const result = deriveCompletedMissions(
      [verification('a', 'a1', '2026-01-10')],
      quests,
    );

    expect(result).toHaveLength(1);
  });

  it('excludes missions without verifiable tasks', () => {
    const quests = [quest('a', [{ uuid: 'a1', hasTask: false }])];

    const result = deriveCompletedMissions(
      [verification('a', 'a1', '2026-01-10')],
      quests,
    );

    expect(result).toHaveLength(0);
  });

  it('sorts completed missions newest first', () => {
    const quests = [
      quest('old', [{ uuid: 'o1', hasTask: true }]),
      quest('new', [{ uuid: 'n1', hasTask: true }]),
    ];
    const verifications = [
      verification('old', 'o1', '2025-06-01'),
      verification('new', 'n1', '2026-03-01'),
    ];

    const result = deriveCompletedMissions(verifications, quests);

    expect(result.map((mission) => mission.quest.Slug)).toEqual(['new', 'old']);
  });
});

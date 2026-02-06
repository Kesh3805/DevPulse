const { PrismaClient } = require('@prisma/client');

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const prisma = hasDatabaseUrl ? new PrismaClient() : null;

const memoryStore = {
  users: new Map(),
  publicProfiles: new Map(),
  leetCodeStats: new Map()
};

const buildUserKey = ({ github_id, username, email }) =>
  github_id || username || email;

const toMemoryUser = ({ github_id, username, email, access_token }) => ({
  id: buildUserKey({ github_id, username, email }) || `user-${Date.now()}`,
  github_id,
  username,
  email,
  access_token,
  is_public: false
});

const upsertUser = async ({ github_id, username, email, access_token }) => {
  if (prisma && github_id) {
    return prisma.users.upsert({
      where: { github_id },
      update: { username, email },
      create: { github_id, username, email }
    });
  }

  const key = buildUserKey({ github_id, username, email });
  if (!key) {
    throw new Error('A github_id, username, or email is required');
  }

  const existing = memoryStore.users.get(key);
  const updated = {
    ...(existing || toMemoryUser({ github_id, username, email, access_token })),
    github_id,
    username,
    email,
    access_token
  };
  memoryStore.users.set(key, updated);
  return updated;
};

const updateUserSettings = async ({ username, is_public, bio, theme, pinned_projects }) => {
  if (!username) {
    throw new Error('username is required');
  }

  if (prisma) {
    const user = await prisma.users.findFirst({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: { is_public: typeof is_public === 'boolean' ? is_public : user.is_public }
    });

    const profile = await prisma.publicProfileSettings.upsert({
      where: { user_id: user.id },
      update: {
        bio: bio ?? undefined,
        theme: theme ?? undefined,
        pinned_projects: pinned_projects ?? undefined
      },
      create: {
        user_id: user.id,
        bio: bio ?? null,
        theme: theme ?? null,
        pinned_projects: pinned_projects ?? []
      }
    });

    return { ...updatedUser, publicProfile: profile };
  }

  const existing = memoryStore.users.get(username) || { username, is_public: false };
  const updated = {
    ...existing,
    is_public: typeof is_public === 'boolean' ? is_public : existing.is_public
  };
  memoryStore.users.set(username, updated);

  const profile = {
    user_id: updated.id || username,
    bio: bio ?? memoryStore.publicProfiles.get(username)?.bio ?? null,
    theme: theme ?? memoryStore.publicProfiles.get(username)?.theme ?? null,
    pinned_projects: pinned_projects ?? memoryStore.publicProfiles.get(username)?.pinned_projects ?? []
  };
  memoryStore.publicProfiles.set(username, profile);

  return { ...updated, publicProfile: profile };
};

const getPublicProfile = async (username) => {
  if (!username) {
    throw new Error('username is required');
  }

  if (prisma) {
    const user = await prisma.users.findFirst({
      where: { username },
      include: { publicProfile: true }
    });

    if (!user || !user.is_public) {
      return null;
    }

    return {
      username: user.username,
      bio: user.publicProfile?.bio ?? null,
      theme: user.publicProfile?.theme ?? null,
      pinned_projects: user.publicProfile?.pinned_projects ?? [],
      is_public: user.is_public
    };
  }

  const user = memoryStore.users.get(username);
  if (!user || !user.is_public) {
    return null;
  }

  const profile = memoryStore.publicProfiles.get(username) || {};
  return {
    username: user.username,
    bio: profile.bio ?? null,
    theme: profile.theme ?? null,
    pinned_projects: profile.pinned_projects ?? [],
    is_public: user.is_public
  };
};

const upsertLeetCodeStats = async ({ username, week_start, easy, medium, hard, solved_tags }) => {
  if (!username) {
    throw new Error('username is required');
  }

  const payload = {
    week_start: week_start ? new Date(week_start) : new Date(),
    easy: Number(easy) || 0,
    medium: Number(medium) || 0,
    hard: Number(hard) || 0,
    solved_tags: solved_tags ?? {}
  };

  if (prisma) {
    const user = await prisma.users.findFirst({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const stats = await prisma.leetCodeStats.create({
      data: {
        user_id: user.id,
        ...payload
      }
    });

    return stats;
  }

  memoryStore.leetCodeStats.set(username, payload);
  return payload;
};

const getLeetCodeStats = async (username) => {
  if (!username) {
    throw new Error('username is required');
  }

  if (prisma) {
    const user = await prisma.users.findFirst({ where: { username } });
    if (!user) {
      return null;
    }

    const stats = await prisma.leetCodeStats.findFirst({
      where: { user_id: user.id },
      orderBy: { week_start: 'desc' }
    });

    return stats;
  }

  return memoryStore.leetCodeStats.get(username) || null;
};

module.exports = {
  upsertUser,
  updateUserSettings,
  getPublicProfile,
  upsertLeetCodeStats,
  getLeetCodeStats
};

const usersById = new Map();
const usersByUsername = new Map();
const profilesByUserId = new Map();

const normalizeUsername = (username) => (username ? username.toLowerCase() : null);

const getUserByUsername = (username) => {
  const normalized = normalizeUsername(username);
  if (!normalized) {
    return null;
  }
  return usersByUsername.get(normalized) || null;
};

const upsertUser = ({ github_id, username, email }) => {
  if (!github_id && !username) {
    throw new Error('Either github_id or username is required');
  }

  const existing =
    (github_id && usersById.get(github_id)) ||
    (username && getUserByUsername(username));

  const nextUser = {
    id: existing?.id || github_id || `local_${Date.now()}`,
    github_id: github_id || existing?.github_id || null,
    username: username || existing?.username || null,
    email: email || existing?.email || null,
    is_public: existing?.is_public ?? false
  };

  if (nextUser.github_id) {
    usersById.set(nextUser.github_id, nextUser);
  }
  if (nextUser.username) {
    usersByUsername.set(normalizeUsername(nextUser.username), nextUser);
  }

  return nextUser;
};

const updateProfile = ({ github_id, username, updates }) => {
  const user =
    (github_id && usersById.get(github_id)) ||
    (username && getUserByUsername(username));

  if (!user) {
    return null;
  }

  const updatedUser = {
    ...user,
    is_public:
      typeof updates.is_public === 'boolean'
        ? updates.is_public
        : user.is_public
  };

  if (updatedUser.github_id) {
    usersById.set(updatedUser.github_id, updatedUser);
  }
  if (updatedUser.username) {
    usersByUsername.set(normalizeUsername(updatedUser.username), updatedUser);
  }

  const existingProfile = profilesByUserId.get(updatedUser.id) || {};
  const nextProfile = {
    bio:
      typeof updates.bio === 'string'
        ? updates.bio.trim()
        : existingProfile.bio || null,
    theme:
      typeof updates.theme === 'string'
        ? updates.theme.trim()
        : existingProfile.theme || null,
    pinned_projects: Array.isArray(updates.pinned_projects)
      ? updates.pinned_projects
      : existingProfile.pinned_projects || []
  };

  profilesByUserId.set(updatedUser.id, nextProfile);

  return {
    user: updatedUser,
    profile: nextProfile
  };
};

const getPublicProfile = (username) => {
  const user = getUserByUsername(username);
  if (!user) {
    return { status: 'not_found' };
  }
  if (!user.is_public) {
    return { status: 'private', user };
  }

  return {
    status: 'ok',
    user,
    profile: profilesByUserId.get(user.id) || null
  };
};

module.exports = {
  getPublicProfile,
  getUserByUsername,
  upsertUser,
  updateProfile
};

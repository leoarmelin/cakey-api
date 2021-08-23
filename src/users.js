const users = [];

function joinUser(id, username, roomname) {
  const user = { id, username, roomname };

  users.push(user);

  console.log('Usuários:', users);

  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function userDisconnect(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = {
  joinUser,
  getCurrentUser,
  userDisconnect,
};

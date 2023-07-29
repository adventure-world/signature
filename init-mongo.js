db.createUser({
  user: 'dagen',
  pwd: 'dagen_password',
  roles: [
    {
      role: 'readWrite',
      db: 'dagen',
    },
  ],
})

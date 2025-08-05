import React, { useEffect, useState } from 'react';
import { getUsers } from '../api';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch {
        setError('Failed to load users list or unauthorized.');
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2>All Signed-up Users</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th></tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="2">No users found</td></tr>
          ) : (
            users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

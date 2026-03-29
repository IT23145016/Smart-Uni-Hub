import { useEffect, useState } from "react";
import Shell from "../components/Shell";
import { api } from "../services/api";

const ROLE_OPTIONS = ["USER", "ADMIN", "TECHNICIAN"];

export default function RoleManagementPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getUsers().then(setUsers).catch((err) => setError(err.message));
  }, []);

  async function toggleRole(userId, role) {
    const targetUser = users.find((user) => user.id === userId);
    const nextRoles = targetUser.roles.includes(role)
      ? targetUser.roles.filter((item) => item !== role)
      : [...targetUser.roles, role];

    try {
      const updated = await api.updateRoles(userId, nextRoles);
      setUsers((current) => current.map((user) => (user.id === userId ? updated : user)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Shell title="Role Management">
      <section className="hero-card accent-card">
        <p className="eyebrow">Admin Controls</p>
        <h2>Grant the right level of access without losing traceability.</h2>
        <p>
          Admins can promote staff to technicians, keep standard users scoped down, and notify users whenever
          their permissions change.
        </p>
      </section>

      {error ? <p className="error">{error}</p> : null}

      <section className="table-card">
        <div className="table-header">
          <h3>Users</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <div className="role-group">
                    {ROLE_OPTIONS.map((role) => (
                      <label key={role} className="role-pill">
                        <input
                          type="checkbox"
                          checked={user.roles.includes(role)}
                          onChange={() => toggleRole(user.id, role)}
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  );
}

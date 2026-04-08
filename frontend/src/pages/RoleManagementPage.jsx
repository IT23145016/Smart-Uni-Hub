import { useEffect, useState } from "react";
import Shell from "../components/Shell";
import { api } from "../services/api";

const ROLE_OPTIONS = ["USER", "ADMIN", "TECHNICIAN"];
const EMPTY_FORM = {
  fullName: "",
  email: "",
  avatarUrl: "",
  roles: ["USER"]
};

export default function RoleManagementPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setError("");
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }

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

  async function toggleStatus(userId, active) {
    try {
      const updated = await api.updateUserStatus(userId, active);
      setUsers((current) => current.map((user) => (user.id === userId ? updated : user)));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleRoleSelection(role) {
    setForm((current) => ({
      ...current,
      roles: current.roles.includes(role)
        ? current.roles.filter((item) => item !== role)
        : [...current.roles, role]
    }));
  }

  async function createUser(event) {
    event.preventDefault();

    try {
      const created = await api.createUser(form);
      setUsers((current) => [created, ...current]);
      setForm(EMPTY_FORM);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteUser(userId) {
    try {
      await api.deleteUser(userId);
      setUsers((current) => current.filter((user) => user.id !== userId));
      setError("");
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
          <h3>Create managed user</h3>
        </div>
        <form className="filter-grid" onSubmit={createUser}>
          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={handleInputChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleInputChange} required />
          </label>
          <label>
            Avatar URL
            <input name="avatarUrl" value={form.avatarUrl} onChange={handleInputChange} />
          </label>
          <div>
            <span className="eyebrow">Roles</span>
            <div className="role-group">
              {ROLE_OPTIONS.map((role) => (
                <label key={role} className="role-pill">
                  <input type="checkbox" checked={form.roles.includes(role)} onChange={() => handleRoleSelection(role)} />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="filter-actions">
            <button type="submit">Create user</button>
            <button type="button" className="secondary-button" onClick={() => setForm(EMPTY_FORM)}>
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="table-card">
        <div className="table-header">
          <h3>Users</h3>
          <button type="button" className="secondary-button toolbar-button" onClick={loadUsers}>
            Refresh
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => toggleStatus(user.id, !user.active)}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </button>
                </td>
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
                <td>
                  <button type="button" className="secondary-button" onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  );
}

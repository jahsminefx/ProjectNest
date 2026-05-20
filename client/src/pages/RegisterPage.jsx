import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, token } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    workspaceName: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (token) {
    return <Navigate to="/workspace/select/board" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const result = await register(form);
      navigate(`/workspace/${result.workspace.id}/board`, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-panel px-4 py-10 text-ink">
      <section className="w-full max-w-lg rounded-md border border-line bg-white p-6 shadow-soft">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">ProjectNest</p>
          <h1 className="mt-2 text-2xl font-semibold">Create your workspace</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
              <input
                className="w-full rounded-md border border-line px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
                name="name"
                onChange={handleChange}
                value={form.name}
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input
                className="w-full rounded-md border border-line px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
                name="email"
                onChange={handleChange}
                type="email"
                value={form.email}
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Workspace name</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
              name="workspaceName"
              onChange={handleChange}
              value={form.workspaceName}
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
              minLength={8}
              name="password"
              onChange={handleChange}
              type="password"
              value={form.password}
              required
            />
          </label>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Creating workspace...' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-semibold text-accent hover:text-teal-800" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;

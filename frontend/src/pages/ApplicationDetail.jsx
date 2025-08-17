import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ApplicationDetail = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const nav = useNavigate();

    const [app, setApp] = useState(null);
    const [err, setErr] = useState('');
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        visaType: 'T1',
        firstName: '',
        lastName: '',
        passportNo: '',
        dob: '',
        country: '',
        status: '',
    });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchOne = async () => {
            try {
                const res = await axiosInstance.get(`/api/applications/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setApp(res.data);
                setForm({
                    visaType: res.data.visaType || 'T1',
                    firstName: res.data.firstName || '',
                    lastName: res.data.lastName || '',
                    passportNo: res.data.passportNo || '',
                    dob: res.data.dob ? res.data.dob.substring(0, 10) : '',
                    country: res.data.country || '',
                    status: res.data.status || 'DRAFT',
                });
            } catch (e) {
                setErr('Failed to fetch application.');
            }
        };
        fetchOne();
    }, [id, user]);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const update = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErr('');
        try {
            const res = await axiosInstance.put(`/api/applications/${id}`, form, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setApp(res.data);
            setEditing(false);
        } catch (e) {
            setErr(e?.response?.data?.message || 'Failed to update.');
        } finally {
            setSaving(false);
        }
    };

    const del = async () => {
        if (!window.confirm('Delete this application?')) return;
        try {
            await axiosInstance.delete(`/api/applications/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            nav('/applications'); // or back to list route if you have one
        } catch (e) {
            alert('Failed to delete application.');
        }
    };

    if (err) return <div className="container mx-auto p-6"><p className="text-red-600">{err}</p></div>;
    if (!app) return <div className="container mx-auto p-6"><p>Loading…</p></div>;

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">
                    Application {app._id?.slice(-6)}
                </h1>
                <div className="space-x-3">
                    <Link to="/applications" className="underline">Back to list</Link>
                    <button onClick={() => setEditing((v) => !v)} className="px-3 py-1 rounded bg-gray-700 text-white">
                        {editing ? 'Cancel' : 'Edit'}
                    </button>
                    <button onClick={del} className="px-3 py-1 rounded bg-red-600 text-white">
                        Delete
                    </button>
                </div>
            </div>

            {!editing ? (
                <div className="space-y-1">
                    <p><b>Visa Type:</b> {app.visaType}</p>
                    <p><b>Status:</b> {app.status}</p>
                    <p><b>Name:</b> {app.firstName} {app.lastName}</p>
                    <p><b>Passport No:</b> {app.passportNo}</p>
                    <p><b>Date of Birth:</b> {app.dob ? new Date(app.dob).toLocaleDateString() : '-'}</p>
                    <p><b>Country:</b> {app.country}</p>
                    <p className="text-sm text-gray-500">
                        Created: {app.createdAt ? new Date(app.createdAt).toLocaleString() : '-'} • Updated: {app.updatedAt ? new Date(app.updatedAt).toLocaleString() : '-'}
                    </p>
                </div>
            ) : (
                <form onSubmit={update} className="space-y-3">
                    <label className="block">
                        <span className="block text-sm">Visa Type</span>
                        <select
                            value={form.visaType}
                            onChange={set('visaType')}
                            className="border rounded p-2 w-full"
                        >
                            <option value="T1">Tourist (T1)</option>
                            <option value="S1">Student (S1)</option>
                        </select>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                            <span className="block text-sm">First Name</span>
                            <input className="border rounded p-2 w-full" value={form.firstName} onChange={set('firstName')} />
                        </label>
                        <label className="block">
                            <span className="block text-sm">Last Name</span>
                            <input className="border rounded p-2 w-full" value={form.lastName} onChange={set('lastName')} />
                        </label>
                    </div>

                    <label className="block">
                        <span className="block text-sm">Passport No</span>
                        <input className="border rounded p-2 w-full" value={form.passportNo} onChange={set('passportNo')} />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                            <span className="block text-sm">Date of Birth</span>
                            <input type="date" className="border rounded p-2 w-full" value={form.dob} onChange={set('dob')} />
                        </label>
                        <label className="block">
                            <span className="block text-sm">Country</span>
                            <input className="border rounded p-2 w-full" value={form.country} onChange={set('country')} />
                        </label>
                    </div>

                    {/* Optional: allow updating simple status */}
                    <label className="block">
                        <span className="block text-sm">Status</span>
                        <select
                            className="border rounded p-2 w-full"
                            value={form.status}
                            onChange={set('status')}
                        >
                            <option>DRAFT</option>
                            <option>SUBMITTED</option>
                            <option>UNDER_REVIEW</option>
                            <option>PENDING_INFO</option>
                            <option>APPROVED</option>
                            <option>REJECTED</option>
                        </select>
                    </label>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 rounded bg-blue-600 text-white"
                    >
                        {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ApplicationDetail;

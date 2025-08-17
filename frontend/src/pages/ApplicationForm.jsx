import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ApplicationForm = () => {
    const { user } = useAuth();
    const nav = useNavigate();

    const [form, setForm] = useState({
        visaType: 'T1',
        firstName: '',
        lastName: '',
        passportNo: '',
        dob: '',
        country: '',
    });

    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErr('');
        try {
            const res = await axiosInstance.post('/api/applications', form, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            nav(`/applications/${res.data._id}`);
        } catch (e) {
            setErr(e?.response?.data?.message || 'Failed to create application.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-xl">
            <h1 className="text-xl font-semibold mb-4">New Visa Application</h1>
            {err && <p className="text-red-600 mb-2">{err}</p>}

            <form onSubmit={submit} className="space-y-3">
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

                <label className="block">
                    <span className="block text-sm">First Name</span>
                    <input
                        className="border rounded p-2 w-full"
                        value={form.firstName}
                        onChange={set('firstName')}
                        required
                    />
                </label>

                <label className="block">
                    <span className="block text-sm">Last Name</span>
                    <input
                        className="border rounded p-2 w-full"
                        value={form.lastName}
                        onChange={set('lastName')}
                        required
                    />
                </label>

                <label className="block">
                    <span className="block text-sm">Passport No</span>
                    <input
                        className="border rounded p-2 w-full"
                        value={form.passportNo}
                        onChange={set('passportNo')}
                        required
                    />
                </label>

                <label className="block">
                    <span className="block text-sm">Date of Birth</span>
                    <input
                        type="date"
                        className="border rounded p-2 w-full"
                        value={form.dob}
                        onChange={set('dob')}
                        required
                    />
                </label>

                <label className="block">
                    <span className="block text-sm">Country</span>
                    <input
                        className="border rounded p-2 w-full"
                        value={form.country}
                        onChange={set('country')}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                    {saving ? 'Saving…' : 'Create Draft'}
                </button>
            </form>
        </div>
    );
};

export default ApplicationForm;

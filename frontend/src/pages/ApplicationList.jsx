import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ApplicationList = () => {
    const { user } = useAuth();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await axiosInstance.get('/api/applications', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setApps(res.data);
            } catch (e) {
                setErr('Failed to fetch applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this application?')) return;
        try {
            await axiosInstance.delete(`/api/applications/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setApps((list) => list.filter((a) => a._id !== id));
        } catch (e) {
            alert('Failed to delete application.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">My Applications</h1>
                <Link
                    to="/applications/new"
                    className="px-3 py-2 rounded bg-blue-600 text-white"
                >
                    + New Application
                </Link>
            </div>

            {err && <p className="text-red-600 mb-2">{err}</p>}
            {loading ? (
                <p>Loading…</p>
            ) : apps.length === 0 ? (
                <p>No applications yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">Visa</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Created</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apps.map((a) => (
                                <tr key={a._id} className="odd:bg-white even:bg-gray-50">
                                    <td className="p-2 border">
                                        <Link
                                            to={`/applications/${a._id}`}
                                            className="text-blue-700 underline"
                                        >
                                            {a._id.slice(-6)}
                                        </Link>
                                    </td>
                                    <td className="p-2 border">{a.visaType}</td>
                                    <td className="p-2 border">{a.status}</td>
                                    <td className="p-2 border">
                                        {a.createdAt ? new Date(a.createdAt).toLocaleString() : '-'}
                                    </td>
                                    <td className="p-2 border">
                                        <Link
                                            to={`/applications/${a._id}`}
                                            className="text-blue-700 underline mr-3"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(a._id)}
                                            className="text-red-700 underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApplicationList;

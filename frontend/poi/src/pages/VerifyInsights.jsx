import { useState } from 'react';
import { VerifyInsight } from '../api/api';
import apiErrorHandler from '../utils/apiErrorHandler'

export default function VerifyPage() {
    const [hash, setHash] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");

    const onVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await VerifyInsight(hash);
            setResult(res?.data?.data || null);
            setName(res?.data?.uploaderName);
        } catch (e) {
            apiErrorHandler(e);
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4">
        <p>Verify the on‑chain record for a content hash.</p>
        <form onSubmit={onVerify} className="flex gap-2">
            <input
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="flex-1 p-3 border rounded-lg"
            placeholder="0x… content hash"
            required
            />
            <button className="bg-blue-600 text-white px-4 rounded-lg" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify'}
            </button>
        </form>
        {result && (
            <div className="p-4 border rounded-lg">
            <div><strong>Author:</strong> {name}</div>
            </div>
        )}
        </div>
    );
}
import { useState } from 'react';
import { apiCall } from '../api/api';

export default function SearchBar({ onSearchResults }) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        const { data } = await apiCall('get', `/search?q=${encodeURIComponent(query)}`);
        onSearchResults(data.results);
        setIsSearching(false);
    };

    return (
        <form onSubmit={handleSearch} className="search-bar">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search insights..."
            />
            <button type="submit" disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
            </button>
        </form>
    );
}
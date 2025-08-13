import { format } from 'date-fns';

export default function InsightCard({ insight }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg dark:text-white">
                {insight.title || 'Untitled Insight'}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(insight.createdAt), 'MMM d, yyyy')}
                </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
                {insight.content.length > 150 
                ? `${insight.content.substring(0, 150)}...` 
                : insight.content}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
                {insight.tags.map((tag) => (
                <span 
                    key={tag} 
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
                >
                    {tag}
                </span>
                ))}
            </div>
            
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                    Originality:
                </span>
                <span className="font-bold dark:text-white">
                    {insight.originalityScore || 'N/A'}
                </span>
                </div>
                
                <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                    Sentiment:
                </span>
                <span className="font-bold dark:text-white">
                    {insight.sentimentScore || 'N/A'}
                </span>
                </div>
            </div>
        </div>
    );
}
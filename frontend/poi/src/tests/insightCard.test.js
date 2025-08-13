import { render, screen } from '@testing-library/react';
import InsightCard from './InsightCard';

describe('InsightCard', () => {
    const mockInsight = {
        id: '1',
        title: 'Test Insight',
        content: 'This is a test insight content',
        tags: ['blockchain', 'AI'],
        originalityScore: 85,
        sentimentScore: 25,
        createdAt: '2023-06-15T10:00:00Z',
    };

    it('renders insight card correctly', () => {
        render(<InsightCard insight={mockInsight} />);
        
        expect(screen.getByText('Test Insight')).toBeInTheDocument();
        expect(screen.getByText('This is a test insight content')).toBeInTheDocument();
        expect(screen.getByText('blockchain')).toBeInTheDocument();
        expect(screen.getByText('AI')).toBeInTheDocument();
        expect(screen.getByText('85')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('renders without title correctly', () => {
        const insightWithoutTitle = { ...mockInsight, title: '' };
        render(<InsightCard insight={insightWithoutTitle} />);
        
        expect(screen.getByText('Untitled Insight')).toBeInTheDocument();
    });

    it('truncates long content', () => {
        const longContent = 'a'.repeat(200);
        render(<InsightCard insight={{ ...mockInsight, content: longContent }} />);
        
        expect(screen.getByText(/...$/)).toBeInTheDocument();
    });
});
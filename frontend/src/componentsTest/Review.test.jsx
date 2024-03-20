import React from 'react';
import { render, screen } from '@testing-library/react';
import Review from '../components/Review';

const mockReviews = [
  {
    email: 'user1@example.com',
    rating: 4,
    date: '2023-01-01',
    review: 'Great experience!',
    anonymity: false,
  },
  {
    email: 'user2@example.com',
    rating: 5,
    date: '2023-01-02',
    review: 'Excellent service!',
    anonymity: true,
  },
];

describe('Review Component', () => {
  it('renders without crashing', () => {
    render(<Review reviews={mockReviews} visible={true} />);
    expect(screen.getByText(/reviews/i)).toBeInTheDocument();
  });

  it('is visible when visible prop is true', () => {
    render(<Review reviews={mockReviews} visible={true} />);
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('correctly renders the list of reviews', () => {
    render(<Review reviews={mockReviews} visible={true} />);
    mockReviews.forEach(review => {
      expect(screen.getByText(review.review)).toBeInTheDocument();
    });
  });

  it('filters reviews based on star rating', () => {
    render(<Review reviews={mockReviews} star="5" visible={true} />);
    const filteredReviews = mockReviews.filter(review => `${review.rating}` === '5');
    filteredReviews.forEach(review => {
      expect(screen.getByText(review.review)).toBeInTheDocument();
    });
  });

  it('renders a blank space when there are no reviews', () => {
    render(<Review reviews={[]} visible={true} />);
    const reviewElements = screen.queryAllByRole('listitem');
    expect(reviewElements).toHaveLength(0); // Expecting no list items for reviews
  });

  it('displays correct average rating', () => {
    const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length;
    render(<Review reviews={mockReviews} visible={true} averageRating={averageRating} />);
    expect(screen.getByText(new RegExp(averageRating.toFixed(1)))).toBeInTheDocument();
  });
  it('displays review date and email/anonymity correctly', () => {
    render(<Review reviews={mockReviews} visible={true} />);
    mockReviews.forEach(review => {
      expect(screen.getByText(review.date)).toBeInTheDocument();
      if (review.anonymity) {
        expect(screen.getByText('anonymous')).toBeInTheDocument();
      } else {
        expect(screen.getByText(review.email)).toBeInTheDocument();
      }
    });
  });

  it('renders a blank space when there are no reviews', () => {
    render(<Review reviews={[]} visible={true} />);
    const reviewElements = screen.queryAllByRole('listitem');
    expect(reviewElements).toHaveLength(0); // Expecting no list items for reviews
  });

  it('renders review content correctly', () => {
    render(<Review reviews={mockReviews} visible={true} />);
    mockReviews.forEach(review => {
      expect(screen.getByText(review.review)).toBeInTheDocument();
      expect(screen.getByText(review.date)).toBeInTheDocument();
      expect(screen.getByText(review.anonymity ? 'anonymous' : review.email)).toBeInTheDocument();
    });
  });

  it('initializes state correctly based on reviews prop', () => {
    render(<Review reviews={mockReviews} visible={true} />);
    expect(screen.getAllByRole('listitem').length).toBe(mockReviews.length);
  });
});

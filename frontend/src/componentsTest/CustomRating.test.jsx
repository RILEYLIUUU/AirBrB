import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CustomRating from '../components/CustomRating';

describe('CustomRating Component', () => {
  const reviews = [
    { rating: 5 },
    { rating: 4 },
    { rating: 3 },
    { rating: 4 },
    { rating: 5 },
  ];

  it('renders without crashing', () => {
    render(<CustomRating reviews={reviews} />);
  });

  it('displays the average rating as stars', () => {
    const { getByLabelText } = render(<CustomRating reviews={reviews} />);
    const averageRatingElement = getByLabelText('4 Stars'); // Adjust the label text based on the expected rating
    expect(averageRatingElement).toBeInTheDocument();
  });

  // Add more test cases for other functionalities, interaction, etc.

  it('opens popover on click', () => {
    const { getByLabelText, getByRole } = render(<CustomRating reviews={reviews} />);
    const ratingStars = getByLabelText('4 Stars'); // Assuming '4 Stars' is the expected average rating label
    fireEvent.click(ratingStars);
    const popoverElement = getByRole('presentation'); // Assuming Popover uses role='presentation'
    expect(popoverElement).toBeInTheDocument();
  });
});

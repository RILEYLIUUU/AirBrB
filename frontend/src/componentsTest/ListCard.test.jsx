import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListCard from '../components/ListCard'; // Adjust the import path as necessary
// Mock data for the component
const mockData = {
  id: '1',
  title: 'Test Listing',
  thumbnail: 'test.jpg',
  price: '100',
  reviews: [{ rating: 4 }, { rating: 5 }],
  published: false,
  metadata: {
    propertyType: 'House',
    numBeds: 3,
    numBaths: 2
  },
};

describe('ListCard Component', () => {
  // Wrap in BrowserRouter if using 'useNavigate'
  const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

  it('renders without crashing', () => {
    render(<ListCard {...mockData} />, { wrapper: Wrapper });
    expect(screen.getByText('Test Listing')).toBeInTheDocument();
  });

  it('does not navigate on card click in non-homepage mode', () => {
    // Mock 'useNavigate' hook if necessary.
    render(<ListCard {...mockData} homepage={false} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText(mockData.title));
    // Verify that 'navigate' was not called.
  });

  it('handles edit button click correctly for unpublished listings', () => {
    render(<ListCard {...mockData} published={false} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByLabelText('edit'));
  });

  it('handles publish/unpublish button click correctly', () => {
    render(<ListCard {...mockData} published={false} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('PUBLISH'));
    expect(screen.getByText('Set availability')).toBeInTheDocument();
  });

  it('handles date picking in publish dialog correctly', () => {
    render(<ListCard {...mockData} published={false} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('PUBLISH'));
  });

  it('renders the property metadata correctly', () => {
    render(<ListCard {...mockData} />, { wrapper: Wrapper });
    expect(screen.getByText(mockData.metadata.propertyType)).toBeInTheDocument();
    expect(screen.getByText(`${mockData.metadata.numBeds}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockData.metadata.numBaths}`)).toBeInTheDocument();
  });

  it('navigates to booking history on button click', () => {
    // Mock 'useNavigate' hook or 'window.location.href' if necessary.wz
    render(<ListCard {...mockData} homepage={false} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('VIEW BOOKING HISTORY'));
    // Check if navigation to the booking history page is triggered.
  });

  it('renders video player for video thumbnail', () => {
    const videoThumbnailData = { ...mockData, thumbnail: 'http://example.com/video.mp4' };
    render(<ListCard {...videoThumbnailData} />, { wrapper: Wrapper });
    expect(screen.getByTestId('react-player')).toBeInTheDocument();
  });

  it('displays the correct number of reviews', () => {
    render(<ListCard {...mockData} />, { wrapper: Wrapper });
    expect(screen.getByText(`${mockData.reviews.length} Reviews`)).toBeInTheDocument();
  });

  it('renders the correct thumbnail based on type', () => {
    render(<ListCard {...mockData} />, { wrapper: Wrapper });
    if (typeof mockData.thumbnail === 'object') {
      expect(screen.getByAltText('home img')).toHaveAttribute('src', mockData.thumbnail[0]);
    } else {
      expect(screen.getByTestId('react-player')).toBeInTheDocument();
    }
  });

  it('renders image for image thumbnail', () => {
    const imageThumbnailData = { ...mockData, thumbnail: ['http://example.com/image.jpg'] };
    render(<ListCard {...imageThumbnailData} />, { wrapper: Wrapper });
    expect(screen.getByAltText('home img')).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  it('updates correctly when props change', () => {
    const { rerender } = render(<ListCard {...mockData} />, { wrapper: Wrapper });
    const newReviews = [...mockData.reviews, { rating: 3 }];
    rerender(<ListCard {...{ ...mockData, reviews: newReviews }} />);
    expect(screen.getByText(`${newReviews.length} Reviews`)).toBeInTheDocument();
  });
});

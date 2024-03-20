import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FilterDialog from '../components/FilterDialog'; // Adjust the import path as needed
import dayjs from 'dayjs';
describe('FilterDialog Component', () => {
  const mockHandleFilterClose = jest.fn();
  const mockHandleFiltersApply = jest.fn();
  const mockFilterData = {
    checkInDate: '2023-01-01',
    checkOutDate: '2023-01-07',
    bedroomsMin: '1',
    bedroomsMax: '3',
    priceMin: '100',
    priceMax: '500'
  };

  beforeEach(() => {
    render(<FilterDialog filterData={mockFilterData} handleFilterClose={mockHandleFilterClose} handleFiltersApply={mockHandleFiltersApply} />);
  });

  it('renders with correct initial values', () => {
    expect(screen.getByLabelText('CHECK IN').value).toBe(dayjs(mockFilterData.checkInDate).format('MM/DD/YYYY'));
    expect(screen.getByLabelText('CHECK OUT').value).toBe(dayjs(mockFilterData.checkOutDate).format('MM/DD/YYYY'));

    const priceMaxInput = screen.getByTestId('priceMax').querySelector('input');
    const priceMinInput = screen.getByTestId('priceMin').querySelector('input');
    expect(priceMinInput.value).toBe(mockFilterData.priceMin);
    expect(priceMaxInput.value).toBe(mockFilterData.priceMax); // Corrected line

    const bedroomsMin = screen.getByTestId('bedroomsMin').querySelector('input');
    const bedroomsMax = screen.getByTestId('bedroomsMax').querySelector('input');
    expect(bedroomsMin.value).toBe(mockFilterData.bedroomsMin);
    expect(bedroomsMax.value).toBe(mockFilterData.bedroomsMax);
  });

  it('allows user to change bedroom values', () => {
    const bedroomsMinInput = screen.getByTestId('bedroomsMin').querySelector('input');
    fireEvent.change(bedroomsMinInput, { target: { value: '2' } });
    expect(bedroomsMinInput.value).toBe('2');

    const bedroomsMaxInput = screen.getByTestId('bedroomsMax').querySelector('input');
    fireEvent.change(bedroomsMaxInput, { target: { value: '4' } });
    expect(bedroomsMaxInput.value).toBe('4');
  });

  it('allows user to change price values', () => {
    const priceMinInput = screen.getByTestId('priceMin').querySelector('input');
    fireEvent.change(priceMinInput, { target: { value: '150' } });
    expect(priceMinInput.value).toBe('150');

    const priceMaxInput = screen.getByTestId('priceMax').querySelector('input');
    fireEvent.change(priceMaxInput, { target: { value: '750' } });
    expect(priceMaxInput.value).toBe('750');
  });

  it('calls handleFiltersApply with empty object on clean filters button click', () => {
    fireEvent.click(screen.getByText('CLEAN FILTERS'));
    expect(mockHandleFiltersApply).toHaveBeenCalledWith({});
  });

  it('calls handleFilterClose on cancel button click', () => {
    fireEvent.click(screen.getByText('CANCEL'));
    expect(mockHandleFilterClose).toHaveBeenCalled();
  });

  it('renders all expected UI elements', () => {
    // Check for the presence of each major UI element
    expect(screen.getByText('APPLY')).toBeInTheDocument();
    expect(screen.getByText('CLEAN FILTERS')).toBeInTheDocument();
    expect(screen.getByText('CANCEL')).toBeInTheDocument();

    // Check for input fields
    expect(screen.getByTestId('bedroomsMin')).toBeInTheDocument();
    expect(screen.getByTestId('priceMax')).toBeInTheDocument();
    // Add checks for other inputs, labels, dividers, etc.
  });
  it('closes the dialog on cancel button click', () => {
    fireEvent.click(screen.getByText('CANCEL'));
    expect(mockHandleFilterClose).toHaveBeenCalled();
  });

  it('resets filters on clean filters button click', () => {
    // Change some inputs before clearing
    fireEvent.change(screen.getByTestId('bedroomsMin').querySelector('input'), { target: { value: '3' } });
    fireEvent.change(screen.getByTestId('priceMax').querySelector('input'), { target: { value: '800' } });

    // Click the clean filters button
    fireEvent.click(screen.getByText('CLEAN FILTERS'));

    // Verify if the inputs are reset. This depends on how your reset logic is implemented.
    // For example, you could check if handleFiltersApply was called with the default values.
    expect(mockHandleFiltersApply).toHaveBeenCalledWith({});
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import EnhancedDateRangePicker from '../components/CustomDatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker

describe('EnhancedDateRangePicker', () => {
  // Mock data for testing
  const mockDateRange = {
    start: new Date('2023-01-01'),
    end: new Date('2023-01-10'),
  };

  const mockChangeDateStart = jest.fn();
  const mockChangeDateEnd = jest.fn();

  const mockAvailability = [
    { start: '2023-01-01', end: '2023-01-05' },
    { start: '2023-01-08', end: '2023-01-10' },
  ];

  it('correctly renders with initial date range', () => {
    const wrapper = shallow(
      <EnhancedDateRangePicker
        dateRange={{ start: '2023-05-01', end: '2023-07-16' }}
        chanegDateStart={() => {}}
        chanegDateEnd={() => {}}
        availability={[]}
      />
    );

    // Perform expectations based on your UI, for example:
    expect(wrapper.find(DatePicker).at(0).prop('value')).toEqual('2023-05-01');
    expect(wrapper.find(DatePicker).at(1).prop('value')).toEqual('2023-07-16');
  });

  it('renders EnhancedDateRangePicker with provided dateRange and availability', () => {
    const wrapper = shallow(
      <EnhancedDateRangePicker
        dateRange={mockDateRange}
        chanegDateStart={mockChangeDateStart}
        chanegDateEnd={mockChangeDateEnd}
        availability={mockAvailability}
      />
    );

    // Your assertions go here
    // Example:
    expect(wrapper.find(DatePicker)).toHaveLength(2); // Assuming you have two DatePickers
    expect(wrapper.find('[label="Check-In"]').prop('value')).toEqual(mockDateRange.start);
    expect(wrapper.find('[label="Check-Out"]').prop('value')).toEqual(mockDateRange.end);
  });

  it('simulates a change in date start and end', () => {
    const wrapper = shallow(
      <EnhancedDateRangePicker
        dateRange={mockDateRange}
        chanegDateStart={mockChangeDateStart}
        chanegDateEnd={mockChangeDateEnd}
        availability={mockAvailability}
      />
    );

    // Simulate a change in date start
    wrapper.find('[label="Check-In"]').simulate('change', new Date('2023-01-03'));
    expect(mockChangeDateStart).toHaveBeenCalledTimes(1);

    // Simulate a change in date end
    wrapper.find('[label="Check-Out"]').simulate('change', new Date('2023-01-07'));
    expect(mockChangeDateEnd).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing', () => {
    shallow(
      <EnhancedDateRangePicker
        dateRange={mockDateRange}
        chanegDateStart={() => {}}
        chanegDateEnd={() => {}}
        availability={[]}
      />
    );
  });

  it('correctly disables unavailable dates', () => {
    const wrapper = shallow(
      <EnhancedDateRangePicker
      dateRange={mockDateRange}
      chanegDateStart={mockChangeDateStart}
      chanegDateEnd={mockChangeDateEnd}
      availability={mockAvailability}
      />
    );

    // Ensure that specific dates are disabled based on your logic
    expect(wrapper.find(DatePicker).at(0).props().shouldDisableDate(new Date('2023-01-06'))).toBe(true);
    expect(wrapper.find(DatePicker).at(1).props().shouldDisableDate(new Date('2023-01-12'))).toBe(true);
  });
});

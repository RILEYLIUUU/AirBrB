import React from 'react';
import { shallow } from 'enzyme';
import { render, screen, fireEvent } from '@testing-library/react';
import { SideBar, RegisterButton, SignInButton } from '../components/UserSidebar';
jest.mock('../Request'); // Mocking the sendRequest function

describe('SideBar', () => {
  it('rendered in login', () => {
    render(<SideBar/>)
    expect(screen.getByRole('button', { name: /regist/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders Sign In and Register buttons when user is not logged in', () => {
    render(<SideBar />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders SideBar with Register and Sign in buttons when not logged in', () => {
    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(() => null), // Simulate not being logged in
      clear: jest.fn(),
    };
    global.localStorage = mockLocalStorage;

    // Render SideBar
    const wrapper = shallow(<SideBar />);

    // Expectations
    expect(wrapper.find(RegisterButton)).toHaveLength(1);
    expect(wrapper.find(SignInButton)).toHaveLength(1);
    expect(wrapper.find('#yourListingsButton')).toHaveLength(0);
    expect(wrapper.find('#logoutButton')).toHaveLength(0);
  });

  it('triggers handleViewListings when Signed button is clicked', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(<SignInButton onClick={onClickMock}/>);
    wrapper.simulate('click');
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('triggers handleViewListings when Regist button is clicked', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(<RegisterButton onClick={onClickMock}/>);
    wrapper.simulate('click');
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('triggers handleViewListings when Register button is clicked', () => {
    const handleViewListingsMock = jest.fn();
    render(<RegisterButton onClick={handleViewListingsMock} />);

    fireEvent.click(screen.getByText('Register'));

    expect(handleViewListingsMock).toHaveBeenCalledTimes(1);
  });

  it('renders Sign In and Register buttons when user is not logged in', () => {
    render(<SideBar />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders Your Listings and Logout buttons when user is logged in', () => {
    localStorage.setItem('email', 'test@example.com');
    render(<SideBar />);

    expect(screen.getByText('Your Listings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
})

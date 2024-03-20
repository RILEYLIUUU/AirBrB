import React from 'react';
import Regist from '../../src/page/Regist';
import { BrowserRouter } from 'react-router-dom';

describe('RegisterForm Test', () => {
  beforeEach(() => {
    cy.mount(
      <BrowserRouter>
        <Regist />
      </BrowserRouter>
    );
  });

  it('should display the registration form', () => {
    cy.get('[name=\'email\']').should('be.visible');
    cy.get('[name=\'username\']').should('be.visible');
    cy.get('[name=\'password\']').should('be.visible');
    cy.get('[name=\'confirmPass\']').should('be.visible');
    cy.get('button[name=\'regist\']').should('be.visible');
  });

  it('should allow typing in input fields', () => {
    cy.get('[name=\'email\']').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('[name=\'username\']').type('testuser').should('have.value', 'testuser');
    cy.get('[name=\'password\']').type('password123').should('have.value', 'password123');
    cy.get('[name=\'confirmPass\']').type('password123').should('have.value', 'password123');
  });

  it('should show an error for invalid input', () => {
    cy.get('[name=\'email\']').type('invalid-email').blur();
    cy.get('.error-message').should('contain', 'Invalid email address');
  });

  it('should enable the register button when all fields are valid', () => {
    cy.get('[name=\'email\']').type('validemail@example.com');
    cy.get('[name=\'username\']').type('validusername');
    cy.get('[name=\'password\']').type('validpassword');
    cy.get('[name=\'confirmPass\']').type('validpassword');
    cy.get('button[name=\'regist\']').should('not.be.disabled');
  });

  it('should navigate to login page when clicking on login link', () => {
    cy.get('#redirect-to-regist').click();
    cy.url().should('include', '/Login');
  });
});
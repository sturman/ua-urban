import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent, UserEvent } from '@testing-library/user-event';
import { mockAddWordWithDefinition, mockGetUser } from './mockActions';

import AddWordPage from '@/app/add/page';

let user: UserEvent;

describe('AddWordPage', () => {
  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    mockGetUser.mockResolvedValue({ isAuthenticated: true, email: 'fakemail' });
  });

  test('should render form', async () => {
    const jsx = await AddWordPage();
    render(jsx);
    expect(screen.getByRole('heading', { name: /додати нове слово/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /слово/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /визначення/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /додати/i })).toBeInTheDocument();
  });

  test('should call addWordWithDefinition on submit', async () => {
    mockAddWordWithDefinition.mockResolvedValue({ success: true });
    const jsx = await AddWordPage();

    render(jsx);
    const word = 'word';
    const definition = 'definition';
    const button = screen.getByRole('button', { name: /додати/i });
    const wordInput = screen.getByRole('textbox', { name: /слово/i });
    const definitionInput = screen.getByRole('textbox', { name: /визначення/i });

    await user.click(wordInput);
    await user.paste(word);
    await user.click(definitionInput);
    await user.paste(definition);

    await user.click(button);

    expect(mockAddWordWithDefinition).toHaveBeenCalledWith(word, definition);
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TodoItem } from './TodoItem';
import Modal from '../../ui/Modal'; // Импортируйте модуль, если его нужно замокать

jest.mock('../../ui/Modal', () => {
  return ({ onClose, onBackdropClick, title, children }) => (
    <div>
      <div data-testid="modal-backdrop" onClick={onBackdropClick}></div>
      <div data-testid="modal-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
});

describe('TodoItem Component', () => {
  const mockOnChange = jest.fn();
  const mockOnTaskDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Рендер TodoItem с переданными пропсами', () => {
    render(
      <TodoItem
        id="1"
        label="Тестовая задача"
        isCompleted={false}
        onChange={mockOnChange}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    
    expect(screen.getByText('Тестовая задача')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('Вызов onChange когда чекбокс был кликнут', () => {
    render(
      <TodoItem
        id="1"
        label="Тестовая задача"
        isCompleted={false}
        onChange={mockOnChange}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnChange).toHaveBeenCalledWith('1', true);
  });

  test('Открытие и закрытие модалки удаления', () => {
    render(
      <TodoItem
        id="1"
        label="Тестовая задача"
        isCompleted={false}
        onChange={mockOnChange}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  test('Вызов onTaskDelete когда кнопка Удалить была нажата', () => {
    render(
      <TodoItem
        id="1"
        label="Тестовая задача"
        isCompleted={false}
        onChange={mockOnChange}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Удалить'));
    expect(mockOnTaskDelete).toHaveBeenCalledWith('1');
  });
});
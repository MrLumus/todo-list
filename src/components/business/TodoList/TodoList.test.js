import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TodoList } from './TodoList';
import Modal from '../../ui/Modal';

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

describe('TodoList Component', () => {
  const mockOnChange = jest.fn();
  const mockOnAddTask = jest.fn();
  const mockOnDeleteGroup = jest.fn();
  const mockOnTaskDelete = jest.fn();
  const mockOnCompleteAll = jest.fn();
  const mockOnUncompleteAll = jest.fn();

  const group = {
    group_id: '1',
    group_label: 'Test Group',
    items: [
      { id: '1', label: 'Task 1', isCompleted: false },
      { id: '2', label: 'Task 2', isCompleted: true }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Рендер TodoList с переданной группой и задачами', () => {
    render(
      <TodoList
        group={group}
        onChange={mockOnChange}
        onAddTask={mockOnAddTask}
        onDeleteGroup={mockOnDeleteGroup}
        onTaskDelete={mockOnTaskDelete}
        onCompleteAll={mockOnCompleteAll}
        onUncompleteAll={mockOnUncompleteAll}
      />
    );

    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Test Group'));

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  test('Добавление задачи при клике на кнопку добавления', () => {
    render(
      <TodoList
        group={group}
        onChange={mockOnChange}
        onAddTask={mockOnAddTask}
        onDeleteGroup={mockOnDeleteGroup}
        onTaskDelete={mockOnTaskDelete}
        onCompleteAll={mockOnCompleteAll}
        onUncompleteAll={mockOnUncompleteAll}
      />
    );

    fireEvent.change(screen.getByLabelText(/Добавить задачу/i), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('+'));
    
    expect(mockOnAddTask).toHaveBeenCalledWith('1', 'New Task');
  });

  test('Открытие и закрытие модалок', () => {
    render(
      <TodoList
        group={group}
        onChange={mockOnChange}
        onAddTask={mockOnAddTask}
        onDeleteGroup={mockOnDeleteGroup}
        onTaskDelete={mockOnTaskDelete}
        onCompleteAll={mockOnCompleteAll}
        onUncompleteAll={mockOnUncompleteAll}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Удалить/i }));
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  test('Вызов onDeleteGroup при подтверждении удаления', () => {
    render(
      <TodoList
        group={group}
        onChange={mockOnChange}
        onAddTask={mockOnAddTask}
        onDeleteGroup={mockOnDeleteGroup}
        onTaskDelete={mockOnTaskDelete}
        onCompleteAll={mockOnCompleteAll}
        onUncompleteAll={mockOnUncompleteAll}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Удалить/i }));
    fireEvent.click(screen.getByText('Удалить'));
    expect(mockOnDeleteGroup).toHaveBeenCalledWith('1');
  });

  test('Раскрытие и скрытие списка задач по клику', () => {
    render(
      <TodoList
        group={group}
        onChange={mockOnChange}
        onAddTask={mockOnAddTask}
        onDeleteGroup={mockOnDeleteGroup}
        onTaskDelete={mockOnTaskDelete}
        onCompleteAll={mockOnCompleteAll}
        onUncompleteAll={mockOnUncompleteAll}
      />
    );

    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Test Group'));
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  test('Вызов onCompleteAll и onUncompleteAll', () => {
    render(
      <TodoList
        group={group}
        onChange={mockOnChange}
        onAddTask={mockOnAddTask}
        onDeleteGroup={mockOnDeleteGroup}
        onTaskDelete={mockOnTaskDelete}
        onCompleteAll={mockOnCompleteAll}
        onUncompleteAll={mockOnUncompleteAll}
      />
    );

    fireEvent.click(screen.getByText('Test Group'));
    fireEvent.click(screen.getByText('Выполнить всё'));
    expect(mockOnCompleteAll).toHaveBeenCalledWith('1');

    fireEvent.click(screen.getByText('Отменить всё'));
    expect(mockOnUncompleteAll).toHaveBeenCalledWith('1');
  });
});
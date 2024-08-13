import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Рендер сообщения об отсутствии групп задач', () => {
    render(<App />);
    
    expect(screen.getByText(/У Вас нет ни одной группы задач/i)).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  test('Открытие модалки при клике на кнопку добавления', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('+'));
    
    expect(screen.getByText(/Добавить группу задач/i)).toBeInTheDocument();
  });

  test('Добавление новой группы', () => {
    render(<App />);

    fireEvent.click(screen.getByText('+'));
    
    const input = screen.getByLabelText(/Введите название группы/i);
    fireEvent.change(input, { target: { value: 'Новая группа' } });

    fireEvent.click(screen.getByRole('button', {name: /Добавить/i}));

    expect(screen.getByText('Новая группа')).toBeInTheDocument();
    expect(screen.queryByText(/У Вас нет ни одной группы задач/i)).not.toBeInTheDocument();
  });

  test('Добавление задач в группу', () => {
    render(<App />);

    fireEvent.click(screen.getByText('+'));
    
    const input = screen.getByLabelText(/Введите название группы/i);
    fireEvent.change(input, { target: { value: 'Новая группа' } });

    fireEvent.click(screen.getByRole('button', {name: /Добавить/i}));

    fireEvent.click(screen.getByText('Новая группа'));

    const taskInput = screen.getByLabelText(/Добавить задачу/i);
    fireEvent.change(taskInput, { target: { value: 'Новая задача' } });

    let form = screen.getByLabelText(/Добавить задачу/i).closest('form');
    fireEvent.click(within(form).getByRole('button', { name: '+' }));

    expect(screen.getByText('Новая задача')).toBeInTheDocument();
  });

  test('Выполнение всех задач в группе', () => {
    render(<App />);

    fireEvent.click(screen.getByText('+'));
    
    const input = screen.getByLabelText(/Введите название группы/i);
    fireEvent.change(input, { target: { value: 'Новая группа' } });

    fireEvent.click(screen.getByRole('button', {name: /Добавить/i}));

    fireEvent.click(screen.getByText('Новая группа'));

    const taskInput = screen.getByLabelText(/Добавить задачу/i);
    fireEvent.change(taskInput, { target: { value: 'Задача 1' } });

    let form = screen.getByLabelText(/Добавить задачу/i).closest('form');
    fireEvent.click(within(form).getByRole('button', { name: '+' }));

    fireEvent.change(taskInput, { target: { value: 'Задача 2' } });
    fireEvent.click(within(form).getByRole('button', { name: '+' }));

    fireEvent.click(screen.getByText(/Выполнить всё/i));

    const tasks = screen.getAllByRole('checkbox');
    tasks.forEach(task => expect(task).toBeChecked());
  });

  test('Отмена выполнения всех задач в группе', () => {
    render(<App />);

    fireEvent.click(screen.getByText('+'));
    
    const input = screen.getByLabelText(/Введите название группы/i);
    fireEvent.change(input, { target: { value: 'Новая группа' } });

    fireEvent.click(screen.getByRole('button', {name: /Добавить/i}));

    fireEvent.click(screen.getByText('Новая группа'));

    const taskInput = screen.getByLabelText(/Добавить задачу/i);
    fireEvent.change(taskInput, { target: { value: 'Задача 1' } });

    let form = screen.getByLabelText(/Добавить задачу/i).closest('form');
    fireEvent.click(within(form).getByRole('button', { name: '+' }));

    fireEvent.change(taskInput, { target: { value: 'Задача 2' } });

    fireEvent.click(within(form).getByRole('button', { name: '+' }));

    fireEvent.click(screen.getByText(/Отменить всё/i));

    const tasks = screen.getAllByRole('checkbox');
    tasks.forEach(task => expect(task).not.toBeChecked());
  });
  
  test('Удаление группы', () => {
    render(<App />);

    fireEvent.click(screen.getByText('+'));
    
    const input = screen.getByLabelText(/Введите название группы/i);
    fireEvent.change(input, { target: { value: 'Новая группа' } });

    fireEvent.click(screen.getByRole('button', {name: /Добавить/i}));

    expect(screen.getByText('Новая группа')).toBeInTheDocument();

    fireEvent.click(screen.getByAltText(/Удалить/i));
    fireEvent.click(screen.getByText(/Удалить/i));

    expect(screen.queryByText('Новая группа')).not.toBeInTheDocument();
  });
});
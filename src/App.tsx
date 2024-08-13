import { useEffect, useState } from 'react';
import TodoList from './components/business/TodoList/index';
import Modal from './components/ui/Modal';
import { Button, TextField } from '@mui/material';
import { IGroup } from './types/items';
import './App.css';

function App() {
const [groups, setGroups] = useState<IGroup[]>([]);
const [isModalShow, setModalShow] = useState<boolean>(false);
const [groupName, setGroupName] = useState<string>("")

useEffect(() => {
  const groups = localStorage.getItem("groups");

  if (!groups) return;

  setGroups(JSON.parse(groups) as IGroup[]);
}, [])

  const handleAddGroup = () => {
    const uniqueID = `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const updGroups: IGroup[] = JSON.parse(JSON.stringify(groups));

    updGroups.push({
      group_id: uniqueID,
      group_label: groupName,
      items: []
    });

    console.log(updGroups);

    setGroups(updGroups);
    localStorage.setItem("groups", JSON.stringify(updGroups));
    handleModalClose();
  }

  const handleModalClose = () => {
    setGroupName("");
    setModalShow(false);
  }

  const handleStatusChange = (group_id: string, item_id: string, status: boolean) => {
    const updGroups: IGroup[] = JSON.parse(JSON.stringify(groups));

    updGroups.forEach(group => {
      if (group.group_id !== group_id) return;

      group.items.forEach(item => {
        if (item.id !== item_id) return;

        item.isCompleted = status;
      })
    })

    setGroups(updGroups);
    localStorage.setItem("groups", JSON.stringify(updGroups));
  }

  const handleAddTask = (group_id: string, label: string) => {
    const uniqueID = `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const updGroups: IGroup[] = JSON.parse(JSON.stringify(groups));

    updGroups.forEach((group) => {
      if (group.group_id === group_id) {
        group.items.push({
          id: uniqueID,
          label,
          isCompleted: false
        })
      }
    })

    setGroups(updGroups);
    localStorage.setItem("groups", JSON.stringify(updGroups));
  }

  const handleDeleteGroup = (group_id: string) => {
    let updGroups: IGroup[] = JSON.parse(JSON.stringify(groups));
    updGroups = updGroups.filter(group => group.group_id !== group_id);

    setGroups(updGroups);
    localStorage.setItem("groups", JSON.stringify(updGroups));
  }

  const handleDeleteTask = (group_id: string, task_id: string) => {
    let updGroups: IGroup[] = JSON.parse(JSON.stringify(groups));

    updGroups.forEach(group => {
      if (group.group_id !== group_id) return;

      group.items = group.items.filter(item => item.id !== task_id);
    })

    setGroups(updGroups);
    localStorage.setItem("groups", JSON.stringify(updGroups));
  }

  const handleCompleteAllTasks = (group_id: string) => {
    let updGroups: IGroup[] = JSON.parse(JSON.stringify(groups));

    updGroups.forEach(group => {
      if (group.group_id !== group_id) return;

      group.items.forEach(item => item.isCompleted = true);
    })

    setGroups(updGroups);
    localStorage.setItem("groups", JSON.stringify(updGroups));
  }

  const handleUncompleteAllTasks = (group_id: string) => {
    let updGroups: IGroup[] = JSON.parse(JSON.stringify(groups));

    updGroups.forEach(group => {
      if (group.group_id !== group_id) return;

      group.items.forEach(item => item.isCompleted = false);
    })

    setGroups(updGroups);
    localStorage.setItem("groups", JSON.stringify(updGroups));
  }

  return (
    <section className="App">
      {isModalShow && (
        <Modal
          title="Добавить группу задач"
          onClose={handleModalClose}
          onBackdropClick={handleModalClose}
        >
          <TextField
            fullWidth
            label="Введите название группы"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button
            variant='contained'
            onClick={handleAddGroup}
          >
            Добавить
          </Button>
        </Modal>
      )}
      <div className='todoLists'>
        <button
          className='addGroupButton'
          onClick={() => setModalShow(true)}
        >
          +
        </button>
        {!groups.length && (
          <div className="emptyGroups">
            У Вас нет ни одной группы задач. <br /> Добавьте Вашу первую группу с помощью плавающей кнопки в правом нижнем углу экрана
          </div>
        )}
        {groups.map(group => (
          <TodoList
            key={group.group_id}
            group={group}
            onChange={handleStatusChange}
            onAddTask={handleAddTask}
            onDeleteGroup={handleDeleteGroup}
            onTaskDelete={handleDeleteTask}
            onCompleteAll={handleCompleteAllTasks}
            onUncompleteAll={handleUncompleteAllTasks}
        />
        ))}
      </div>
    </section>
  );
}

export default App;

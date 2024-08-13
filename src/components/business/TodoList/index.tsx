import React, { useEffect, useState } from "react";
import TodoItem from "../TodoItem";
import { Button, TextField } from "@mui/material";
import Arrow from "../../../svg/triangle.svg";
import Trash from "../../../svg/trash.svg";
import { IGroup } from "../../../types/items";
import styles from "./index.module.scss";
import Modal from "../../ui/Modal";

type props = {
  group: IGroup;
  onChange: (group_id: string, item_id: string, status: boolean) => void;
  onAddTask: (group_id: string, label: string) => void;
  onDeleteGroup: (group_id: string) => void;
  onTaskDelete: (group_id: string, task_id: string) => void;
  onCompleteAll: (group_id: string) => void;
  onUncompleteAll: (group_id: string) => void;
}

const TodoList = ({
    group,
    onChange,
    onAddTask,
    onDeleteGroup,
    onTaskDelete,
    onCompleteAll,
    onUncompleteAll,
  }: props) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [completedTasks, setCompetedTasks] = useState<number>(
    countOfCompletedTasks()
  );
  const [totalTasks, setTotalTasks] = useState<number>(group.items.length);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  function countOfCompletedTasks() {
    return group.items.map(item => +item.isCompleted).reduce((sum, curr) => sum + curr, 0);
  }

  const handleItemChange = (id: string, status: boolean) => {
    onChange(group.group_id, id, status);
  }

  const handleAddTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAddTask(group.group_id, taskName);
    setTaskName("");
    setOpen(true);
  }

  const handleDelete = () => {
    onDeleteGroup(group.group_id);
    setDeleteModalOpen(false);
  }

  const handleTaskDelete = (task_id: string) => onTaskDelete(group.group_id, task_id);

  useEffect(() => {
    setCompetedTasks(countOfCompletedTasks());
    setTotalTasks(group.items.length);
  }, [group]);

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        {group.group_label}
        <button className={styles.trash} onClick={() => setDeleteModalOpen(true)}>
          <img src={Trash} alt="Удалить" />
        </button>
      </div>
      <div className={styles.header} onClick={() => setOpen((open) =>!open)}>
        <div className={styles.actions}>
          <div className={styles.input}>
            <TextField
              label="Добавить задачу"
              variant="filled"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {!!taskName && (
            <button
              className={styles.addButton}
              onClick={handleAddTask}
            >+</button>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.completed}>{completedTasks} / {totalTasks}</span>
          <img
            src={Arrow}
            alt={isOpen ? "Свернуть" : "Развернуть"}
            className={!isOpen ? styles.rotatedArrow : undefined}
          />
        </div>
      </div>
      {!!isOpen && (
        <div className={[styles.items, !isOpen ? styles.hiddenList : undefined].join(" ")}>
        {group.items.map(item => (
          <TodoItem
            key={item.id}
            id={item.id}
            label={item.label}
            isCompleted={item.isCompleted}
            onChange={handleItemChange}
            onTaskDelete={handleTaskDelete}
          />
        ))}
        <div className={styles.footer}>
          <button onClick={() => onCompleteAll(group.group_id)}>Выполнить всё</button>
          <button onClick={() => onUncompleteAll(group.group_id)}>Отменить всё</button>
        </div>
      </div>
      )}
      {isDeleteModalOpen && (
        <Modal
          onClose={() => setDeleteModalOpen(false)}
          onBackdropClick={() => setDeleteModalOpen(false)}
          title={`Подтвердите удаление группы "${group.group_label}"`}
        >
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Удалить
          </Button>
          <Button
            color="info"
            variant="contained"
            onClick={() => setDeleteModalOpen(false)}
          >
            Отмена
          </Button>
        </Modal>
      )}
    </div>
  )
}

export default React.memo(TodoList);
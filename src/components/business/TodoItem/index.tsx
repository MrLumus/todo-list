import React, { useState } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Trash from "../../../svg/trash.svg";
import styles from "./index.module.scss";
import Modal from "../../ui/Modal";

type props = {
  id: string,
  label: string,
  isCompleted: boolean,
  onChange: (id: string, status: boolean) => void,
  onTaskDelete: (task_id: string) => void,
}

const TodoItem = ({
    id,
    label,
    isCompleted,
    onChange,
    onTaskDelete,
  }: props) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const onStatusChange = () => {
    onChange(id, !isCompleted);
  }

  const handleTaskDelete = () => {
    onTaskDelete(id);
  }

  return (
    <div className={styles.todoItem}>
      <FormGroup>
        <FormControlLabel
          sx={{
            "textDecoration": isCompleted ? "line-through" : "none",
            "color": isCompleted ? "#369100" : "#333"
          }}
          control={
            <Checkbox
              checked={isCompleted}
              onChange={onStatusChange}
            />
          }
          label={label}
        />
      </FormGroup>
      <button className={styles.trash} onClick={() => setDeleteModalOpen(true)}>
        <img src={Trash} alt="Удалить задачу" />
      </button>

      {isDeleteModalOpen && (
        <Modal
          onClose={() => setDeleteModalOpen(false)}
          onBackdropClick={() => setDeleteModalOpen(false)}
          title={`Подтвердите удаление задачи "${label}"`}
        >
        <Button
          color="error"
          variant="contained"
          onClick={handleTaskDelete}
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

export default React.memo(TodoItem)

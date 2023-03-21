import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css'

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get', {
        headers: { 'X-Api-Key': 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c' }
      })
      .then(response => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleTodoComplete = (todoId, isComplete) => {
    axios
      .patch(`https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch/${todoId}`, { isComplete }, {
        headers: { 'X-Api-Key': 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c' }
      })
      .then(response => {
        if (response.data.status === 'success') {
          setTodos(prevTodos => {
            const updatedTodos = prevTodos.map(todo => {
              if (todo.id === todoId) {
                return { ...todo, isComplete };
              } else {
                return todo;
              }
            });
            return updatedTodos;
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getFormattedDueDate = dueDate => {
    const date = new Date(dueDate);
    return date.toLocaleString().split(',')[0];
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.isComplete && !b.isComplete) { // both not completed
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      } else {
        return 0;
      }
    } else if (a.isComplete && b.isComplete) {
      return 0;
    } else if (a.isComplete) {
      return 1;
    } else {
      return -1;
    }
  });

  const isOverDue = (item) => {
    if (item.isComplete) return false;




    if (!item.isComplete && item.dueDate) { 
      const dueDate = new Date(item.dueDate);
      const now = new Date();

      if (dueDate < now) { 
        return true;
      }
    }
    return false;
  }
  //console.log(todos)
  return (
    <div className="todo-list">
      {loading && <div>Loading...</div>}
      {!loading && sortedTodos.map(todo => (
        <div key={todo.id} className={`todo-item ${todo.isComplete ? 'complete' : ''} ${isOverDue(todo) ? 'outDated' : ''}`}>

          <div className='prefix'>
            <input
            type="checkbox"
            checked={todo.isComplete}
            onChange={event => handleTodoComplete(todo.id, event.target.checked)}
          />
    

          <div className={`description ${todo.isComplete ? 'completeLine' : ''}`}>{todo.description}</div>

          </div>
          {todo.dueDate && <div className={`due-date ${new Date(todo.dueDate) < new Date() ? 'overdue' : ''}`}>
            {getFormattedDueDate(todo.dueDate)}
          </div>}
        </div>
      ))}
    </div>
  );
};

export default TodoList
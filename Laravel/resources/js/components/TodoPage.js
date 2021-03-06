import React, { useState } from 'react'
import useSWR from 'swr'
import { Todo } from './Todo'
import { TodoCreate } from './TodoCreate'
import Axios from 'axios'

export const TodoPage = () => {
  const { data: todos } = useSWR('/api/todo')
  const [ids, setIds] = useState([])
  const [currentFilter, setCurrentFilter] = useState(null)

  if (!todos) {
    return <p>{'loading..'}</p>
  }

  if (todos.length === 0) {
    return <p>{'empty...'}</p>
  }

  const onDeleteTodos = async () => {
    const promises = ids.map((id) => {
      return Axios({ url: `/api/todo/${id}`, method: 'DELETE' })
    })
    await Promise.all(promises)
    window.location.reload()
  }

  const currentTodos = todos.filter((todo) => {
    if (currentFilter === 'done') {
      return todo.status === 2
    }

    if (currentFilter === 'in-progress') {
      return todo.status === 1
    }

    if (currentFilter === 'deadline') {
      return new Date(todo.deadline) < new Date()
    }

    return true
  })

  return (
    <div>
      <h1 className={'mb-4'}>新規ToDo作成</h1>
      <TodoCreate />
      <h1 className={'mb-3 mt-3'}>ToDoList</h1>
      <button
        className={`border rounded-full px-4 hover:bg-blue-500 hover:text-white ml-2`}
        onClick={() => setCurrentFilter(null)}
      >
        全て表示
      </button>
      <button
        className={`border rounded-full px-4 hover:bg-blue-500 hover:text-white ml-2`}
        onClick={() => setCurrentFilter('in-progress')}
      >
        未完表示
      </button>
      <button
        className={`border rounded-full px-4 hover:bg-blue-500 hover:text-white ml-2`}
        onClick={() => setCurrentFilter('done')}
      >
        完了表示
      </button>
      <button
        className={`border rounded-full px-4 hover:bg-blue-500 hover:text-white ml-2`}
        onClick={() => setCurrentFilter('deadline')}
      >
        期限切れ表示
      </button>
      <ul className={`mt-3`}>
        {currentTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <Todo
                todo={todo}
                checked={ids.includes(todo.id)}
                onCheck={() => {
                  const index = ids.indexOf(todo.id)
                  if (index === -1) {
                    const newIds = [...ids, todo.id]
                    setIds(newIds)
                    return
                  }
                  const newIds = [...ids]
                  newIds.splice(index, 1)
                  setIds(newIds)
                }}
              />
            </li>
          )
        })}
      </ul>
      <button
        onClick={onDeleteTodos}
        className={
          'border px-4 bg-red-500 rounded-full hover:opacity-75 mb-3 mt-3'
        }
      >
        チェックしたtodoを一括削除
      </button>
    </div>
  )
}

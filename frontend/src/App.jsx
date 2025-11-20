// function App() {
//   return (
//     <div className="min-h-screen bg-blue-500 flex items-center justify-center">
//       <h1 className="text-4xl font-bold text-white">
//         Tailwind is Working! 🎉
//       </h1>
//     </div>
//   );
// }

// export default App;
import { useState } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input])
      setInput('')
    }
  }

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          My Todo List
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">No todos yet!</p>
          ) : (
            todos.map((todo, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <span>{todo}</span>
                <button
                  onClick={() => deleteTodo(index)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
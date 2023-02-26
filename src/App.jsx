import KanbanBoard from './components/dnd/board';

function App() {
  return (
    <div className='App'>
      <div className='sticky top-0 w-full p-4 bg-blue-400 text-xl text-white font-bold'>React Kanban</div>
      <KanbanBoard />
    </div>
  )
}

export default App

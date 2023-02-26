import { DndContext, rectIntersection, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import KanbanLane from "./lane";
import { useState, useEffect } from "react";
import { categories, items } from "../../data/data";
export default function KanbanBoard() {
  const [lanes, setLanes] = useState([])
  const [laneItems, setLaneItems] = useState({})
  const [input, setInput] = useState({
    title: "",
    content: "",
    category: null
  })

  //// add conditions for event triggers so drag events wont collide with click events within the drag area
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  function getListByCat(catId) {
    return items.reduce((res, listItem) => {
      if (listItem.category === catId) {
        res.push(listItem)
      }
      return res
    }, [])
  }

  const handleDragEnd = (e) => {
    const container = e.over?.id;
    const title = e.active.data.current?.title ?? ""
    const parent = e.active.data.current?.parent ?? "ToDo"

    //// check if drop target area is valid
    if (parent !== container) {
      const destinationList = laneItems[container]
      destinationList.push({ title: e.active.data.current?.title, content: e.active.data.current?.content, category: lanes.find(i => i.name === container).id })

      //// remove task from original location and move to target location
      setLaneItems({
        ...laneItems,
        [parent]: laneItems[parent].filter(i => i.title !== title),
        [container]: destinationList
      })
    }
  }

  const addTask = (lane) => {
    setLaneItems({
      ...laneItems, [lane]: [...laneItems[lane], { title: input.title, content: input.content, category: lanes.find(i => i.name === lane).id }]
    })
  }

  const removeTask = (parent, idx) => {
    setLaneItems({
      ...laneItems,
      [parent]: laneItems[parent].filter((i, index) => index !== idx) 
    })
  }

  const formSubmit = (e) => {
    e.preventDefault()
    if (input.category !== null) {
      addTask(lanes.find(i => i.id === input.category).name)
    }
  }

  useEffect(() => {
    ///simulate fetching from backend 
    setLanes(categories)
    const items = {}
    categories.forEach(i => {
      items[i.name] = getListByCat(i.id)
    })
    setLaneItems(items)
  }, [])

  return (
    <>
      <div className="p-4 m-auto w-full max-w-6xl">
        <form onSubmit={formSubmit} className="mb-4 flex flex-col md:flex-row gap-4 justify-start md:items-center">
          <input className="shadow p-2" type="text" onChange={(e) => setInput({ ...input, title: e.target.value })} value={input.title} placeholder="Title" required />
          <input className="shadow p-2" type="text" onChange={(e) => setInput({ ...input, content: e.target.value })} value={input.content} placeholder="Content" required />
          <div className="group px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded focus:outline-none focus:shadow-outline transition-all">
            <div className="text-center">{input.category !== null ? lanes.find(i => i.id === input.category).name : "Category"}</div>
            <div className="hidden p-2 -translate-x-4 translate-y-2 rounded group-hover:block absolute bg-white shadow text-black font-normal">
              {lanes.length ? (lanes.map(i => (<div key={i.id} className="cursor-pointer mb-2 last:mb-0" onClick={() => { setInput({ ...input, category: i.id }) }}>{i.name}</div>))) : null}
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded focus:outline-none focus:shadow-outline transition-all">Add Task</button>
        </form>
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {lanes.length ? (lanes.map((i, idx) => <KanbanLane key={idx} title={i.name} items={laneItems[i.name]} removeTask={removeTask} />)) : null}
          </div>
        </DndContext>
      </div>
    </>
  )
}
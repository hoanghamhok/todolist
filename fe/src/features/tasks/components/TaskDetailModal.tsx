import { useEffect } from "react"
import { X, MoreHorizontal } from "lucide-react"

export default function TaskDetailModal({ open, onClose }) {
  // ESC để đóng modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      
      <div className="bg-white w-[1200px] h-[90vh] rounded-2xl shadow-xl overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">KAN-4</span>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
              In Progress
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-sm border px-3 py-1 rounded-lg">
              Improve Task
            </button>

            <MoreHorizontal size={18} className="cursor-pointer" />
            <X size={18} className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT SIDE */}
          <div className="w-2/3 p-6 overflow-y-auto">
            <h1 className="text-2xl font-semibold mb-6">12312</h1>

            <Section title="Description">
              <p className="text-gray-500">Add a description...</p>
            </Section>

            <Section title="Subtasks">
              <button className="text-blue-500 text-sm">+ Add subtask</button>
            </Section>

            <Section title="Linked work items">
              <button className="text-blue-500 text-sm">+ Add linked work item</button>
            </Section>

            <hr className="my-6" />

            <Section title="Activity">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300" />
                <input
                  placeholder="Add a comment..."
                  className="flex-1 border rounded-lg px-3 py-2 outline-none"
                />
              </div>
            </Section>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/3 bg-gray-50 border-l p-6 text-sm overflow-y-auto">
            <h3 className="font-semibold mb-4">Details</h3>

            <Detail label="Assignee" value="Unassigned" />
            <Detail label="Priority" value="Medium" />
            <Detail label="Parent" value="None" />
            <Detail label="Due date" value="None" />
            <Detail label="Labels" value="None" />
            <Detail label="Team" value="None" />
            <Detail label="Start date" value="None" />
            <Detail label="Reporter" value="Minhh Hoang" />

            <hr className="my-6" />

            <h4 className="font-semibold mb-2">Development</h4>
            <p className="text-gray-500 text-xs">No linked branches</p>

            <hr className="my-6" />

            <h4 className="font-semibold mb-2">Automation</h4>
            <p className="text-gray-500 text-xs">Rule executions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between mb-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
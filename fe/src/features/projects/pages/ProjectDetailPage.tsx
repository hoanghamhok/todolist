import { useParams } from "react-router-dom";
import { useColumn } from "../../columns/hooks/useColumn";
import { useTask } from "../../tasks/hooks/useTasks";
import { useProjectDetails } from "../hooks/useProjectDetails";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <div className="p-6">Invalid project</div>;
  }

  const {
    data: projectRes,
    isLoading: projectLoading,
    isError: projectError,
  } = useProjectDetails(projectId);

  const { columns, loading: columnLoading } = useColumn(projectId);
  const { byColumn, loading: taskLoading } = useTask(projectId);

  if (projectLoading || columnLoading || taskLoading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (projectError || !projectRes) {
    return <div className="p-6 text-red-500">Project not found</div>;
  }

  const project = projectRes.data;

  return (
    <>
      {/* ===== Header ===== */}
      <header className="px-6 py-4 bg-white border-b">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="text-gray-500 text-sm">{project.description}</p>
      </header>

      {/* ===== Board ===== */}
      <main className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6">
          {columns.map(column => (
            <div
              key={column.id}
              className="w-72 shrink-0 bg-gray-100 rounded-lg p-3"
            >
              <h3 className="font-medium mb-3">
                {column.title}
              </h3>

              <div className="space-y-2">
                {(byColumn[column.id] ?? []).map(task => (
                  <div
                    key={task.id}
                    className="bg-white p-3 rounded shadow-sm
                               hover:shadow transition"
                  >
                    <div className="font-medium text-sm">
                      {task.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add column placeholder */}
          <div className="w-72 shrink-0">
            <button
              className="w-full h-12 border-2 border-dashed rounded-lg
                         text-gray-500 hover:bg-gray-100"
            >
              + Add column
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

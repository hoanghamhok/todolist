import { Link } from "react-router-dom";
import { Trash2Icon } from "lucide-react";
import { RemoveProject } from "./DeleteProject";

type ProjectMemberItem = {
  id: string;
  projectId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
  project: {
    id: string;
    name: string;
    description: string;
  };
};

interface ProjectCardProps {
  item: ProjectMemberItem;
}

export function ProjectCard({ item }: ProjectCardProps) {
  const { project, role } = item;

  return (
    <div className="relative bg-white p-6 rounded-lg border hover:shadow-md transition">
      {role === "OWNER" && (
        <div className="absolute top-3 right-3">
          <RemoveProject projectId={project.id} />
        </div>
      )}

      <Link to={`/projects/${project.id}`}>
        <h3 className="font-semibold">
          {project.name}
        </h3>

        <p className="text-sm text-gray-600 mb-2">
          {project.description || "No description"}
        </p>
      </Link>
    </div>
  );
}

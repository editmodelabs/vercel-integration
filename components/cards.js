import { TrashIcon } from "@heroicons/react/solid";
const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
];

function parseTimeStamp(unixTimestamp) {
  const milliseconds = unixTimestamp;
  const dateObject = new Date(milliseconds);
  const today = new Date();
  const raw_duration = (today - dateObject) / (1000 * 60 * 60 * 24);
  const duration = Math.ceil(raw_duration);
  return raw_duration > 1
    ? `Created ${duration} day${duration > 1 ? "s" : ""} ago`
    : "Created under 24 hours ago.";
}

export default function Cards({ projects, setProjects }) {
  const handleRemove = (e, id) => {
    e.preventDefault();
    const list = projects.filter((project) => project.id !== id);
    setProjects(list);
  };
  return (
    <ul
      role="list"
      className={`mb-4 mt-4 grid ${
        projects.length === 1 ? "grid-cols-1" : "grid-cols-2"
      } gap-6 sm:grid-cols-2 lg:grid-cols-2`}
    >
      {projects &&
        projects.map((person) => (
          <li
            key={person.email}
            className={`${
              projects.length === 1 ? `col-span-2` : `col-span-1`
            } bg-white rounded-lg shadow-xl divide-y divide-gray-200`}
          >
            <div className="w-full flex items-center justify-between p-8 space-x-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="text-gray-900 text-sm font-medium truncate">
                    {person.name}
                  </h3>
                </div>
                <p className="mt-1 text-gray-500 text-sm truncate">
                  {parseTimeStamp(person.createdAt)}
                </p>
              </div>

              <svg
                height="26"
                viewBox="0 0 75 65"
                fill="var(--geist-foreground)"
              >
                <title>Vercel Logo</title>
                <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
              </svg>
            </div>
            <div>
              {projects.length > 1 && (
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="w-0 flex-1 flex">
                    <div
                      className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                      style={{
                        cursor: "pointer",
                        pointerEvents: projects.length === 1 ? `none` : `auto`,
                      }}
                      onClick={(e) => handleRemove(e, person.id)}
                    >
                      <TrashIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-3">Exclude</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
    </ul>
  );
}

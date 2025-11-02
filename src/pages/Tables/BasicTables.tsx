import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge.tsx";
import Button from "../../components/ui/button/Button.tsx";
import {PencilIcon, TrashBinIcon} from "../../icons";

type Role = "admin" | "operator" | "supervisor";
type Status = "Active" | "Disabled";

interface UserRow {
    id: number;
    avatar: string;
    name: string;
    email: string;
    role: Role;
    status: Status;
}

const mockUsers: UserRow[] = [
    {
        id: 1,
        avatar: "/images/user/user.png",
        name: "Operator 1",
        email: "operator@demo.az",
        role: "operator",
        status: "Active",
    },
    {
        id: 2,
        avatar: "/images/user/user.png",
        name: "Nəzarətçi 1",
        email: "supervisor@demo.az",
        role: "supervisor",
        status: "Active",
    },
];

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
              <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                          Əməlliyatçılar
                      </h3>
                  </div>

                  <div className="flex items-center gap-3">
                      <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                          <svg
                              className="stroke-current fill-white dark:fill-gray-800"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                          >
                              <path
                                  d="M2.29004 5.90393H17.7067"
                                  stroke=""
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                              />
                              <path
                                  d="M17.7075 14.0961H2.29085"
                                  stroke=""
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                              />
                              <path
                                  d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                                  fill=""
                                  stroke=""
                                  strokeWidth="1.5"
                              />
                              <path
                                  d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                                  fill=""
                                  stroke=""
                                  strokeWidth="1.5"
                              />
                          </svg>
                          Filter
                      </button>
                  </div>
              </div>
              <div className="max-w-full overflow-x-auto">
                  <Table>
                      {/* Table Header */}
                      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                          <TableRow>
                              <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                              >
                                  Əməlliyatçı
                              </TableCell>
                              <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                              >
                                  Email
                              </TableCell>
                              <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                              >
                                  Rol
                              </TableCell>
                              <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                              >
                                  Status
                              </TableCell>
                              <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                              >
                                  Əməliyyatlar
                              </TableCell>
                          </TableRow>
                      </TableHeader>

                      {/* Table Body */}
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                          {mockUsers.map((u) => (
                              <TableRow key={u.id}>
                                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 overflow-hidden rounded-full">
                                              <img
                                                  width={40}
                                                  height={40}
                                                  src={u.avatar}
                                                  alt={u.name}
                                              />
                                          </div>
                                          <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {u.name}
                      </span>
                                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        ID: #{u.id}
                      </span>
                                          </div>
                                      </div>
                                  </TableCell>
                                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                      {u.email}
                                  </TableCell>
                                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                      {u.role}
                                  </TableCell>
                                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                      <Badge size="sm" color={u.status === "Active" ? "success" : "warning"}>
                                          {u.status}
                                      </Badge>
                                  </TableCell>
                                  {/* Actions */}
                                  <TableCell className="px-4 py-3 text-start">
                                      <div className="inline-flex items-center gap-2">
                                          <Button variant={"gradient"} color={"teal"} size={"xs"}>
                                              <PencilIcon/>
                                          </Button>
                                          <Button variant={"gradient"} color={"red"} size={"xs"}>
                                              <TrashBinIcon/>
                                          </Button>
                                      </div>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          </div>
      </div>
    </>
  );
}

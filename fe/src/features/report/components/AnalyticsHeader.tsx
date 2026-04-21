import React, { Fragment } from "react";
import { Listbox, Transition } from '@headlessui/react';
import { Icon } from "./Icon";

interface AnalyticsHeaderProps {
  selectedDays: number;
  setSelectedDays: (days: number) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  projects: any[];
  options: { label: string; value: number }[];
  shadow: any;
}

export function AnalyticsHeader({
  selectedDays,
  setSelectedDays,
  selectedProjectId,
  setSelectedProjectId,
  projects,
  options,
  shadow
}: AnalyticsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-[28px] font-black tracking-tight text-gray-900">
          Workspace Analytics
        </h2>
        <p className="text-md text-gray-500 mt-1.5">
          Track progress, performance, and delivery health in real time
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Date selector */}
        <div className="w-52">
          <Listbox
            value={options.find(opt => opt.value === selectedDays)}
            onChange={(opt: any) => setSelectedDays(opt.value)}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white border border-slate-200 py-2.5 pl-10 pr-10 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <span className="flex items-center gap-2">
                  <Icon name="calendar_month" className="absolute left-3 text-slate-400" size={18} />
                  <span className="block truncate font-semibold text-slate-700 text-sm">
                    {options.find(opt => opt.value === selectedDays)?.label}
                  </span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <Icon name="expand_more" className="text-slate-400 transition-transform ui-open:rotate-180" size={18} />
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-1.5 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  {options.map((opt) => (
                    <Listbox.Option
                      key={opt.value}
                      value={opt}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors ${
                          active ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate text-sm ${selected ? 'font-bold' : 'font-medium'}`}>
                            {opt.label}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <Icon name="check" size={16} />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Project selector */}
        {projects.length > 0 && (
          <div className="w-64">
            <Listbox
              value={selectedProjectId}
              onChange={setSelectedProjectId}
            >
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white border border-slate-200 py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200">
                  <span className="flex items-center gap-2">
                    <Icon name="folder" className="text-slate-400" size={18} />
                    <span className="block truncate font-semibold text-slate-700 text-sm">
                      {projects.find((p) => p.projectId === selectedProjectId)?.project.name || "Select Project"}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Icon
                      name="expand_more"
                      className="text-slate-400 transition-transform duration-300 ui-open:rotate-180"
                      size={18}
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-1.5 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {projects.map((p) => (
                      <Listbox.Option
                        key={p.id}
                        value={p.projectId}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                            active ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate text-sm ${selected ? 'font-bold' : 'font-medium'}`}>
                              {p.project.name}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <Icon name="check" size={16} />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        )}
      </div>
    </div>
  );
}

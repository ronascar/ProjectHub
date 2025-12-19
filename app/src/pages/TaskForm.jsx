import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function TaskForm() {
    const { taskId } = useParams();
    const isEditing = Boolean(taskId);

    // Mock Data for Edit Mode
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        assignee: '',
        deadline: '',
        estimate: '',
        actual: ''
    });

    useEffect(() => {
        if (isEditing) {
            // Simulate fetch
            setFormData({
                title: 'Implement new authentication flow',
                description: 'The current authentication flow needs to be updated to support OAuth2.0 providers including Google and GitHub. Please refer to the updated security specifications.',
                status: 'In Progress',
                priority: 'High',
                assignee: 'Michael Chen',
                deadline: '2023-11-24',
                estimate: '8h',
                actual: '2.5h'
            });
        }
    }, [isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Header & Breadcrumbs */}
            <header className="flex-shrink-0 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark px-6 py-4 flex flex-col gap-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                    <Link to="/projects" className="text-gray-500 dark:text-text-secondary hover:text-primary transition-colors">Projects</Link>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <Link to="/projects/1" className="text-gray-500 dark:text-text-secondary hover:text-primary transition-colors">Web Redesign</Link>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <span className="text-slate-900 dark:text-white font-medium">{isEditing ? `Task #${taskId}` : 'New Task'}</span>
                </div>
                {/* Page Heading */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{isEditing ? 'Edit Task' : 'Create Task'}</h1>
                        {isEditing && <p className="text-sm text-gray-500 dark:text-text-secondary mt-1">Last updated 2 hours ago by Sarah J.</p>}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/projects/1" className="px-4 py-2 rounded-lg border border-gray-300 dark:border-border-dark text-slate-700 dark:text-text-secondary text-sm font-medium hover:bg-gray-50 dark:hover:bg-card-dark transition-colors">
                            Cancel
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            {isEditing ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN: Main Inputs */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Title Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-text-secondary uppercase tracking-wider">Task Title</label>
                            <input
                                name="title"
                                className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg px-4 py-3 text-lg font-medium text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                            />
                        </div>
                        {/* Description Editor */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-text-secondary uppercase tracking-wider">Description</label>
                            <div className="bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg overflow-hidden">
                                {/* Toolbar */}
                                <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-background-dark">
                                    <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-surface-dark-lighter text-gray-500 dark:text-text-secondary"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
                                    <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-surface-dark-lighter text-gray-500 dark:text-text-secondary"><span className="material-symbols-outlined text-[20px]">format_italic</span></button>
                                    <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-surface-dark-lighter text-gray-500 dark:text-text-secondary"><span className="material-symbols-outlined text-[20px]">format_list_bulleted</span></button>
                                    <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-surface-dark-lighter text-gray-500 dark:text-text-secondary"><span className="material-symbols-outlined text-[20px]">link</span></button>
                                </div>
                                {/* Text Area */}
                                <textarea
                                    name="description"
                                    className="w-full bg-transparent border-none p-4 min-h-[200px] text-slate-900 dark:text-white placeholder-gray-400 focus:ring-0 resize-y"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the task requirements..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Subtasks & Checklists */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">checklist</span> Subtasks
                                </h3>
                                <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">2/4 Completed</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                {/* Item 1 */}
                                <label className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-surface-dark rounded-lg cursor-pointer group transition-colors">
                                    <input type="checkbox" defaultChecked={isEditing} className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-gray-100 dark:bg-surface-dark" />
                                    <span className={`text-sm ${isEditing ? 'text-gray-500 dark:text-gray-400 line-through decoration-gray-400' : 'text-slate-700 dark:text-gray-200'}`}>Setup new OAuth credentials in Google Cloud Console</span>
                                </label>
                                {/* Item 2 */}
                                <label className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-surface-dark rounded-lg cursor-pointer group transition-colors">
                                    <input type="checkbox" defaultChecked={isEditing} className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-gray-100 dark:bg-surface-dark" />
                                    <span className={`text-sm ${isEditing ? 'text-gray-500 dark:text-gray-400 line-through decoration-gray-400' : 'text-slate-700 dark:text-gray-200'}`}>Update database schema for social tokens</span>
                                </label>
                                {/* Item 3 */}
                                <label className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-surface-dark rounded-lg cursor-pointer group transition-colors">
                                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-gray-100 dark:bg-surface-dark" />
                                    <span className="text-sm text-slate-700 dark:text-gray-200">Implement backend logic for token exchange</span>
                                </label>
                                {/* Item 4 */}
                                <label className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-surface-dark rounded-lg cursor-pointer group transition-colors">
                                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-gray-100 dark:bg-surface-dark" />
                                    <span className="text-sm text-slate-700 dark:text-gray-200">Frontend login page updates</span>
                                </label>
                                {/* Add New */}
                                <div className="mt-2 flex items-center gap-2 pl-2">
                                    <span className="material-symbols-outlined text-gray-400 text-sm">add</span>
                                    <input className="bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-gray-500 focus:ring-0 p-0 w-full" placeholder="Add a subtask..." type="text" />
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">attach_file</span> Attachments
                                </h3>
                                <button className="text-xs font-medium text-primary hover:text-blue-400">Upload</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Only show mock files in Edit mode */}
                                {isEditing && (
                                    <>
                                        {/* File Card */}
                                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-border-dark hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors cursor-pointer group">
                                            <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400">
                                                <span className="material-symbols-outlined">picture_as_pdf</span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-primary">specs_v2.pdf</p>
                                                <p className="text-xs text-gray-500">2.4 MB</p>
                                            </div>
                                        </div>
                                        {/* File Card */}
                                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-border-dark hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors cursor-pointer group">
                                            <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                                                <span className="material-symbols-outlined">image</span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-primary">design_mock.png</p>
                                                <p className="text-xs text-gray-500">1.8 MB</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Dropzone */}
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-blue-50 dark:hover:bg-surface-dark/50 transition-colors cursor-pointer text-gray-400 dark:text-gray-500 hover:text-primary">
                                    <span className="material-symbols-outlined mb-1">cloud_upload</span>
                                    <span className="text-xs">Drop files here</span>
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        {isEditing && (
                            <div className="flex flex-col gap-4 mt-2">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Comments (3)</h3>
                                {/* Comment Item */}
                                <div className="flex gap-4 group">
                                    <div className="h-10 w-10 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDp9xUKrgRvIfU_H2psDlfkSwwH-NdcRtBoCEtkb2hWTPaMR7b8xH2FMa0SQMhp5paZHV0ey4U34W_QUskM0Lni8eZWEP8ont8sdDU8vpgFg9SXbVlQ-huqoXmIZshMEIW3aDnsrU5H5HauRbe8CubSMx7O_fg4duIYrpkQVh2aLpAlCSaGrSjtCcEout8Gnf0elQag8wo3PPe5XtUGW4yFSmRevlkMcS0XKApHNcGZyoZNCLoNlgin0w20BOvc33Y5hG2KOoP6P0')" }}></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">Sarah Jenkins</span>
                                            <span className="text-xs text-gray-500">2 hours ago</span>
                                        </div>
                                        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-lg rounded-tl-none p-3 text-sm text-slate-700 dark:text-gray-300">
                                            <p>I've updated the description with the new requirements from the client meeting. Please review.</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Comment Input */}
                                <div className="flex gap-4 mt-2">
                                    <div className="h-10 w-10 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCeZvr4kyK4n-0QYrfwugcKjmQiJo9aWavGlMi0kl0FYPX2BRLVrsp_G7RVmeO5p8zyZuEarUC33AXNpG-bqAKss-pcHfwN_VCdvAV_gcQRtsiPZ6a-e_fBTYgdNfcDuxomJF2w3uKxpFoQwLYkkJMj2elFfCoxsZN73kMjfkefcLzLeEjDuOL__vK7FUwYio3YV-XiKSIGn7S8FuTHO1C5m69kcnlmmop8JzkTbzRM50VlgwpMS54HGMqs24RMCnVtQ7FK9IgoaJo')" }}></div>
                                    <div className="flex-1 relative">
                                        <textarea className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg p-3 pr-12 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary resize-none h-20" placeholder="Write a comment..."></textarea>
                                        <button className="absolute bottom-2 right-2 p-1.5 rounded-md bg-primary text-white hover:bg-blue-600 transition-colors">
                                            <span className="material-symbols-outlined text-[18px] block">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Metadata Sidebar */}
                    <div className="flex flex-col gap-6">
                        {/* Metadata Card */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-5 flex flex-col gap-5 sticky top-6">
                            {/* Status */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-2 block">Status</label>
                                <div className="relative">
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full appearance-none bg-blue-50 dark:bg-[#233648] border-none text-blue-700 dark:text-blue-100 text-sm font-medium rounded-lg py-2.5 px-4 pr-8 focus:ring-2 focus:ring-primary cursor-pointer"
                                    >
                                        <option>In Progress</option>
                                        <option>To Do</option>
                                        <option>Review</option>
                                        <option>Done</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-700 dark:text-blue-100">
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            {/* Priority */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-2 block">Priority</label>
                                <div className="relative">
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full appearance-none bg-red-50 dark:bg-red-900/20 border-none text-red-700 dark:text-red-300 text-sm font-medium rounded-lg py-2.5 px-4 pr-8 focus:ring-2 focus:ring-red-500 cursor-pointer"
                                    >
                                        <option>High</option>
                                        <option>Critical</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-red-700 dark:text-red-300">
                                        <span className="material-symbols-outlined text-sm">priority_high</span>
                                    </div>
                                </div>
                            </div>
                            <hr className="border-gray-100 dark:border-gray-700" />
                            {/* Assignee */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-2 block">Responsible</label>
                                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors border border-transparent hover:border-gray-200 dark:hover:border-border-dark text-left">
                                    {isEditing ? (
                                        <>
                                            <div className="h-8 w-8 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJCMsf5C4iFAluI5F2zsrm6UPTm5UJOr4rf8a3uiNHaJobq9UwhNhn_vMtoZYfH6R7-F8LIkCK99zKf36I_oguTSDucH9kVwARQhCgr8IZXxa3PFoVKBk0paPhF9bzTglgjKaVzofyYAEgGBsp596Kd4RUHdr6pwN-T_3L0P0K34DeapKqGH_eBFGltxJPMMuQ1GCVTmuA3-qPDQBrCPPLGoPLuVRF3Io9R-7IJDe-WqfcI60rdD8ntzsC-OWVKkxEhtSFF7JuIjw')" }}></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">Michael Chen</p>
                                                <p className="text-xs text-gray-500">Lead Developer</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center gap-2 text-slate-500">
                                            <span className="material-symbols-outlined text-lg">person_add</span>
                                            <span className="text-sm">Assign User</span>
                                        </div>
                                    )}
                                    <span className="material-symbols-outlined text-gray-400 text-sm">edit</span>
                                </button>
                            </div>
                            {/* Dates */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-2 block">Deadline</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-text-secondary">
                                        <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                    </span>
                                    <input
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg py-2 pl-10 pr-3 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                        type="date"
                                    />
                                </div>
                            </div>
                            {/* Time Tracking */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-2 block">Time Tracking</label>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 mb-1">Estimated</p>
                                        <div className="relative">
                                            <input
                                                name="estimate"
                                                value={formData.estimate}
                                                onChange={handleChange}
                                                className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                                type="text"
                                                placeholder="e.g. 8h"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 mb-1">Actual</p>
                                        <div className="relative">
                                            <input
                                                name="actual"
                                                value={formData.actual}
                                                onChange={handleChange}
                                                className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                                type="text"
                                                placeholder="e.g. 2h"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Simple Progress Bar for Time */}
                                {isEditing && (
                                    <div className="w-full bg-gray-200 dark:bg-surface-dark h-1.5 rounded-full mt-3 overflow-hidden">
                                        <div className="bg-green-500 h-full rounded-full" style={{ width: "30%" }}></div>
                                    </div>
                                )}
                            </div>
                            {/* Actions Dropdown */}
                            {isEditing && (
                                <div className="mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                        Delete Task
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Meta Info */}
                        {isEditing && (
                            <div className="px-2">
                                <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
                                    Created Oct 20, 2023 10:30 AM <br />
                                    Task ID: #{taskId}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

/**
 * Visible Breadcrumb Component
 * Displays navigation breadcrumb with semantic HTML
 */

import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    url?: string; // undefined means current page (no link)
}

interface VisibleBreadcrumbProps {
    items: BreadcrumbItem[];
}

export function VisibleBreadcrumb({ items }: VisibleBreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="bg-[#f6f8fb] text-[11px] py-3 px-4">
            <div className="container mx-auto">
                <ol className="flex items-center gap-1 text-gray-500 overflow-x-auto whitespace-nowrap">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-1">
                            {index > 0 && <span>&gt;</span>}
                            {item.url ? (
                                <Link
                                    to={item.url}
                                    className={index === items.length - 1 ? 'text-gray-400 truncate max-w-[200px]' : 'hover:underline'}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-gray-400 truncate max-w-[200px]" aria-current="page">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}

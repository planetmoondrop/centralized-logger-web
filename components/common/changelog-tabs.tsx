"use client";

import { useState } from "react";

export function ChangelogTabs({
    centralizedLogger,
    loggerClient,
}: {
    centralizedLogger: string;
    loggerClient: string;
}) {
    const [active, setActive] = useState<"centralized-logger" | "logger-client">("centralized-logger");

    const tabs = [
        { id: "centralized-logger", label: "@planetmoondrop/centralized-logger" },
        { id: "logger-client", label: "@planetmoondrop/logger-client" },
    ] as const;

    return (
        <div className="w-full">
            {/* Tabs — scrollable on mobile */}
            <div className="flex overflow-x-auto scrollbar-none border-b border-neutral-700 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActive(tab.id)}
                        className={`shrink-0 px-4 py-3 text-sm sm:text-base font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${active === tab.id
                            ? "border-orange-500 text-orange-500"
                            : "border-transparent text-neutral-400 hover:text-white"
                            }`}
                    >
                        <span className="hidden sm:inline">@planetmoondrop/</span>
                        {tab.id}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="changelog w-full overflow-x-auto">
                <div
                    dangerouslySetInnerHTML={{
                        __html: active === "centralized-logger" ? centralizedLogger : loggerClient,
                    }}
                />
            </div>
        </div>
    );
}
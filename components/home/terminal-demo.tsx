"use client";

import { useState, useEffect, useRef } from "react";
import { Cube, CaretRight } from "@phosphor-icons/react/dist/ssr";

const CONFIGS = [
    {
        name: "auth-service",
        host: "http://loki:3100",
        logLevel: "debug",
        enableMetrics: true,
    },
    {
        name: "user-service",
        host: "http://loki:3100",
        logLevel: "info",
        enableMetrics: true,
    },
    {
        name: "payment-service",
        host: "http://loki:3100",
        logLevel: "info",
        enableMetrics: false,
    },
    {
        name: "support-service",
        host: "http://loki:3100",
        logLevel: "info",
        enableMetrics: true,
    },
];

export function TerminalDemo() {
    const [configIndex, setConfigIndex] = useState(0);
    const [typedChars, setTypedChars] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const animationRef = useRef<NodeJS.Timeout | null>(null);
    const cycleRef = useRef<NodeJS.Timeout | null>(null);
    const [bulletsVisible, setBulletsVisible] = useState([false, false, false]);
    const bulletsSectionRef = useRef<HTMLDivElement>(null);
    const bulletsAnimatedRef = useRef(false);

    const config = CONFIGS[configIndex];

    // Build the full string we're typing
    const fullText = `${config.name}|${config.host}|${config.logLevel}|${config.enableMetrics}`;
    const totalChars = fullText.length;

    // Get displayed value for each field based on typedChars
    const getFieldValue = (fieldIndex: number): string => {
        const parts = fullText.split("|");
        let charsBefore = 0;
        for (let i = 0; i < fieldIndex; i++) {
            charsBefore += parts[i].length + 1; // +1 for delimiter
        }
        const fieldStart = charsBefore;
        const fieldEnd = charsBefore + parts[fieldIndex].length;

        if (typedChars <= fieldStart) return "";
        if (typedChars >= fieldEnd) return parts[fieldIndex];
        return parts[fieldIndex].slice(0, typedChars - fieldStart);
    };

    const getCursorField = (): number => {
        const parts = fullText.split("|");
        let charsBefore = 0;
        for (let i = 0; i < parts.length; i++) {
            const fieldEnd = charsBefore + parts[i].length;
            if (typedChars <= fieldEnd) return i;
            charsBefore = fieldEnd + 1;
        }
        return -1;
    };

    // Single typing effect
    useEffect(() => {
        if (isComplete) return;

        if (typedChars < totalChars) {
            animationRef.current = setTimeout(
                () => {
                    setTypedChars((prev) => prev + 1);
                },
                100 + Math.random() * 50
            ); // 100-150ms per char
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsComplete(true);
        }

        return () => {
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, [typedChars, totalChars, isComplete]);

    // Cycle to next config after completion
    useEffect(() => {
        if (!isComplete) return;

        cycleRef.current = setTimeout(() => {
            setConfigIndex((prev) => (prev + 1) % CONFIGS.length);
            setTypedChars(0);
            setIsComplete(false);
        }, 3000); // Wait 3 seconds before cycling

        return () => {
            if (cycleRef.current) clearTimeout(cycleRef.current);
        };
    }, [isComplete]);

    useEffect(() => {
        if (!bulletsSectionRef.current || bulletsAnimatedRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !bulletsAnimatedRef.current) {
                        bulletsAnimatedRef.current = true;
                        // Stagger the bullet animations
                        setTimeout(() => setBulletsVisible((prev) => [true, prev[1], prev[2]]), 0);
                        setTimeout(
                            () => setBulletsVisible((prev) => [prev[0], true, prev[2]]),
                            200
                        );
                        setTimeout(
                            () => setBulletsVisible((prev) => [prev[0], prev[1], true]),
                            400
                        );
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(bulletsSectionRef.current);
        return () => observer.disconnect();
    }, []);

    const cursorField = getCursorField();
    const showCursor = !isComplete;

    const renderValue = (fieldIndex: number, isString = true) => {
        const value = getFieldValue(fieldIndex);
        const hasCursor = showCursor && cursorField === fieldIndex;
        const colorClass = isString ? "text-green-400" : "text-purple-400";

        return (
            <span className={colorClass}>
                {isString ? `"${value}"` : value}
                {hasCursor && (
                    <span className="ml-px inline-block h-[1em] w-[2px] animate-pulse bg-white" />
                )}
            </span>
        );
    };

    return (
        <section className="py-12 md:py-16 lg:py-24">
            <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="flex flex-col gap-8 md:gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
                    {/* Code block - left */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="overflow-hidden rounded-none border">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs tracking-widest uppercase">
                                        <Cube weight="bold" className="mr-2 inline-block h-3 w-3" />
                                        src/app.module.ts
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {CONFIGS.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                if (animationRef.current) clearTimeout(animationRef.current);
                                                if (cycleRef.current) clearTimeout(cycleRef.current);
                                                setConfigIndex(i);
                                                setTypedChars(0);
                                                setIsComplete(false);
                                            }}
                                            className={`h-1.5 rounded-none transition-all duration-300 ${i === configIndex ? "w-4" : "w-1.5"
                                                }`}
                                            aria-label={`View config ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="overflow-x-auto p-4 sm:p-5 font-mono text-xs sm:text-sm">
                                <pre>
                                    <code className="whitespace-pre-wrap wrap-break-words sm:whitespace-pre">
                                        <span className="block text-xs sm:text-sm">
                                            import {"{"} <span className="text-[#faa56c]/90 break-keep">
                                                Module{" "}
                                            </span>
                                            {"}"} from{" "}
                                            <span className="text-green-400 break-keep">
                                                &quot;@nestjs/common&quot;
                                            </span>
                                        </span>
                                        <span className="block text-xs sm:text-sm">
                                            import {"{"} <span className="text-[#faa56c]/90 break-keep">
                                                LokiLoggerModule{" "}
                                            </span>
                                            {"}"} from{" "}
                                            <span className="text-green-400 break-keep">
                                                &quot;@planetmoondrop/centralized-logger&quot;
                                            </span>
                                        </span>
                                        {"\n"}
                                        <span className="text-xs sm:text-sm">@Module</span>
                                        <span className="text-xs sm:text-sm">({"{"})</span>
                                        {"\n"}
                                        {"  "}
                                        <span className="text-xs sm:text-sm">imports</span>: [{"\n"}
                                        {"    "}
                                        <span className="text-xs sm:text-sm"><span className="text-[#faa56c]/90 break-keep">
                                            LokiLoggerModule
                                        </span>
                                            .
                                            <span className="text-purple-400 break-keep">
                                                register
                                            </span>
                                        </span>
                                        <span className="text-xs sm:text-sm">({"{"})</span>
                                        {"\n"}
                                        {"      "}
                                        <span className="text-xs sm:text-sm">serviceName</span>: {renderValue(0)},{"\n"}
                                        {"      "}
                                        <span className="text-xs sm:text-sm">lokiHost</span>: {renderValue(1)},{"\n"}
                                        {"      "}
                                        <span className="text-xs sm:text-sm">logLevel</span>: {renderValue(2)},{"\n"}
                                        {"      "}
                                        <span className="text-xs sm:text-sm">enableMetrics</span>: {renderValue(3, false)},{"\n"}
                                        {"    "}
                                        <span className="text-xs sm:text-sm">{"})"}</span>,{"\n"}
                                        {"  "}
                                        <span className="text-xs sm:text-sm">]</span>,{"\n"}
                                        <span className="text-xs sm:text-sm">{"})"}</span>
                                        {"\n"}
                                        {"\n"}
                                        <span className="text-xs sm:text-sm">export class</span> <span className="text-[#faa56c]/90 text-xs sm:text-sm break-keep">AppModule</span> <span className="text-xs sm:text-sm">{"{}"}</span>
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* CTA content - right */}
                    <div className="flex-1 lg:max-w-md w-full">
                        <span className="text-xs sm:text-sm font-medium tracking-wider uppercase">
                            Get started
                        </span>
                        <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-[#faa56c]/90">
                            Setup in under 60 seconds
                        </h2>
                        <p className="mt-4 text-base sm:text-lg">
                            Add the SDK to your microservices, and watch traces flow live. No complex
                            config, no blind spots.
                        </p>

                        <div ref={bulletsSectionRef} className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                            {[
                                "100% Free & Open Source",
                                "No limits on traces captured",
                                "Self-host the entire platform",
                            ].map((text, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 transition-all duration-500 ease-out text-sm sm:text-base"
                                    style={{
                                        opacity: bulletsVisible[index] ? 1 : 0,
                                        transform: bulletsVisible[index]
                                            ? "translateX(0)"
                                            : "translateX(40px)",
                                    }}
                                >
                                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-none">
                                        <CaretRight weight="bold" className="h-3 w-3 sm:h-4 sm:w-4 text-[#faa56c]/90" />
                                    </div>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                        {/*
                        <div className="mt-8 sm:mt-10">
                            <Link
                                href="/docs/overview/quickstart"
                                className="home-hero-cta group focus-visible:ring-offset-background inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#faa56c] bg-transparent px-6 py-2.5 text-[0.9375rem] font-semibold text-[#faa56c] transition-[background-color,color,box-shadow,transform] duration-200 hover:bg-[#faa56c] hover:text-[#1b1b1b] hover:shadow-[0_8px_24px_-8px_rgba(250,165,108,0.55)] focus-visible:ring-2 focus-visible:ring-[#faa56c] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:mt-10 sm:px-7 sm:py-3 sm:text-base"
                            >
                                Start Tracing
                                <ArrowRight
                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:h-5 sm:w-5"
                                    weight="bold"
                                    aria-hidden
                                />
                            </Link>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
}
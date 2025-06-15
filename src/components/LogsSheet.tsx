import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import type { TransportEvent } from "@openai/agents/realtime";

export type LogsSheetProps = {
    events: TransportEvent[];
};

export function LogsSheet({ events }: LogsSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">See logs</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96 max-w-full p-8">
                <SheetHeader>
                    <SheetTitle>Event Logs</SheetTitle>
                    <SheetDescription>
                        All transport and system events for this session.
                    </SheetDescription>
                </SheetHeader>
                <div className="overflow-scroll max-h-[80vh] flex-1 text-xs mt-4" id="eventLog">
                    {events.map((event, index) => (
                        <details key={index} className="mb-2 border-b border-gray-200 py-2">
                            <summary>{event.type}</summary>
                            <pre>{JSON.stringify(event, null, 2)}</pre>
                        </details>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
} 
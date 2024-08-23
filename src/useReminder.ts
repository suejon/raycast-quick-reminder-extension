import { showToast, Toast } from "@raycast/api";
import { nanoid } from "nanoid";
import { useState } from "react";
import Sherlock from 'sherlockjs';

export interface ReminderEvent {
    id: string;
    eventTitle: string;
    startDate: Date;
    endDate: Date;
    isAllDay: boolean;
    validated: boolean;
}


export function useReminder() {
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<ReminderEvent[]>([]);
    const [reminderText, setReminderText] = useState('');

    async function parse(query: string) {
        try {
            setIsLoading(true);
            setReminderText(query);

            if (query.length === 0) {
                setResults([]);
            } else {
                const parsedEvent = Sherlock.parse(query);

                const event: ReminderEvent = {
                    ...parsedEvent,
                    id: nanoid(),
                };

                if (!event.startDate) {
                    event.startDate = new Date();
                }
                setResults([event]);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('error', error);
            showToast(Toast.Style.Failure, 'Could not parse event', String(error));
        }
    }

    return {
        isLoading,
        results,
        reminderText,
        parse
    }

}

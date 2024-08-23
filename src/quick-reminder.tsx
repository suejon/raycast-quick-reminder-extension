import { ActionPanel, Action, Icon, List, closeMainWindow, showHUD, showToast, Toast } from "@raycast/api";
import { ReminderEvent, useReminder } from "./useReminder";
import { runAppleScript } from "@raycast/utils";

async function createReminder(event: ReminderEvent) {
    let dueDate = event.startDate.toString();

    const result = runAppleScript(`
    on run argv
        tell application "Reminders"
            make new reminder with properties {name:(item 1 of argv), due date:date (item 2 of argv)}
        end tell
    end run
    `, [event.eventTitle, dueDate]);
    result.then(res => {
        showToast(Toast.Style.Success, 'Created Reminder');
        showHUD(res);
    });
}

const dayofweek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function getDayOfWeekHumanFriendly(date: Date) {
    const today = dayofweek[new Date().getDay()]
    const targetDay = dayofweek[date.getDay()]
    return targetDay === today ? "Today" : targetDay
}


export default function Command() {
    const { parse, results } = useReminder();
    return (
        <List onSearchTextChange={parse} searchBarPlaceholder="Walk the dog tomorrow at 3pm">
            <List.Section>
                {results.map((item) => (
                    <List.Item
                        key={item.id}
                        icon={Icon.List}
                        title={item.eventTitle}
                        subtitle={item.startDate.toLocaleString() + " " + getDayOfWeekHumanFriendly(item.startDate)}
                        actions={
                            <ActionPanel>
                                <Action
                                    key={item.id}
                                    title="Add to reminders"
                                    onAction={async () => {
                                        await createReminder(item);
                                        await closeMainWindow({ clearRootSearch: true });
                                    }} />
                            </ActionPanel>
                        }
                    />
                ))}
            </List.Section>
        </List>
    );
}

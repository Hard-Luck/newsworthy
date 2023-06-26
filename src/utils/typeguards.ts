import { Topic } from "../types/api";

export function isTopic(value: unknown): value is Topic {
    return (
        typeof value === "object" &&
        value !== null &&
        "slug" in value &&
        "description" in value
    );
}
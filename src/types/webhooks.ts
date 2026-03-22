import { Subscriber, SubscriberResponseDTO, toSubscriberResponseDTO } from "./subscribers.js";
import { toUserResponseDTO, User, UserResponseDTO } from "./users.js";

export type Action = "SUMMARIZATION" | "TRANSLATION" | "WEATHER-QUERY" | "TODAY-MATCHES";

export type Webhook = {
    id: string;
    source: string;
    action: Action;
    subscribers: Subscriber[];
    userId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
};
export type WebhookRequestDTO = {
    source: string;
    action: Action;
    subscribers: string[];
};
export type WebhookResponseDTO = {
    id: string;
    source: string;
    action: Action;
    subscribers: SubscriberResponseDTO[];
    user: UserResponseDTO;
};

export function toWebhookResponseDTO(webhook: Webhook): WebhookResponseDTO {
    return {
        id: webhook.id,
        source: webhook.source,
        action: webhook.action,
        subscribers: webhook.subscribers.map((subscriber) => toSubscriberResponseDTO(subscriber)),
        user: toUserResponseDTO(webhook.user)
    }
}
import { toUserResponseDTO, User, UserResponseDTO } from "./users.js";

export type Webhook = {
    id: string;
    source: string;
    action: string;
    subscribers: {
        id: string;
        url: string;
        webhookId: string;
    }[];
    userId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
};
export type WebhookRequestDTO = {
    source: string;
    action: string;
    subscribers: string[];
};
export type WebhookResponseDTO = {
    id: string;
    source: string;
    action: string;
    subscribers: string[];
    user: UserResponseDTO;
};

export function toWebhookResponseDTO(webhook: Webhook): WebhookResponseDTO {
    return {
        id: webhook.id,
        source: webhook.source,
        action: webhook.action,
        subscribers: webhook.subscribers.map((subscriber) => subscriber.url),
        user: toUserResponseDTO(webhook.user)
    }
}
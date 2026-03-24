import {
  createWebhookDB,
  deleteWebhookByIdDB,
  getAllWebhooksByUserIdDB,
  getAllWebhooksDB,
  getWebhookByIdDB,
  getWebhookBySourceDB,
  updateWebhookDB,
} from "../db/queries/webhooks.js";
import {
  Action,
  WebhookRequestDTO,
  toWebhookResponseDTO,
  WebhookResponseDTO,
} from "../types/webhooks.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../errors/http-errors.js";

async function ensureWebhookSourceUniqueness(
  source?: string,
  webhookId?: string,
): Promise<void> {
  if (source) {
    const existedWebhookBySource = await getWebhookBySourceDB(source);
    if (existedWebhookBySource && existedWebhookBySource.id !== webhookId) {
      throw new BadRequestError(
        "Webhook with the same source is already existed!",
      );
    }
  }
}

function validateWebhookAction(action?: string): Action | undefined {
  if (action) {
    const upperCasedAction = action.toUpperCase();
    if (
      upperCasedAction !== "SUMMARIZATION" &&
      upperCasedAction !== "TRANSLATION" &&
      upperCasedAction !== "WEATHER-QUERY" &&
      upperCasedAction !== "TODAY-MATCHES"
    )
      throw new BadRequestError(
        "Allowed actions are: SUMMARIZATION, TRANSLATION, WEATHER-QUERY and TODAY-MATCHES!",
      );
    return upperCasedAction;
  }
}

export async function createWebhook(
  userId: string,
  webhook: WebhookRequestDTO,
): Promise<WebhookResponseDTO> {
  await ensureWebhookSourceUniqueness(webhook.source);
  webhook.action = validateWebhookAction(webhook.action) as Action;
  const createdWebhook = await createWebhookDB(userId, webhook);
  return toWebhookResponseDTO(createdWebhook);
}

export async function getWebhookById(
  webhookId: string,
): Promise<WebhookResponseDTO> {
  const webhook = await getWebhookByIdDB(webhookId);
  if (!webhook) {
    throw new NotFoundError("Webhook not found!");
  }
  return toWebhookResponseDTO(webhook);
}

export async function getAllWebhooks(): Promise<WebhookResponseDTO[]> {
  const webhooks = await getAllWebhooksDB();
  if (webhooks.length === 0) {
    throw new NotFoundError("No webhooks found!");
  }
  return webhooks.map((webhook) => toWebhookResponseDTO(webhook));
}

export async function getAllWebhooksByUserId(
  userId: string,
): Promise<WebhookResponseDTO[]> {
  const webhooks = await getAllWebhooksByUserIdDB(userId);
  if (webhooks.length === 0) {
    throw new NotFoundError("No webhooks found for this user!");
  }
  return webhooks.map((webhook) => toWebhookResponseDTO(webhook));
}

export async function deleteWebhookById(
  webhookId: string,
  userId: string,
): Promise<void> {
  const existedWebhookById = await getWebhookByIdDB(webhookId);
  if (!existedWebhookById) {
    throw new BadRequestError("Webhook not found!");
  }
  if (existedWebhookById.userId !== userId) {
    throw new ForbiddenError("You are not authorized to delete this webhook!");
  }
  await deleteWebhookByIdDB(webhookId);
}

export async function updateWebhook(
  webhookId: string,
  webhook: Partial<WebhookRequestDTO>,
  userId: string,
): Promise<WebhookResponseDTO> {
  const existedWebhookById = await getWebhookByIdDB(webhookId);
  if (!existedWebhookById) {
    throw new BadRequestError("Webhook not found!");
  }
  if (existedWebhookById.userId !== userId) {
    throw new ForbiddenError("You are not authorized to update this webhook!");
  }
  await ensureWebhookSourceUniqueness(webhook.source, webhookId);
  webhook.action = validateWebhookAction(webhook.action);
  const updatedWebhook = await updateWebhookDB(webhookId, webhook);
  return toWebhookResponseDTO(updatedWebhook);
}

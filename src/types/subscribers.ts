export type Subscriber = {
  id: string;
  url: string;
  webhookId: string;
};
export type SubscriberResponseDTO = Pick<Subscriber, "id" | "url">;

export function toSubscriberResponseDTO(
  subscriber: Subscriber,
): SubscriberResponseDTO {
  return {
    id: subscriber.id,
    url: subscriber.url,
  };
}

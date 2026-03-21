export type DeliveryStatus = "NOT_DELIVERED" | "FAILED" | "SUCCESS";

export type Delivery = {
    id: string;
    taskId: string;
    subscriberId: string;
    status: DeliveryStatus;
    attemptsNumber: number;
    deliveredAt: Date | null;
};
export type DeliveryResponseDTO = Omit<Delivery, "taskId">;

export function toDeliveryResponseDTO(delivery: Delivery): DeliveryResponseDTO {
    return {
        id: delivery.id,
        subscriberId: delivery.subscriberId,
        status: delivery.status,
        attemptsNumber: delivery.attemptsNumber,
        deliveredAt: delivery.deliveredAt
    }
}
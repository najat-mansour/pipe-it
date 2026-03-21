export type DeliveryStatus = "WAITING" | "TRYING" | "DELIVERED";

export type Delivery = {
    id: string;
    taskId: string;
    subscriberId: string;
    status: DeliveryStatus;
    attemptsNumber: number;
    deliveredAt: Date | null;
};
export type DeliveryResponseDTO = Pick<Delivery, "subscriberId" | "status" | "attemptsNumber" | "deliveredAt">;

export function toDeliveryResponseDTO(delivery: Delivery): DeliveryResponseDTO {
    return {
        subscriberId: delivery.subscriberId,
        status: delivery.status,
        attemptsNumber: delivery.attemptsNumber,
        deliveredAt: delivery.deliveredAt
    }
}
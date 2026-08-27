package org.example.project.order.domain.usecase

import org.example.project.order.domain.model.Order
import org.example.project.order.domain.repository.OrderRepository

class GetOrdersUseCase(private val repository: OrderRepository) {
    suspend operator fun invoke(): Result<List<Order>> = repository.getOrders()
}

class RateOrderUseCase(private val repository: OrderRepository) {
    suspend operator fun invoke(orderId: Long, rating: Int): Result<Unit> {
        if (rating !in 1..5) {
            return Result.failure(IllegalArgumentException("Rating harus antara 1 sampai 5"))
        }
        return repository.rateOrder(orderId, rating)
    }
}
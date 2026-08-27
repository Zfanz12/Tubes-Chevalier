package org.example.project.order.domain.repository

import org.example.project.order.domain.model.Order

interface OrderRepository {
    suspend fun getOrders(): Result<List<Order>>
    suspend fun rateOrder(orderId: Long, rating: Int): Result<Unit>
}
'use strict';

const orderService = require('../services/order.service');
const { sendSuccess } = require('../utils/apiResponse');

async function getBuyerOrders(req, res) {
  const { status, page, limit } = req.query;
  const result = await orderService.getBuyerOrders(req.user.id, { status, page, limit });
  return sendSuccess(res, result);
}

async function getSellerOrders(req, res) {
  const { status, page, limit } = req.query;
  const result = await orderService.getSellerOrders(req.user.id, { status, page, limit });
  return sendSuccess(res, result);
}

async function getOrder(req, res) {
  const order = await orderService.getOrder(req.params.id, req.user.id, req.user.role);
  return sendSuccess(res, { order });
}

async function submitPayment(req, res) {
  const { paymentMethod, paymentProof } = req.body;
  const order = await orderService.submitPayment(req.params.id, req.user.id, { paymentMethod, paymentProof });
  return sendSuccess(res, { order });
}

async function confirmPayment(req, res) {
  const order = await orderService.confirmPayment(req.params.id, req.user.id);
  return sendSuccess(res, { order });
}

async function addTracking(req, res) {
  const { trackingNumber, courier } = req.body;
  const order = await orderService.addTracking(req.params.id, req.user.id, { trackingNumber, courier });
  return sendSuccess(res, { order });
}

async function submitShippingAddress(req, res) {
  const order = await orderService.submitShippingAddress(req.params.id, req.user.id, req.body);
  return sendSuccess(res, { order });
}

async function confirmDelivery(req, res) {
  const order = await orderService.confirmDelivery(req.params.id, req.user.id);
  return sendSuccess(res, { order });
}

module.exports = {
  getBuyerOrders,
  getSellerOrders,
  getOrder,
  submitPayment,
  confirmPayment,
  addTracking,
  submitShippingAddress,
  confirmDelivery,
};

'use strict';

const User = require('../models/User');
const Auction = require('../models/Auction');

function notFound(message = 'Auction not found') {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

async function getWatchlist(userId) {
  const user = await User.findById(userId).populate({
    path: 'watchlist',
    populate: [
      { path: 'seller', select: 'name username avatar' },
      { path: 'category', select: 'name slug icon gradient' },
    ],
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    items: user.watchlist || [],
  };
}

async function addToWatchlist(userId, auctionId) {
  const auction = await Auction.findById(auctionId)
    .populate('seller', 'name username avatar')
    .populate('category', 'name slug icon gradient');

  if (!auction) throw notFound();

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const alreadySaved = user.watchlist.some((savedId) => savedId.toString() === auctionId);
  if (!alreadySaved) {
    user.watchlist.push(auctionId);
    await user.save();
  }

  return { auction };
}

async function removeFromWatchlist(userId, auctionId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.watchlist = user.watchlist.filter((savedId) => savedId.toString() !== auctionId);
  await user.save();

  return { message: 'Removed from watchlist' };
}

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};

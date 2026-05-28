import React from 'react'

const WatchlistPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Your watchlist is empty</p>
      </div>
    </div>
  )
}

export default WatchlistPage
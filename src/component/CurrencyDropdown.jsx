import React from "react";
import { HiOutlineStar, HiStar } from "react-icons/hi2";

const CurrencyDropdown = ({
  currencies,
  currency,
  setCurrency,
  favorites,
  handleFavorite,
  title = "Currency",
}) => {
  const isFavorite = (curr) => favorites.includes(curr);

  return (
    <div>
      <label
        htmlFor={title}
        className="block text-sm font-medium text-gray-700"
      >
        {title}
      </label>
      <div className="mt-1 relative">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {/* Render favorites */}
          {favorites.length > 0 && (
            <optgroup label="★ Favorites">
              {favorites.map((favCurrency) => (
                <option
                  className="bg-gray-200"
                  value={favCurrency}
                  key={favCurrency}
                >
                  {favCurrency}
                </option>
              ))}
            </optgroup>
          )}
          <optgroup label="All Currencies">
            {currencies
              .filter((c) => !favorites.includes(c))
              .map((curr) => (
                <option value={curr} key={curr}>
                  {curr}
                </option>
              ))}
          </optgroup>
        </select>

        {/* Favorite Button */}
        <button
          onClick={() => handleFavorite(currency)}
          className="absolute inset-y-0 right-5 flex items-center text-lg text-yellow-500"
          aria-label="Toggle Favorite"
        >
          {isFavorite(currency) ? <HiStar /> : <HiOutlineStar />}
        </button>
      </div>
    </div>
  );
};

export default CurrencyDropdown;

import React, { useEffect, useState } from "react";
import CurrencyDropdown from "./CurrencyDropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["USD", "EUR"]
  );
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);

  const urlCurrencies = "https://api.frankfurter.app/currencies";

  // Fetch available currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(urlCurrencies);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCurrencies(Object.keys(data));
      } catch (error) {
        console.error("Error fetching currencies:", error.message);
      }
    };

    fetchCurrencies();
  }, []);

  // Convert currency
 const convertCurrency = async () => {
  if (!amount || fromCurrency === toCurrency) {
    setConvertedAmount(`${amount} ${toCurrency}`);
    return;
  }

  setConverting(true); // Start loading animation

  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    setTimeout(() => {
      setConvertedAmount(`${data.rates[toCurrency]} ${toCurrency}`);
      setConverting(false); // End loading animation after 500ms delay
    }, 500);
  } catch (error) {
    console.error("Error converting currency:", error.message);
    setConverting(false);
  }
};


  // Handle favorite currency selection
  const handleFavorite = (currency) => {
    const updatedFavorites = favorites.includes(currency)
      ? favorites.filter((fav) => fav !== currency)
      : [...favorites, currency];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Swap selected currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
      <h2 className="mb-5 text-2xl font-semibold text-gray-700 text-center">
        Currency Converter
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          title="From:"
          handleFavorite={handleFavorite}
          currency={fromCurrency}
          setCurrency={setFromCurrency}
        />

        {/* Swap currency button */}
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
          >
            <HiArrowsRightLeft className="text-xl text-gray-700" />
          </button>
        </div>

        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          title="To:"
          handleFavorite={handleFavorite}
          currency={toCurrency}
          setCurrency={setToCurrency}
        />
      </div>

      {/* Amount Input */}
      <div className="mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount:
        </label>
        <input
          type="number"
          value={amount}
          min="1"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
        />
      </div>

      {/* Convert Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={convertCurrency}
          className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${converting ? "animate-pulse" : ""}
            `}
          disabled={converting}
        >
          {converting ? "Converting..." : "Convert"}
        </button>
      </div>

      {/* Converted Amount */}
      {convertedAmount && (
        <div className="mt-4 text-lg font-medium text-right text-green-600">
          Converted Amount: {convertedAmount}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;

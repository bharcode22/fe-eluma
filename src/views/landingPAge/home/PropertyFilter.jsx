import React, { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';

function PropertyFilter({ properties, onFilter }) {
  const locations = [
    ...new Set(
      properties.flatMap((p) =>
        (p.location && p.location.length > 0) ? p.location.map((l) => l.general_area) : []
      )
    ),
  ];

  const bedrooms = [...new Set(properties.map((p) => p.number_of_bedrooms))];

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [monthlyPriceRange, setMonthlyPriceRange] = useState([1000000, 10000000]);
  const [yearlyPriceRange, setYearlyPriceRange] = useState([10000000, 150000000]);

  useEffect(() => {
    if (properties.length > 0) {
      const monthly = properties.map((p) => p.monthly_price || 0);
      const yearly = properties.map((p) => p.yearly_price || 0);
      setMonthlyPriceRange([Math.min(...monthly), Math.max(...monthly)]);
      setYearlyPriceRange([Math.min(...yearly), Math.max(...yearly)]);
    }
  }, [properties]);

  const handleFilter = () => {
    let filtered = properties;

    if (selectedLocation) {
      filtered = filtered.filter((p) =>
        p.location && p.location.some((l) => l.general_area === selectedLocation)
      );
    }
    if (selectedBedrooms) {
      filtered = filtered.filter((p) => p.number_of_bedrooms === Number(selectedBedrooms));
    }

    filtered = filtered.filter(
      (p) =>
        (!p.monthly_price || (p.monthly_price >= monthlyPriceRange[0] && p.monthly_price <= monthlyPriceRange[1])) &&
        (!p.yearly_price || (p.yearly_price >= yearlyPriceRange[0] && p.yearly_price <= yearlyPriceRange[1]))
    );

    onFilter(filtered);
  };

  

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 sm:pt-4 pb-4 mb-8 border border-gray-200">
      <form onSubmit={(e) => { e.preventDefault(); handleFilter(); }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Lokasi Select */}
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <select
              className="select select-primary w-full bg-primary"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Semua Lokasi</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms Select */}
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kamar Tidur</label>
            <select
              className="select select-primary w-full bg-primary"
              value={selectedBedrooms}
              onChange={(e) => setSelectedBedrooms(e.target.value)}
            >
              <option value="">Semua Kamar</option>
              {bedrooms.map((bed) => (
                <option key={bed} value={bed}>{bed}</option>
              ))}
            </select>
          </div>

          {/* Monthly Price */}
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Bulanan</label>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-3 mt-2"
              min={0}
              max={15000000}
              step={100000}
              value={monthlyPriceRange}
              onValueChange={(val) => setMonthlyPriceRange(val)}
              minStepsBetweenThumbs={1}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-1.5">
                <Slider.Range className="absolute bg-amber-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-amber-500 rounded-full"
                aria-label="Minimum Bulanan"
              />
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-amber-500 rounded-full"
                aria-label="Maximum Bulanan"
              />
            </Slider.Root>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Rp {(monthlyPriceRange[0] / 1_000_000).toFixed(1)}m</span>
              <span>Rp {(monthlyPriceRange[1] / 1_000_000).toFixed(1)}m</span>
            </div>
          </div>

          {/* Yearly Price */}
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Tahunan</label>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-3 mt-2"
              min={0}
              max={200000000}
              step={1000000}
              value={yearlyPriceRange}
              onValueChange={(val) => setYearlyPriceRange(val)}
              minStepsBetweenThumbs={1}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-1.5">
                <Slider.Range className="absolute bg-amber-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-amber-500 rounded-full"
                aria-label="Minimum Tahunan"
              />
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-amber-500 rounded-full"
                aria-label="Maximum Tahunan"
              />
            </Slider.Root>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Rp {(yearlyPriceRange[0] / 1_000_000).toFixed(1)}m</span>
              <span>Rp {(yearlyPriceRange[1] / 1_000_000).toFixed(0)}m</span>
            </div>
          </div>

          {/* Filter Button */}
          <div className="w-full sm:w-auto">
            <button
              type="submit"
              className="btn bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Cari
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PropertyFilter;
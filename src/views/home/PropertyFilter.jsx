import React, { useState } from 'react';

function PropertyFilter({ properties, onFilter }) {
  // Ambil semua lokasi unik
  const locations = [
    ...new Set(
      properties.flatMap((p) =>
        (p.location && p.location.length > 0) ? p.location.map((l) => l.general_area) : []
      )
    ),
  ];

  // Ambil semua jumlah kamar unik
  const bedrooms = [...new Set(properties.map((p) => p.number_of_bedrooms))];

  // State filter
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [monthlyPriceRange, setMonthlyPriceRange] = useState([0, 0]);
  const [yearlyPriceRange, setYearlyPriceRange] = useState([0, 0]);

  // Inisialisasi rentang harga dari data
  React.useEffect(() => {
    if (properties.length > 0) {
      const monthly = properties.map((p) => p.monthly_price || 0);
      const yearly = properties.map((p) => p.yearly_price || 0);
      setMonthlyPriceRange([Math.min(...monthly), Math.max(...monthly)]);
      setYearlyPriceRange([Math.min(...yearly), Math.max(...yearly)]);
    }
  }, [properties]);

  // Handler filter
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
    <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8, marginBottom: 16 }}>
      <h4>Filter Properti</h4>
      <div>
        <label>Lokasi: </label>
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="">Semua</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Kamar Tidur: </label>
        <select value={selectedBedrooms} onChange={(e) => setSelectedBedrooms(e.target.value)}>
          <option value="">Semua</option>
          {bedrooms.map((bed) => (
            <option key={bed} value={bed}>{bed}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Harga Bulanan: </label>
        <input
          type="number"
          value={monthlyPriceRange[0]}
          onChange={(e) =>
            setMonthlyPriceRange([Number(e.target.value), monthlyPriceRange[1]])
          }
        />
        {' - '}
        <input
          type="number"
          value={monthlyPriceRange[1]}
          onChange={(e) =>
            setMonthlyPriceRange([monthlyPriceRange[0], Number(e.target.value)])
          }
        />
      </div>
      <div>
        <label>Harga Tahunan: </label>
        <input
          type="number"
          value={yearlyPriceRange[0]}
          onChange={(e) =>
            setYearlyPriceRange([Number(e.target.value), yearlyPriceRange[1]])
          }
        />
        {' - '}
        <input
          type="number"
          value={yearlyPriceRange[1]}
          onChange={(e) =>
            setYearlyPriceRange([yearlyPriceRange[0], Number(e.target.value)])
          }
        />
      </div>
      <button onClick={handleFilter} style={{ marginTop: 8 }}>Terapkan Filter</button>
    </div>
  );
}

export default PropertyFilter;
import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCarousel from './PropertyCarousel.jsx';
import PropertyInfo from './PropertyInfo.jsx';

export const PropertyCard = memo(({
  property,
  currentIndex,
  isFavorite,
  onPrev,
  onNext,
  onFavorite,
  onToggleFavorite,
  onPrevImage,
  onNextImage,
  onRequireAuth,
  priceView: propPriceView,
  setPriceView: propSetPriceView,
  getCurrencySymbol,
  convertPrice,
  currency,
  exchangeRates
}) => {
  const [internalPriceView, setInternalPriceView] = useState('monthly');
  const priceView = propPriceView || internalPriceView;
  const setPriceView = propSetPriceView || setInternalPriceView;

  const handlePrev = (e) => {
    if (onPrev) onPrev(e);
    else if (onPrevImage) onPrevImage(property.id, property.images?.length || 0, e);
  };

  const handleNext = (e) => {
    if (onNext) onNext(e);
    else if (onNextImage) onNextImage(property.id, property.images?.length || 0, e);
  };

  const handleFav = (e) => {
    if (onFavorite) onFavorite(e);
    else if (onToggleFavorite) onToggleFavorite(property.id, e);
  };

  return (
    <div className="group bg-gradient-to-b from-base-100 to-base-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-base-300 hover:border-primary/30 hover:-translate-y-1">
      <PropertyCarousel
        images={property.images}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        isFavorite={isFavorite}
        onFavorite={handleFav}
        propertyType={property.property_type}
      />
      <Link
        to={`/detail/${property.id}`}
        className="block p-6 space-y-4 focus:outline-none"
        tabIndex={0}
      >
        <PropertyInfo
          property={property}
          priceView={priceView}
          setPriceView={setPriceView}
          getCurrencySymbol={getCurrencySymbol}
          convertPrice={convertPrice}
          currency={currency}
          exchangeRates={exchangeRates}
        />
      </Link>
    </div>
  );
});

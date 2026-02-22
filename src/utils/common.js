
const calculateTotalPrice = (points, allOffers) => points.reduce((total, point) => {
  const pointSum = point.basePrice;

  const offersByType = allOffers.find((offer) => offer.type === point.type)?.offers || [];

  const selectedOffersSum = offersByType
    .filter((offer) => point.offers.includes(offer.id))
    .reduce((sum, offer) => sum + offer.price, 0);

  return total + pointSum + selectedOffersSum;
}, 0);


export {calculateTotalPrice};

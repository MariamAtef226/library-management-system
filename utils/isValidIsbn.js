function isValidISBN10(isbn) {
  // Remove any hyphens or spaces from the ISBN
  isbn = isbn.replace(/[-\s]/g, '');

  // Check if the ISBN is a 10-digit string
  if (isbn.length !== 10 || isNaN(parseInt(isbn))) {
    return false;
  }

  // Calculate the check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn[i]) * (10 - i);
  }
  let checkDigit = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);

  // Validate the check digit
  return (sum + checkDigit) % 11 === 0;
}

module.exports = isValidISBN10;

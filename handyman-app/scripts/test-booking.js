const fetch = require('node-fetch');

(async () => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcklkIjoiY21uNml6NHN3MDAwMHRiNjRjeDk2b2VvYyIsImlhdCI6MTc3NDQ3MjI4NSwiZXhwIjoxNzc0NDc1ODg1fQ.nVTiV9jIAVjNo7AemkyYoO9CLAWnsf8gWhxQVT2VvvU';
    const response = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        addressId: 'cmn6j44h70002tb64rooyxaw6',
        serviceTypeId: 'plumbing',
        description: 'Fix sink',
        preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    console.log('status', response.status);
    console.log('body', await response.text());
  } catch (e) {
    console.error('error', e);
  }
})();
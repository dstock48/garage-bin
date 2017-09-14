const inputForm = document.querySelector('#new-item-inputs');

getGarageItems();

inputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#item-name-input');
  const reason = $('#item-reason-input');
  const cleanliness = $('#item-cleanliness-input');

  fetch('/api/v1/item', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item_name: name.val(),
      reason: reason.val(),
      cleanliness: cleanliness.val()
    })
  })
    .then(data => data.json())
    .then((item) => {
      appendItem(item);

      name.val('');
      reason.val('');
      cleanliness.val('select');
    });
});


// FUNCTIONS //////////////////////////////////
///////////////////////////////////////////////

function appendItem(item) {
  $('#garage-items').append(`
    <div class="item-card">
      <h2 class="item-name">${item.item_name}</h2>
      <p class="item-reason"><span class="label">Linger Reason:</span> ${item.reason}</p>
      <p class="item-cleanliness"><span class="label">Cleanliness:</span> ${item.cleanliness}</p>
    </div>
  `);
}

function getGarageItems() {
  fetch('/api/v1/item')
    .then(data => data.json())
    .then(items => {
      items.forEach(item => {
        appendItem(item);
      });
    });
}

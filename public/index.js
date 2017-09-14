getGarageItems();

function getGarageItems() {
  fetch('/api/v1/item')
    .then(data => data.json())
    .then(items => {
      items.forEach(item => {
        $('#garage-items').append(`
          <div class="item-card">
            <h2 class="item-name">${item.item_name}</h2>
            <p class="item-reason"><span class="label">Linger Reason:</span> ${item.reason}</p>

            <p class="item-cleanliness"><span class="label">Cleanliness:</span> ${item.cleanliness}</p>
          </div>
        `);
      });
    });
}

const garageItems = [];
getGarageItems();

// EVENT LISTENERS ////////////////////////////
///////////////////////////////////////////////

$('.show-btn').on('click', () => {
  if (!$('#door').hasClass('up')) {
    $('#door').addClass('up');
    $('main').removeClass('hidden');
    $('.show-btn').text('Close Garage Door');
  } else {
    $('#door').removeClass('up');
    $('main').addClass('hidden');
    $('.show-btn').text('Open Garage Door');
  }
});

$('#select-sort').on('change', function(e) {
  $('#garage-items').empty();

  $('#sparkling-count').text('0');
  $('#dusty-count').text('0');
  $('#rancid-count').text('0');
  $('#total-count').text('0');

  switch (e.target.value) {
  case 'alph':
    garageItems
      .sort((a, b) => a.item_name < b.item_name)
      .forEach(item => appendItem(item));
    break;
  case 'date-new':
    garageItems
      .sort((a, b) => a.created_at > b.created_at)
      .forEach(item => appendItem(item));
    break;
  case 'date-old':
    garageItems
      .sort((a, b) => a.created_at < b.created_at)
      .forEach(item => appendItem(item));
    break;
  case 'clean':
    garageItems
      .sort((a, b) => a.cleanliness < b.cleanliness)
      .forEach(item => appendItem(item));
    break;
  default:
  }

  e.target.blur();
});

$('#new-item-inputs').on('submit', e => {
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
      garageItems.push(item);

      name.val('');
      reason.val('');
      cleanliness.val('');
    })
    .catch(err => console.log(err)); // eslint-disable-line no-console
});

$('#garage-items').on('focus', '.item-cleanliness', function() {
  $(this).data('prev', $(this).val());
});

$('#garage-items').on('change', '.item-cleanliness', function(e) {
  const changedItemId = $(this).closest('.item-card')[0].dataset.itemid;

  fetch('/api/v1/item', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: parseInt(changedItemId),
      cleanliness: e.target.value
    })
  })
    .then(() => {
      const sparklingCount = parseInt($('#sparkling-count').text());
      const dustyCount = parseInt($('#dusty-count').text());
      const rancidCount = parseInt($('#rancid-count').text());

      const prevVal = $(this).data('prev');


      switch (prevVal) {
      case 'sparkling':
        $('#sparkling-count').text(sparklingCount - 1);
        break;
      case 'dusty':
        $('#dusty-count').text(dustyCount - 1);
        break;
      case 'rancid':
        $('#rancid-count').text(rancidCount - 1);
        break;
      }

      switch (e.target.value) {
      case 'sparkling':
        $('#sparkling-count').text(sparklingCount + 1);
        break;
      case 'dusty':
        $('#dusty-count').text(dustyCount + 1);
        break;
      case 'rancid':
        $('#rancid-count').text(rancidCount + 1);
        break;
      }

      e.target.blur();
    })
    .catch(err => console.log(err)); // eslint-disable-line no-console


});


// FUNCTIONS //////////////////////////////////
///////////////////////////////////////////////

function appendItem(item) {
  $('#garage-items').prepend(`
    <div class="item-card" data-itemid="${item.id}">
      <h2 class="item-name">${item.item_name}</h2>
      <p class="item-reason"><span class="label">Reason:</span> ${item.reason}</p>
      <label class="label" htmlFor="item-cleanliness-${item.id}">Cleanliness:</label>
      <select id="item-cleanliness-${item.id}" class="item-cleanliness">
        <option ${item.cleanliness === 'sparkling' ? 'selected' : null} value="sparkling">Sparking</option>
        <option ${item.cleanliness === 'dusty' ? 'selected' : null} value="dusty">Dusty</option>
        <option ${item.cleanliness === 'rancid' ? 'selected' : null} value="rancid">Rancid</option>
      </select>
    </div>
  `);

  increaseCount(item);
}

function getGarageItems() {
  fetch('/api/v1/item')
    .then(data => data.json())
    .then(items => {
      items
        .sort((a, b) => a.created_at > b.created_at)
        .forEach(item => {
          appendItem(item);
          garageItems.push(item);
        });
    })
    .catch(err => console.log(err)); // eslint-disable-line no-console
}

function increaseCount(item) {
  const sparklingCount = parseInt($('#sparkling-count').text());
  const dustyCount = parseInt($('#dusty-count').text());
  const rancidCount = parseInt($('#rancid-count').text());
  const totalCount = parseInt($('#total-count').text());

  $('#total-count').text(totalCount + 1);

  switch (item.cleanliness) {
  case 'sparkling':
    $('#sparkling-count').text(sparklingCount + 1);
    break;
  case 'dusty':
    $('#dusty-count').text(dustyCount + 1);
    break;
  case 'rancid':
    $('#rancid-count').text(rancidCount + 1);
    break;
  }
}

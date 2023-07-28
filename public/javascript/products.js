


	const addToWishlistClient = async (id) => {
		const proName = document.getElementById('name' + id).value;
		document.getElementById('click' + id).innerHTML =
			`<img class="dis-block trans-04" src="images/icons/icon-heart-02.png" alt="ICON">`;

		let response = await fetch(`/add_to_wishlist?id=${id}`, {
			headers: {
				"Content-Type": "application/json"
			},
		});

		let data = await response.json();
		console.log(data);
		if (data && data.message === 'Added') {
			alertify.set('notifier', 'position', 'top-center');
			alertify.success(`${proName} Added to wishlist`);
		}
		
	};

	// Remove from WishList
	const removeFromWishlist = async (id) => {
		const proName = document.getElementById('name' + id).value

		document.getElementById('click' + id).innerHTML =
			`<img class=" dis-block trans-04" src="images/icons/icon-heart-01.png" alt="ICON">`

		let response = await fetch(`/remove_from_wishlist?id=${id}`, {
			headers: {
				"Content-Type": "application/json"
			},
		})

		let data = await response.json()
		console.log(data)
		if (data) {
			alertify.set('notifier', 'position', 'top-center');
			alertify.confirm(
				`${proName} will be removed from the wishlist. Are you sure?`,
				function () {
					// User clicked "OK" button
					// Perform the removal logic here
					// For example, you can call your removeWishlist function here
					// Replace productId with the ID of the item to be removed
					alertify.success(`${proName} Removed from wishlist`);
					 window.location.reload();
				},
				function () {
					// User clicked "Cancel" button
					// Optionally, you can show a cancellation message if needed
					alertify.error("Removal cancelled");
					 window.location.reload();
				}
			).set('labels', { ok: 'OK', cancel: 'Cancel' });

		}

	}

	// products.js

// Function to search products based on the input field value
function searchProducts() {
	const searchValue = document.getElementById('searchField').value.trim();
	if (searchValue !== '') {
	  fetch(`/searchProducts?query=${encodeURIComponent(searchValue)}`)
		.then((response) => response.json())
		.then((data) => {
		  // Update the product list with the search results
		  updateProductList(data);
		})
		.catch((error) => console.error('Error:', error));
	}
  }
  
  // Function to sort products by name (a-z or z-a) or price (asc or desc)
  function sortProductsBy(field, order) {
	fetch(`/sortProducts?field=${field}&order=${order}`)
	  .then((response) => response.json())
	  .then((data) => {
		// Update the product list with the sorted results
		updateProductList(data);
	  })
	  .catch((error) => console.error('Error:', error));
  }
  
 // Function to update the product list based on search and sort results
function updateProductList(products) {
	const productListContainer = document.getElementById('productList');
	productListContainer.innerHTML = '';
  
	if (products.length === 0) {
	  // Show a message when no products are found
	  productListContainer.innerHTML = '<p>No products found.</p>';
	} else {
	  products.forEach((product) => {
		// Generate the product HTML and append it to the container
		const productHTML = `
		  <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women">
			<div class="block2">
			  <div class="block2-pic hov-img0">
				<img src="/images/${product.image[0]}" alt="IMG-PRODUCT">
				<a href="/productDetail?id=${product._id}" class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04">
				  Quick View
				</a>
			  </div>
			  <div class="block2-txt flex-w flex-t p-t-14">
				<div class="block2-txt-child1 flex-col-l">
				  <a href="/productDetail?id=${product._id}" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
					${product.name}
				  </a>
				  <input type="hidden" id="name${product._id}" value="${product.name}">
				  <input type="hidden" id="id" value="${product._id}">
				  <span class="stext-105 cl3">
					₹ ${product.price}
				  </span>
				</div>
				<div class="block2-txt-child2 flex-r p-t-3">
				  <!-- Your wishlist icon here based on product.isWishlisted -->
				  ${
					product.isWishlisted
					  ? `<img onclick="removeFromWishlist('${product._id}')" id="icon-1" class="dis-block trans-04" src="images/icons/icon-heart-02.png" alt="ICON">`
					  : `<img onclick="addToWishlistClient('${product._id}')" id="icon-2" class="dis-block trans-04" src="images/icons/icon-heart-01.png" alt="ICON">`
				  }
				</div>
			  </div>
			</div>
		  </div>
		`;
  
		productListContainer.insertAdjacentHTML('beforeend', productHTML);
	  });
	}
  }
  
  
  // Add event listeners to the sort buttons
  document.getElementById('sortAZ').addEventListener('click', () => sortProductsBy('name', 'asc'));
  document.getElementById('sortZA').addEventListener('click', () => sortProductsBy('name', 'desc'));
  document.getElementById('sortLowToHigh').addEventListener('click', () => sortProductsBy('price', 'asc'));
  document.getElementById('sortHighToLow').addEventListener('click', () => sortProductsBy('price', 'desc'));
  



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


/// Add to wishlist ////////////

const addToWishlist = async (id) => {

    const proName = document.getElementById('name' + id).value
    document.getElementById('click' + id).innerHTML =
        `<img class=" dis-block trans-04" src="images/icons/icon-heart-02.png" alt="ICON">`

    let response = await fetch(`/add_to_wishlist?id=${id}`, {
        headers: {
            "Content-Type": "application/json"
        },
    })

    let data = await response.json()
    console.log(data)
    if (data) {
        alertify.set('notifier', 'position', 'bottom-center');
        alertify.success(`${proName} Added to wishlist`)
    }
}


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
        alertify.set('notifier', 'position', 'bottom-center');
        alertify.success(`${proName} Removed from wishlist`)
    }
}
/// remove from wishlist  ////////////



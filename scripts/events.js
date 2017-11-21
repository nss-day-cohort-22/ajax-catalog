

let editMode = {
    "enabled": false,
    "productId": null
}


/**
 * Add event listener for when a season is selected. On change,
 * invoke the Catalog.display() method with the corresponding
 * discount amount
 */
$("select[name='season']").on("change", e => {
    const optionSelected = $("option:selected", e.target)
    cat = Catalog.categories.find(c => c.id === parseInt(optionSelected.val()))
    Catalog.display(cat.discount)
})

/**
 * Add event listener for when a delete button is clicked for a product
 */
$(document).on("click", e => {

    /**
     * Handle edit
     */
    if (e.target.id && e.target.id.includes("edit!")) {
        const pid = e.target.id.split("!")[1]

        const currentProduct = Catalog.products[pid]
        
        $("input[name='productName']").val(currentProduct.name)
        $("select[name='productCategory']select").val(currentProduct.category_id)
        $("input[name='productPrice']").val(currentProduct.price)

        editMode.enabled = true
        editMode.productId = pid
    }
    
    /**
     * Handle delete
     */
    if (e.target.id && e.target.id.includes("delete!")) {
        // Get product id
        const pid = e.target.id.split("!")[1]

        // Submit DELETE request to Firebase
        $.ajax({
            url: `https://personal-site-5cb0d.firebaseio.com/products/${pid}/.json`,
            method: "DELETE"
        }).then(result => {
            Catalog.refreshData()
        })
    }
})





$("#productSave").on("click", e => {
    // Create new product object
    const newProduct = {
        name: $("input[name='productName']").val(),
        category_id: parseInt($("select[name='productCategory']").find(":selected").val()),
        price: parseFloat(parseFloat($("input[name='productPrice']").val()).toFixed(2))
    }
    
    if (editMode.enabled === false) {
        // Submit POST request to Firebase
        $.ajax({
            url: `https://personal-site-5cb0d.firebaseio.com/products/.json`,
            method: "POST",
            data: JSON.stringify(newProduct)
        }).then(r => {
            Catalog.refreshData()
        })
    } else {
        // Submit PUT request to Firebase
        $.ajax({
            url: `https://personal-site-5cb0d.firebaseio.com/products/${editMode.productId}/.json`,
            method: "PUT",
            data: JSON.stringify(newProduct)
        }).then(r => {
            Catalog.refreshData()
        })

    }
})

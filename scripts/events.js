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
    
    // Submit POST request to Firebase
    $.ajax({
        url: `https://personal-site-5cb0d.firebaseio.com/products/.json`,
        method: "POST",
        data: JSON.stringify(newProduct)
    }).then(r => {
        Catalog.refreshData()
    })
})

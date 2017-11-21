const outputEl = $(".productListing")


// Catalog object to store products, categories, and the display method
const Catalog = Object.create(null, {
    "products": {
        value: null,
        writable: true
    },
    "categories": {
        value: null,
        writable: true
    },
    "refreshData": {
        value: function () {
            $.ajax({ url: "https://personal-site-5cb0d.firebaseio.com/products.json" })
                .then(result => {
                    this.products = result
                    return $.ajax({ url: "https://personal-site-5cb0d.firebaseio.com/categories.json" })
                }).then(result => {
                    this.categories = result
                    this.display()
                    
                    // Add <option> tags to the drop down for each season
                    $("select[name='season']").empty()
                    $("select[name='productCategory']").empty()

                    $.each(result, function (index, cat) {
                        $("select[name='season']").append($('<option/>', { 
                            value: cat.id,
                            text : cat.season_discount 
                        }))
                        $("select[name='productCategory']").append($('<option/>', { 
                            value: cat.id,
                            text : cat.season_discount 
                        }))
                    })
                })
        }
    },
    "display": {
        value: function (discount = 0) {
            let finalHTML = ""

            for (let key in this.products) {
                const currentProduct = this.products[key]

                if (currentProduct) {
                    const productCategory = this.categories.find(c => c.id === currentProduct.category_id)

                    finalHTML += `
                        <article id="product!${key}">
                            <h1>${currentProduct.name}</h1>
                            <div>Category: ${productCategory.name}</div>
                            <div>Price: 
                                $${
                                    (productCategory.discount === discount) 
                                        ? (currentProduct.price * (1.0 - discount)).toFixed(2) 
                                        : currentProduct.price
                                }
                            </div>
                            <div>
                                <button id="delete!${key}">Delete Me</button>
                            </div>
                            <div>
                                <button id="edit!${key}">Edit Me</button>
                            </div>
                        </article>
                    `
                }

            }

            outputEl.html(finalHTML)
        }
    }
})

/**
 * Load the product & category data
 */
Catalog.refreshData()

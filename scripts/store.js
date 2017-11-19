$(document).ready(function () {

    const outputEl = $(".productListing")

    // Create XHR objects (not invoked yet)
    const getCategories = $.ajax({ url: "data/categories.json" })
    const getProducts = $.ajax({ url: "data/products.json" })

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
        "display": {
            value: function (discount = 0) {
                let finalHTML = ""

                this.products.forEach(product => {
                    const productCategory = this.categories.find(c => c.id === product.category_id)

                    finalHTML += `
                        <article id="product_${product.id}">
                            <h1>${product.name}</h1>
                            <div>Category: ${productCategory.name}</div>
                            <div>Price: 
                                $${
                                    (productCategory.discount === discount) 
                                        ? (product.price * (1.0 - discount)).toFixed(2) 
                                        : product.price
                                }
                            </div>
                        </article>
                    `
                })

                outputEl.html(finalHTML)
            }
        }
    })

    /**
     * Load the product & category data
     */
    getProducts
        .then(result => {
            Catalog.products = result.products
            return getCategories
        })
        .then(result => {
            Catalog.categories = result.categories
            Catalog.display()

            // Add <option> tags to the drop down for each season
            $.each(result.categories, function (index, cat) {
                $("select[name='season']").append($('<option/>', { 
                    value: cat.id,
                    text : cat.season_discount 
                }))
            })

        })

        /**
         * Add event listener for when a season is selected. On change,
         * invoke the Catalog.display() method with the corresponding
         * discount amount
         */
        $("select[name='season']").on("change", (e) => {
            const optionSelected = $("option:selected", this)
            cat = Catalog.categories.find(c => c.id === parseInt(optionSelected.val()))
            Catalog.display(cat.discount)
        })
})
/** blank array define */
var allProductsData = [];
var Amount = [];
var frequencyNo = null;
var frequencyNo = [];
var proId = [];
var proPrice = [];
var sellingPlanId = null;
var itemplanID = [];
var frequencyValue = null;
var items = [];
var formData = [];
var boxId = [];
var addonProduct = [];
var addonProductData = [];
class chooseProduct extends HTMLElement {
  constructor() {
    super();
    this.domEvents()
    var selectOptions = document.querySelectorAll("[select_variants]");
    if (selectOptions.length > 0) {
      this.variantSelect(selectOptions)
    }
    var dataAddon = document.querySelector("[data_addon]");
    dataAddon.addEventListener("click", (event) => {
      this.displayNextStep()
    })
    /* window load event */
    window.addEventListener("load", (event) => {
      let allBreadcrumbs = document.querySelectorAll('.breadcrumbs__list > li:not(:first-child)')
      allBreadcrumbs.forEach(el => {
        el.style.pointerEvents = 'none';
      })
    });
  }
  /**
  * Bind Events On page load
  */
  domEvents = () => {
    //step-1
    this.starSubscription = document.querySelectorAll("[data-productselection]");
    this.starSubscription.forEach(button => button.addEventListener("click", this.chooseProduct.bind(this)))
    //step-2
    this.quantityStep = document.querySelectorAll("[data-qty-box]");
    this.quantityStep.forEach(button => button.addEventListener("click", this.quantityNext.bind(this)))
    //step-3
    this.deliveryFrequency = document.querySelectorAll("[data-qty-frequency]");
    this.deliveryFrequency.forEach(button => button.addEventListener("click", this.deliverFrequency.bind(this)))
    this.navigation = document.querySelectorAll("[data_nav_step]");
    this.navigation.forEach(button => button.addEventListener("click", this.navigationData.bind(this)))
    //step-4
    this.manageQuantity = document.querySelectorAll("[data-quantity-btn]");
    this.manageQuantity.forEach(button => button.addEventListener('click', this.handleQuantity.bind(this)));
    //step - 5 
    this.button = document.querySelector('[data_add_to_cart]');
    this.button.addEventListener("click", this.addToCart.bind(this));
    //addon product
    this.button = document.querySelector('[data_addon]');
    this.button.addEventListener("click", this.addonItem.bind(this));

    // remove item
    this.removeItem = document.querySelector(".summary-body");
    this.removeItem.addEventListener('click', this.removeAddonItem.bind(this));
  }
  displayNextStep = () => {
    let nextStep = this.findNextStep(event);
    this.displayStep(nextStep);
  }
  /**
  *  Choose product option
  */
  chooseProduct = (event) => {
    event.preventDefault();
    let productId = event.target.closest("[data-productid]").getAttribute("data-productid");
    let totalPrice = event.target.closest("[data-productid]").getAttribute("data-productprice");
    let productJson = this.querySelector(`[data-productJson="${productId}"]`).innerHTML;
    let jsonObject = JSON.parse(productJson);
    allProductsData = [];
    allProductsData.push(jsonObject);
    document.querySelectorAll(".img-funnel").forEach((element) => {
      element.classList.remove("selected");
    })
    proId = [];
    proId.push(productId);
    proPrice = [];
    proPrice.push(totalPrice);
    event.target.classList.add("selected");
    let nextStep = this.findNextStep(event);
    this.displayStep(nextStep);
  }
  quantityNext = (event) => {
    event.preventDefault();
    let nextStep = this.findNextStep(event);
    let quantityNumber = event.target.closest("[quantity-number]").getAttribute("quantity-number");
    Amount = [];
    Amount.push(quantityNumber);
    document.querySelectorAll(".qty-box").forEach((element) => {
      element.classList.remove("selected");
    })
    event.target.classList.add("selected")
    this.displayStep(nextStep);
    this.showFrequency();
  }
  deliverFrequency = (event) => {
    event.preventDefault();
    let sellingProId = event.target.getAttribute("data_selling-planid");
    sellingPlanId = []
    sellingPlanId.push(sellingProId);
    let frequencyName = event.target.innerText;
    frequencyValue = []
    frequencyValue.push(frequencyName);
    let nextStep = this.findNextStep(event);
    document.querySelectorAll("[frequency_number]").forEach((element) => {
      element.classList.remove("selected");
    })
    event.target.classList.add("selected");
    this.displayStep(nextStep);
  }
  /**
  *  frequency selection
  */
  showFrequency() {
    frequencyNo = [];
    allProductsData[0].selling_plan_groups[0].selling_plans.forEach(deliveryDate => {
      var frequencyName = deliveryDate.name;
      var planID = deliveryDate.id;
      frequencyNo.push(frequencyName);
      itemplanID.push(planID);
    })
    document.querySelectorAll('.frequency-container').forEach((element, i) => {
      if (frequencyNo[i] != undefined) {
        element.querySelector('[frequency_number]').innerHTML = `${frequencyNo[i]}`;
        element.querySelector('[frequency_number]').setAttribute('data_selling-planid', itemplanID[i]);
      }
    });
  }
  navigationData = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    let targetData = event.target;
    let stepnumber = parseInt(event.target.closest('[data_nav_step]').getAttribute("data_nav_step"));
    this.displayStep(stepnumber);
  }
  /**
  *  Show Steps
  */
  displayStep = (index) => {
    document.querySelectorAll('[data-selector]').forEach(element => {
      element.classList.add('d-none');
    })
    document.querySelector(`[data-selector='${index}']`).classList.remove('d-none');
    document.querySelector(`[data-selector='${index}']`).classList.remove('d-none');
    document.querySelector(`[breadcrumbs-selector='${index}']`).style.pointerEvents = 'auto';
    document.querySelector(`[breadcrumbs-selector='${index}']`).classList.add('active-step')
    this.displaySummary();
  }
  findNextStep(event) {
    return parseInt(event.target.closest('[data-selector]').querySelector('[data-next_selector]').getAttribute('data-next_selector'));
  }
  /**addcartsubtext
  * 
  */
  displaySummary() {
    allProductsData.forEach(product => {
      document.querySelector('.pro_image').innerHTML = `
			<img src="${product.featured_image}" class="w-100" alt="" loading="lazy" width="20" height="20"/>
			<h5 class="mb-2 mt-3 text-center" data-seleted_product_title="">${product.title}</h5>
			`
    })
    let sumarrywraper = document.querySelector('[data-Summary]');
    if (sumarrywraper.querySelector('[data-selectedQty]') != null) {
      sumarrywraper.querySelector('[data-selectedQty]').innerHTML = `<p>${Amount}</p>`
    }
    if (sumarrywraper.querySelector('[data-selectedFreq]') != null) {
      sumarrywraper.querySelector('[data-selectedFreq]').innerHTML = `<p>${frequencyValue}</p>`
    }
    if (sumarrywraper.querySelector('[data-selectedFreq]') != null) {
      sumarrywraper.querySelector('[data-selectedPrice]').innerHTML = `<p>${proPrice}</p>`
    }
    document.querySelector('[data_add_to_cart]').setAttribute("productId", proId);
  }
  /**
  *  Cart Item Qunatity Increment/Decrement Button event
  */
  handleQuantity(event) {
    event.preventDefault();
    let currentTarget = event.currentTarget;
    let boxproId = currentTarget.closest('[data-qty-container]').querySelector('[data-productId]').getAttribute("data-productId");
    boxId.push(boxproId); // sub product array push
    let action = currentTarget.dataset.for || 'increase';
    let $qtyInputBox = currentTarget.closest('[data-qty-container]').querySelector('[data-qty-input-box]');
    var currentqty = parseInt($qtyInputBox.value) || 0;
    let finalQty = 1;

    if (action == 'decrease' && currentqty <= 0) {
      return false
    } else if (action == 'decrease') {
      finalQty = currentqty - 1;
      $qtyInputBox.value = finalQty;
      var bxId2 = document.querySelectorAll('[data-qty-input-box]');
        var totalCount = 0;
        bxId2.forEach(bxdata => {
          totalCount += +bxdata.value;
          if (totalCount < 5) {
            var $input = document.querySelectorAll(`[data-for="increase"]`);
            $input.forEach(el => {
              el.classList.remove('disabled')
            })
          }
        })
    } else {
      finalQty = currentqty + 1;
      $qtyInputBox.value = finalQty;
      addonProductData = [];
      var bxId3 = document.querySelectorAll('[data-qty-input-box]');
      bxId3.forEach(bxId2 => {
        if (parseInt(bxId2.value) > 0) {
          let id = bxId2.getAttribute('data-productid');
          addonProductData.push({
            'id': id,
            'title': bxId2.title,
            'quantity': bxId2.value,
            'src': bxId2.src,
          })
          this.displaySidebarSummary();
        }
      })
      var bxId2 = document.querySelectorAll('[data-qty-input-box]');
      var totalCount = 0;
      bxId2.forEach(bxdata => {
        totalCount += +bxdata.value;
        if (totalCount == 5) {
          var $inputEvent = document.querySelectorAll(`[data-for="increase"]`);
          $inputEvent.forEach(el => {
            el.classList.add('disabled')
          })
          this.snotify('error', `You can add only 5 product`);
        }
      })
    }
  }
  /**
    * sideBar summary display dynamic HTMl
    */
  displaySidebarSummary = () => {
    let selected_product_wrapper = document.querySelector('[data-selectedProducts]');
    selected_product_wrapper.innerHTML = '';
    addonProductData.forEach(pro => {
      if (pro.quantity >= 1) {
        selected_product_wrapper.innerHTML += `
				<div class="d-flex align-items-center justify-content-between" data-qty-container-addon="${pro.id}">
				<div class="quantity-wrapper d-flex flex-column">
						<label for="Quantity" class="d-none" title="">${pro.quantity}</label>
						<div class="input-group input-group-sm">
							<div class="input-group-prepend">
								<a href="#"  class="input-group-text" rel="nofollow" aria-label="quantity-minus" title="quantity-minus" data-for="decrease" data-qty-btn>
									<span class="btn-decrease"><span data-productid="${pro.id}" data-for="decrease" class="icon-minus"></span></span>
									<span class="visually-hidden">quantity-minus</span>
								</a>
							</div>
							<input type="number" input-qty-box name="quantity" aria-label="Quantity"
									value="${pro.quantity}" step="1" min="0"
									inputmode="numeric" data-qty-input class="quantity form-control text-center border-0 ps-lg-3 p-0 ms-0"  readonly>
							<div class="input-group-append m-0">
								<a href="#"  class="input-group-text" rel="nofollow" aria-label="quantity-plus" title="quantity-plus" data-for="increase" data-qty-btn>
									<span class="btn-increase"><span data-productid="${pro.id}" data-for="increase" class="icon-plus"></span></span>
									<span class="visually-hidden">quantity-plus</span>
								</a>
							</div>
						</div>
					</div>
					<h6> ${pro.title} </h6>
					<div class="pro_image">
					<img src="${pro.src}" class="w-100" alt="" loading="lazy" width="50" height="50"/>
					</div>
					<div>
							<a href="#" data-productid="${pro.id}" addon-remove-item data-qty="${pro.quantity}">
							<i class="icon-close"></i>
							</a>
					</div>
			</div>
				`
      }
    })
  }
  /* 
  * Remove addon item
  */
  removeAddonItem(event) {
    event.preventDefault();
    let currentTarget = event.target;
    if (currentTarget.classList.contains("icon-close")) {
      let product_id = currentTarget.closest('[data-productid').getAttribute('data-productid');
      document.querySelectorAll(`[data-qty-container="${product_id}"]`).forEach(ele => {
        ele.querySelector('input').value = 0;
      });
      event.target.closest('[data-qty-container-addon]').remove();
      var bxId2 = document.querySelectorAll('[input-qty-box]');
      var totalCount = 0;
      bxId2.forEach(bxdata => {
        totalCount += +bxdata.value;
        if (totalCount < 5) {
          var $input = document.querySelectorAll(`[data-for="increase"]`);
          $input.forEach(el => {
            el.classList.remove('disabled')
          })
        }
      })
    }
    let targetData = event.target.closest('.quantity-wrapper');
    let $qtyInputBox = targetData.querySelector('[data-qty-input]');
    let action = currentTarget.dataset.for || 'decrease';
    var currentQty = parseInt($qtyInputBox.value) || 0;
    let finalQty = 1;
    if (currentTarget.querySelector('.disabled') == null) {
      if (action == 'decrease' && currentQty <= 0) {
        return false
      } else if (action == 'decrease') {
        finalQty = currentQty - 1;
        $qtyInputBox.value = finalQty;
        if ($qtyInputBox.value == 0) {
          event.target.closest('[data-qty-container-addon]').remove();
        }
        let product_id = currentTarget.closest('[data-productid').getAttribute('data-productid');
        document.querySelectorAll(`[data-qty-container="${product_id}"]`).forEach(ele => {
          ele.querySelector('input').value = finalQty;
        });
        var bxId2 = document.querySelectorAll('[input-qty-box]');
        var totalCount = 0;
        bxId2.forEach(bxdata => {
          totalCount += +bxdata.value;
          if (totalCount < 5) {
            var $input = document.querySelectorAll(`[data-for="increase"]`);
            $input.forEach(el => {
              el.classList.remove('disabled')
            })
          }
        })
        
      } else {
        finalQty = currentQty + 1;
        $qtyInputBox.value = finalQty;
        let product_id = currentTarget.closest('[data-productid').getAttribute('data-productid');
        document.querySelectorAll(`[data-qty-container="${product_id}"]`).forEach(ele => {
          ele.querySelector('input').value = finalQty;
        });
        var bxId2 = document.querySelectorAll('[input-qty-box]');
        var totalCount = 0;
        bxId2.forEach(bxdata => {
          totalCount += +bxdata.value;
          if (totalCount == 5) {
            var $inputEvent = document.querySelectorAll(`[data-for="increase"]`);
            $inputEvent.forEach(el => {
              el.classList.add('disabled')
            })
            this.snotify('error', `You can add only 5 product`);
          }
        })
      }
    }

  }
  /*
   Notifications
 */
  snotify = (type, title) => {
    window.notificationEle.updateNotification(title, {
      type: type,
      timeout: 2000
    });
  }
  /**
  * Addon product
  */
  addonItem(event) {
    addonProduct = [];
    var bxId2 = document.querySelectorAll('[data-qty-input-box]');
    bxId2.forEach(bxdata => {
      if (parseInt(bxdata.value) > 0) {
        let id = bxdata.getAttribute('data-productid');
        addonProduct.push({
          'id': id,
          'quantity': bxdata.value
        })
      }
    })
  }
  /**
  * Add to cart items
  */
  variantSelect(selectOptions) {
    selectOptions.forEach(element => {
      element.addEventListener("change", (event) => {
        var varId = event.target.selectedOptions[0].getAttribute("variant-id");
        const productJson = event.target.closest('form').querySelector("[addon-data-ProductJson]").textContent;
        const jsonObject = JSON.parse(productJson);
        jsonObject.forEach((variant) => {
          if (variant.id == varId) {
            var productPrice = Shopify.formatMoney(variant.price);
            var optionVarId = variant.id;
            if (variant.compare_at_price) {
              var productComparePrice = Shopify.formatMoney(variant.compare_at_price);
              event.target.closest('.card-product').querySelector("[compare_price-data]").innerHTML = `${productComparePrice}`;
            }
            event.target.closest('.card-product').querySelector("[actual_price-data]").innerHTML = `${productPrice}`;
            event.target.closest('.card-product').querySelector("[data-qty-input-box]").setAttribute('data-productId', optionVarId);
          }
        });
      })
    })
  }
  /**
  * Add to cart items
  */
  addToCart = (event) => {
    event.preventDefault();
    let currentTarget = event.target
    let variantId = currentTarget.getAttribute('productid');
    currentTarget.classList.add('loading');
    addonProduct.forEach(addonItem => {
      items.push(
        addonItem
      )
    })
    items.push({
      id: variantId,
      quantity: 1,
      selling_plan: parseInt(sellingPlanId),
    })
    var formData = {
      items
    }
    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (response.status == 200) {
          currentTarget.classList.remove('loading')
          window.location.href = '/cart';
        }
      })
      .catch((error1) => {
        console.error('Error:', error1);
      })
  }
}
customElements.define("choose-product", chooseProduct)

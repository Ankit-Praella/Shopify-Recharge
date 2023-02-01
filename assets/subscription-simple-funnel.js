class chooseProduct extends  HTMLElement {
  constructor(){
    super();
    this.domEvents()
  }
  domEvents = () => {
    this.starsubscription = document.querySelectorAll("[data-productselection]");
    this.starsubscription.forEach(button => button.addEventListener("click", this.chooseProduct.bind(this)))
  }
  chooseProduct(event){
    event.preventDefault();
    let productId = event.target.closest("[data-productid]").getAttribute("data-productid");
    let productJson = this.querySelector(`[data-productJson="${productId}"]`).innerHTML
    let jsonData = JSON.parse(productJson);
    jsonData.options.filter((option) => {
      var optionName = option
      document.querySelector(".simple-funnel").style.display = "none";
      document.querySelector("[data-step-name]").style.display = "block";
      document.querySelector("[data-optionname]").innerHTML = `${optionName}`;
    })  
  }
}
customElements.define("choose-product",chooseProduct)
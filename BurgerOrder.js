const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  MENU: Symbol("menu"),
  SIZE: Symbol("size"),
  BBQSauce: Symbol("bbqsauce"),
  BMENU: Symbol("bmenu"),
  FMENU: Symbol("fmenu"),
  FSIZE: Symbol("fsize"),
  FKETCHUP: Symbol("fketchup"),
  CHICKEN: Symbol("chicken"),
  PAYMENT: Symbol("payment")
});

module.exports = class BurgerOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sSize = "";
    this.sBBQSauce = "";
    this.sCHICKEN = "";
    this.sItem = "burger";
    this.Price = 0;
    this.fSize = "";
    this.fKetchup = "";
    this.fItem = "wrap";
    this.ordermessage="";
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        this.stateCur = OrderState.MENU;
        aReturn.push("Welcome to Tj's FirePLace");
        aReturn.push("Menu: \n 1.Burger \n 2.Wrap");
        break;
      case OrderState.MENU:
        if (sInput.toLocaleLowerCase() == "burger") {
          this.stateCur = OrderState.SIZE
          aReturn.push("What size Burger would you like? Small:$4, Medium: $6, Large: $8");
        }
        else if (sInput.toLocaleLowerCase() == "wrap") {
          this.stateCur = OrderState.FSIZE
          aReturn.push("What size wrap would you like? Small:$2, Medium: $3, Large: $4");
        }
        else {
          aReturn.push("We only offer Burger and Wrap!");
        }
        break;
      case OrderState.SIZE:
        if (sInput.toLocaleLowerCase() == "small") {
          this.Price += 4;
          this.stateCur = OrderState.BBQSauce
          this.sSize = sInput;
          aReturn.push("Do you want BBQSauce on patty for $1?(Yes/No)");
        }
        else if (sInput.toLocaleLowerCase() == "medium") {
          this.stateCur = OrderState.BBQSauce
          this.sSize = sInput;
          this.Price += 6;
          aReturn.push("Do you want BBQSauce on patty for $1? (Yes/No)");
        }
        else if (sInput.toLocaleLowerCase() == "large") {
          this.stateCur = OrderState.BBQSauce
          this.sSize = sInput;
          this.Price += 8;
          aReturn.push("Do you want BBQSauce on patty for $1? (Yes/No)");
        }
        else {
          aReturn.push("We only offer Small/Medium/Large!");
        }
        break;
      case OrderState.BBQSauce:
        if (sInput.toLocaleLowerCase() == "yes" || sInput.toLocaleLowerCase() == "no") {
          this.sBBQSauce = sInput;
          if (sInput.toLocaleLowerCase() == "yes") {
            this.Price += 1;
          }

          if (this.fSize == "") {
            this.stateCur = OrderState.BMENU
            aReturn.push("Would you like our second menu item wrap?(Yes/No)");
          }
          else {
            this.stateCur = OrderState.CHICKEN
            aReturn.push("Would you like fried chicken for $8?(Yes/No)");
          }
        }
        else {
          aReturn.push("Please reply with Yes/No!");
        }
        break;
      case OrderState.BMENU:
        if (sInput.toLocaleLowerCase() == "yes") {
          this.stateCur = OrderState.FSIZE
          aReturn.push("What size wrap would you like? Small:$2, Medium: $3, Large: $4");
        }
        else if (sInput.toLocaleLowerCase() == "no") {
          this.stateCur = OrderState.CHICKEN
          aReturn.push("Would you like fried chicken for $8?(Yes/No)");
        }
        else {
          aReturn.push("Please reply with Yes/No");
        }
        break;
      case OrderState.FSIZE:
        if (sInput.toLocaleLowerCase() == "small") {
          this.stateCur = OrderState.FKETCHUP
          this.fSize = sInput;
          aReturn.push("Do you want Ketchup for $1? (Yes/No)");
          this.Price += 2;
        }
        else if (sInput.toLocaleLowerCase() == "medium") {
          this.stateCur = OrderState.FKETCHUP
          this.fSize = sInput;
          aReturn.push("Do you want Ketchup for $1?  (Yes/No)");
          this.Price += 3;
        }
        else if (sInput.toLocaleLowerCase() == "large") {
          this.stateCur = OrderState.FKETCHUP
          this.fSize = sInput;
          aReturn.push("Do you want Ketchup for $1?  (Yes/No)");
          this.Price += 4;
        }
        else {
          aReturn.push("We only offer Small/Medium/Large!");
        }
        break;

      case OrderState.FKETCHUP:
        if (sInput.toLocaleLowerCase() == "yes" || sInput.toLocaleLowerCase() == "no") {
          this.stateCur = OrderState.CHICKEN
          this.fKetchup = sInput;
          if (sInput.toLocaleLowerCase() == "yes") {
            this.Price += 1;
          }
          if (this.sSize == "") {
            this.stateCur = OrderState.FMENU
            aReturn.push("Would you like our first menu item burger?(Yes/No)");
          }
          else {
            this.stateCur = OrderState.CHICKEN
            aReturn.push("Would you like fried chicken for $8?(Yes/No)");
          }
        }
        else {
          aReturn.push("Please reply with Yes/No!");
        }
        break;
      case OrderState.FMENU:
        if (sInput.toLocaleLowerCase() == "yes") {
          this.stateCur = OrderState.SIZE
          aReturn.push("What size Burger would you like? Small:$4, Medium: $6, Large: $8");
        }
        else if (sInput.toLocaleLowerCase() == "no") {
          this.stateCur = OrderState.CHICKEN
          aReturn.push("Would you like fried chicken for $8?(Yes/No)");
        }
        else {
          aReturn.push("Please reply with Yes/No");
        }
        break;
      case OrderState.CHICKEN:
        if (sInput.toLocaleLowerCase() == "yes" || sInput.toLocaleLowerCase() == "no") {
          this.stateCur = OrderState.PAYMENT
          if (sInput.toLowerCase() != "no") {
            this.sCHICKEN = sInput;
            this.Price += 8;
          }
          this.nOrder = this.Price;
          aReturn.push(`Thank-you for your order of $${this.Price} `);
          if (this.sBBQSauce.toLocaleLowerCase() == "yes") {
            aReturn.push(`${this.sSize} ${this.sItem} with BBQ Sauce`);
            this.ordermessage+=(`${this.sSize} ${this.sItem} with BBQ Sauce `);
          }
          else if (this.sSize != "") {
            aReturn.push(`${this.sSize} ${this.sItem} with no BBQ Sauce`);
            this.ordermessage+=(`${this.sSize} ${this.sItem} with no BBQ Sauce `);
          }
          if (this.fKetchup.toLocaleLowerCase() == "yes") {
            aReturn.push(`${this.fSize} ${this.fItem} with ketchup`);
            this.ordermessage+=(`${this.fSize} ${this.fItem} with ketchup `);
          }
          else if (this.fSize != "") {
            aReturn.push(`${this.fSize} ${this.fItem} with no ketchup`);
            this.ordermessage+=(`${this.fSize} ${this.fItem} with no ketchup `);
          }
          if (this.sCHICKEN) {
            aReturn.push(`with Fried Chicken`);
            this.ordermessage+=(`with Fried Chicken `);
          }
          aReturn.push(`Please pay for your order here`);
          aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
        }
        else {
          aReturn.push("Please reply with Yes/No");
        }
        break;

      case OrderState.PAYMENT:
        console.log(sInput.purchase_units[0].shipping);
       /* console.log(sInput.purchase_units[0].shipping.name.full_name)*/
        this.isDone(true);
        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
      aReturn.push(`Your shipping address is Name: ${sInput.purchase_units[0].shipping.name.full_name}`); 
      aReturn.push(`${sInput.purchase_units[0].shipping.address.address_line_1} , ${sInput.purchase_units[0].shipping.address.admin_area_2} , ${sInput.purchase_units[0].shipping.address.admin_area_1} , ${sInput.purchase_units[0].shipping.address.postal_code} , ${sInput.purchase_units[0].shipping.address.country_code}`);
      break;
    }
    return aReturn;
  }
  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.sItem = sTitle;
    }
    if (sAmount != "-1") {
      this.nOrder = sAmount;
    }
    const sClientID = process.env.SB_CLIENT_ID || 'Af6IMgFRXAvIwh9l4g8timTC5HG5yfQ58ga0v4HK_gIxLInrPbmEr-tH-7dBUP1k4FzzL8VLH1KNqLMQ'
    return (`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.ordermessage} order of $${this.nOrder} please pay using any of the following:
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);

  }
}
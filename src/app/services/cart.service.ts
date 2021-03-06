import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  //Subject is a subclass of Observable
  //We can use Subject to publish event in our code
  //The event will be sent to all of subscribers
  //Behaviour Subject is a subclass for Subject, -> BSubject remember last event
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {
  }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our  cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {
      //find the item cart based on item id
      existingCartItem = this.cartItems.find(tempCarItem => tempCarItem.id === theCartItem.id)!;
      //  check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //  publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    //  1.CartStatusComponent -> subscribe for events -> CartService
    //  2.ProductListComponent-> addToCart(...) -> CartService
    //  3.Cart Service -> publish event to all subscribers '.next()' ->
    //  4.-> [CartStatusComponent] Update UI for total price and quantity

    //log cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the Cart');
    for (let tempCartItem of this.cartItems) {

      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;

      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity},
                    unitPrice: ${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    //fixed 2 -> np. 125.56, 3 -> 125.456
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-------------------');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity == 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    //  get index of item in array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id)
    //  if found, remove item from the array at thr given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
